export interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

export interface Task {
  id: string
  userId: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  completed: boolean
  createdAt: string
  updatedAt: string
}
