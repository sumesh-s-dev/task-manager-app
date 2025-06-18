"use server"

import { getSession } from "@/lib/session"
import { tasks } from "@/lib/database"
import { redirect } from "next/navigation"
import type { Task } from "@/lib/types"

export async function getTasks(): Promise<Task[]> {
  const session = await getSession()
  if (!session) {
    redirect("/auth/login")
  }

  return tasks
    .filter((task) => task.userId === session.user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function createTask(taskData: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">): Promise<Task> {
  const session = await getSession()
  if (!session) {
    redirect("/auth/login")
  }

  const newTask: Task = {
    id: Date.now().toString(),
    userId: session.user.id,
    title: taskData.title,
    description: taskData.description,
    priority: taskData.priority,
    completed: taskData.completed,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  tasks.push(newTask)
  return newTask
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
  const session = await getSession()
  if (!session) {
    redirect("/auth/login")
  }

  const taskIndex = tasks.findIndex((task) => task.id === taskId && task.userId === session.user.id)
  if (taskIndex === -1) {
    throw new Error("Task not found")
  }

  const updatedTask = {
    ...tasks[taskIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  tasks[taskIndex] = updatedTask
  return updatedTask
}

export async function deleteTask(taskId: string): Promise<void> {
  const session = await getSession()
  if (!session) {
    redirect("/auth/login")
  }

  const taskIndex = tasks.findIndex((task) => task.id === taskId && task.userId === session.user.id)
  if (taskIndex === -1) {
    throw new Error("Task not found")
  }

  tasks.splice(taskIndex, 1)
}
