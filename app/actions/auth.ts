"use server"

import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { createSession, deleteSession } from "@/lib/session"
import { users } from "@/lib/database"
import type { User } from "@/lib/types"

export async function signup(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Validate input
  if (!name || !email || !password) {
    return { success: false, error: "All fields are required" }
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" }
  }

  // Check if user already exists
  const existingUser = await db.user.findFirst({ where: { email } })
  if (existingUser) {
    return { success: false, error: "User already exists with this email" }
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Create session
    const session = await createSession({
      user: {
        id: user.id,
        name: user.name || "",
        email: user.email,
      },
    })

    return { error: null, data: { session } }
  } catch (error) {
    console.error("Signup error:", error)
    return { 
      error: error instanceof Error ? error.message : "Signup failed", 
      data: null 
    }
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required", data: null }
  }

  try {
    // Find user
    const user = users.find((u) => u.email === email)
    if (!user) {
      return { error: "Invalid credentials", data: null }
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return { error: "Invalid credentials", data: null }
    }

    // Create session
    const session = await createSession({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })

    return { error: null, data: { session } }
  } catch (error) {
    console.error("Login error:", error)
    return { error: error instanceof Error ? error.message : "Something went wrong!", data: null }
  }
}

export async function logout() {
  await deleteSession()
  redirect("/")
}
