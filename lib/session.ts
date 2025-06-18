import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

const secretKey = process.env.SESSION_SECRET || "your-secret-key-change-in-production"
const encodedKey = new TextEncoder().encode(secretKey)

export interface SessionPayload {
  user: {
    id: string
    name: string
    email: string
  }
  expiresAt: Date
}

export async function createSession(payload: { user: { id: string; name: string; email: string } }) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const session: SessionPayload = {
    user: payload.user,
    expiresAt,
  }

  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(encodedKey)

  const cookieStore = await cookies()
  cookieStore.set("session", token, {
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
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    })

    return payload as SessionPayload
  } catch (error) {
    console.error("Failed to verify session:", error)
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
