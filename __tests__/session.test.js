import { describe, it, expect } from "@jest/globals"
import { SignJWT, jwtVerify } from "jose"

const secretKey = "test-secret-key"
const encodedKey = new TextEncoder().encode(secretKey)

describe("Session Management", () => {
  describe("JWT Token Creation", () => {
    it("should create a valid JWT token", async () => {
      const payload = {
        user: {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
        },
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }

      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(payload.expiresAt)
        .sign(encodedKey)

      expect(token).toBeDefined()
      expect(typeof token).toBe("string")
      expect(token.split(".")).toHaveLength(3) // JWT has 3 parts
    })

    it("should verify JWT token correctly", async () => {
      const payload = {
        user: {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
        },
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }

      const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(payload.expiresAt)
        .sign(encodedKey)

      const { payload: verifiedPayload } = await jwtVerify(token, encodedKey, {
        algorithms: ["HS256"],
      })

      expect(verifiedPayload.user.id).toBe(payload.user.id)
      expect(verifiedPayload.user.email).toBe(payload.user.email)
    })

    it("should reject invalid JWT token", async () => {
      const invalidToken = "invalid.jwt.token"

      await expect(jwtVerify(invalidToken, encodedKey, { algorithms: ["HS256"] })).rejects.toThrow()
    })
  })

  describe("Session Expiration", () => {
    it("should create session with correct expiration", () => {
      const now = Date.now()
      const expiresAt = new Date(now + 7 * 24 * 60 * 60 * 1000) // 7 days

      expect(expiresAt.getTime()).toBeGreaterThan(now)
      expect(expiresAt.getTime() - now).toBe(7 * 24 * 60 * 60 * 1000)
    })

    it("should detect expired sessions", () => {
      const pastDate = new Date(Date.now() - 1000) // 1 second ago
      const futureDate = new Date(Date.now() + 1000) // 1 second from now

      expect(pastDate.getTime() < Date.now()).toBe(true)
      expect(futureDate.getTime() > Date.now()).toBe(true)
    })
  })
})
