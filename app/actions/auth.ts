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
  const existingUser = users.find((user) => user.email === email)
  if (existingUser) {
    return { success: false, error: "User already exists with this email" }
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)

    // Create session
    await createSession({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to create account" }
  }
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  try {
    // Find user
    const user = users.find((u) => u.email === email)
    if (!user) {
      return { success: false, error: "Invalid credentials" }
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return { success: false, error: "Invalid credentials" }
    }

    // Create session
    await createSession({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: "Login failed" }
  }
}

export async function logout() {
  await deleteSession()
  redirect("/")
}
