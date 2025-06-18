import type { User, Task } from "./types"

// In-memory database for demo purposes
// In production, use a real database like PostgreSQL, MongoDB, etc.
export const users: User[] = []
export const tasks: Task[] = []
