import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

const secretKey = process.env.SESSION_SECRET || "your-secret-key-change-in-production"
const encodedKey = new TextEncoder().encode(secretKey)

import type { User } from "./types"

export interface SessionPayload {
  user: Pick<User, 'id' | 'name' | 'email'>
  expiresAt: Date
}

export async function createSession(payload: { user: Pick<User, 'id' | 'name' | 'email'> }) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const session: SessionPayload = {
    user: {
      id: String(payload.user.id),
      name: String(payload.user.name),
      email: String(payload.user.email)
    },
    expiresAt,
  }

  const token = await new SignJWT({
    user: session.user,
    expiresAt: session.expiresAt.toISOString()
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(encodedKey)

  const cookieStore = await cookies()
  await cookieStore.set({
    name: "session",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify<SessionPayload>(token, encodedKey, {
      algorithms: ["HS256"],
    })

    // Ensure the payload has the expected shape
    if (payload.user?.id && payload.user?.email && payload.expiresAt) {
      return {
        user: {
          id: String(payload.user.id),
          name: String(payload.user.name || ''),
          email: String(payload.user.email)
        } as Pick<User, 'id' | 'name' | 'email'>,
        expiresAt: new Date(payload.expiresAt)
      }
    }
    return null
  } catch (error) {
    console.error("Failed to verify session:", error)
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
