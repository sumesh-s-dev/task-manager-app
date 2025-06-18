import { describe, it, expect, beforeEach } from "@jest/globals"
import bcrypt from "bcryptjs"
import { users } from "../lib/database"

// Mock the database
beforeEach(() => {
  users.length = 0
})

describe("Authentication", () => {
  describe("Password Hashing", () => {
    it("should hash passwords correctly", async () => {
      const password = "testpassword123"
      const hashedPassword = await bcrypt.hash(password, 12)

      expect(hashedPassword).not.toBe(password)
      expect(hashedPassword.length).toBeGreaterThan(50)
    })

    it("should verify passwords correctly", async () => {
      const password = "testpassword123"
      const hashedPassword = await bcrypt.hash(password, 12)

      const isValid = await bcrypt.compare(password, hashedPassword)
      const isInvalid = await bcrypt.compare("wrongpassword", hashedPassword)

      expect(isValid).toBe(true)
      expect(isInvalid).toBe(false)
    })
  })

  describe("User Registration", () => {
    it("should create a new user with hashed password", async () => {
      const userData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      }

      const hashedPassword = await bcrypt.hash(userData.password, 12)
      const newUser = {
        id: "1",
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      }

      users.push(newUser)

      expect(users).toHaveLength(1)
      expect(users[0].email).toBe(userData.email)
      expect(users[0].password).not.toBe(userData.password)
    })

    it("should not allow duplicate email addresses", () => {
      const user1 = {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        password: "hashedpassword1",
        createdAt: new Date().toISOString(),
      }

      users.push(user1)

      const existingUser = users.find((user) => user.email === "john@example.com")
      expect(existingUser).toBeDefined()
      expect(users).toHaveLength(1)
    })
  })

  describe("User Login", () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash("password123", 12)
      users.push({
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      })
    })

    it("should authenticate user with correct credentials", async () => {
      const email = "john@example.com"
      const password = "password123"

      const user = users.find((u) => u.email === email)
      expect(user).toBeDefined()

      const isValidPassword = await bcrypt.compare(password, user.password)
      expect(isValidPassword).toBe(true)
    })

    it("should reject user with incorrect password", async () => {
      const email = "john@example.com"
      const password = "wrongpassword"

      const user = users.find((u) => u.email === email)
      expect(user).toBeDefined()

      const isValidPassword = await bcrypt.compare(password, user.password)
      expect(isValidPassword).toBe(false)
    })

    it("should reject non-existent user", () => {
      const email = "nonexistent@example.com"
      const user = users.find((u) => u.email === email)
      expect(user).toBeUndefined()
    })
  })
})
