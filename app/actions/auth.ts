"use server"

import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { createSession, deleteSession } from "@/lib/session"
import { users } from "@/lib/database"
import { v4 as uuidv4 } from "uuid"
import type { User } from "@/lib/types"

type AuthResponse = {
  error: string | null
  data: { 
    session: { 
      user: { 
        id: string; 
        name: string; 
        email: string 
      } 
    } 
  } | null
}

export async function signup(formData: FormData): Promise<AuthResponse> {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Validate input
  if (!name || !email || !password) {
    return { error: "All fields are required", data: null }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters", data: null }
  }

  // Check if user already exists
  const existingUser = users.find((user) => user.email === email)
  if (existingUser) {
    return { error: "User already exists with this email", data: null }
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const user: User = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    }

    users.push(user)

    // Ensure name is a string (use empty string if null/undefined)
    const userName = user.name || ""
    
    // Create session
    await createSession({
      user: {
        id: user.id,
        name: userName,
        email: user.email,
      },
    })

    return { 
      error: null, 
      data: { 
        session: { 
          user: {
            id: user.id,
            name: userName,
            email: user.email
          }
        } 
      } 
    }
  } catch (error) {
    console.error("Signup error:", error)
    return { 
      error: error instanceof Error ? error.message : "Signup failed", 
      data: null 
    }
  }
}

export async function login(formData: FormData): Promise<AuthResponse> {
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

    // Ensure name is a string (use empty string if null/undefined)
    const userName = user.name || ""
    
    // Create session
    await createSession({
      user: {
        id: user.id,
        name: userName,
        email: user.email,
      },
    })

    return { 
      error: null, 
      data: { 
        session: { 
          user: {
            id: user.id,
            name: userName,
            email: user.email
          }
        } 
      } 
    }
  } catch (error) {
    console.error("Login error:", error)
    return { error: error instanceof Error ? error.message : "Something went wrong!", data: null }
  }
}

export async function logout() {
  await deleteSession()
  redirect("/")
}
