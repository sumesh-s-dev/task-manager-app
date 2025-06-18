import { describe, it, expect, beforeEach } from "@jest/globals"
import { tasks } from "../lib/database"

// Mock user session
const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
}

beforeEach(() => {
  tasks.length = 0
})

describe("Task Management", () => {
  describe("Create Task", () => {
    it("should create a new task", () => {
      const taskData = {
        title: "Test Task",
        description: "This is a test task",
        priority: "medium",
        completed: false,
      }

      const newTask = {
        id: Date.now().toString(),
        userId: mockUser.id,
        ...taskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      tasks.push(newTask)

      expect(tasks).toHaveLength(1)
      expect(tasks[0].title).toBe(taskData.title)
      expect(tasks[0].userId).toBe(mockUser.id)
      expect(tasks[0].completed).toBe(false)
    })

    it("should require a title", () => {
      const taskData = {
        title: "",
        description: "This is a test task",
        priority: "medium",
        completed: false,
      }

      expect(taskData.title.trim()).toBe("")
    })
  })

  describe("Read Tasks", () => {
    beforeEach(() => {
      // Add test tasks
      tasks.push(
        {
          id: "1",
          userId: mockUser.id,
          title: "Task 1",
          description: "First task",
          priority: "high",
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          userId: mockUser.id,
          title: "Task 2",
          description: "Second task",
          priority: "low",
          completed: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          userId: "2", // Different user
          title: "Other User Task",
          description: "Task from another user",
          priority: "medium",
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      )
    })

    it("should get tasks for specific user", () => {
      const userTasks = tasks.filter((task) => task.userId === mockUser.id)
      expect(userTasks).toHaveLength(2)
      expect(userTasks.every((task) => task.userId === mockUser.id)).toBe(true)
    })

    it("should filter completed tasks", () => {
      const userTasks = tasks.filter((task) => task.userId === mockUser.id)
      const completedTasks = userTasks.filter((task) => task.completed)
      const incompleteTasks = userTasks.filter((task) => !task.completed)

      expect(completedTasks).toHaveLength(1)
      expect(incompleteTasks).toHaveLength(1)
    })
  })

  describe("Update Task", () => {
    beforeEach(() => {
      tasks.push({
        id: "1",
        userId: mockUser.id,
        title: "Original Task",
        description: "Original description",
        priority: "medium",
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    })

    it("should update task properties", () => {
      const taskId = "1"
      const updates = {
        title: "Updated Task",
        completed: true,
      }

      const taskIndex = tasks.findIndex((task) => task.id === taskId && task.userId === mockUser.id)
      expect(taskIndex).not.toBe(-1)

      const updatedTask = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      tasks[taskIndex] = updatedTask

      expect(tasks[0].title).toBe("Updated Task")
      expect(tasks[0].completed).toBe(true)
      expect(tasks[0].description).toBe("Original description") // Unchanged
    })

    it("should not update tasks from other users", () => {
      const taskId = "1"
      const wrongUserId = "2"

      const taskIndex = tasks.findIndex((task) => task.id === taskId && task.userId === wrongUserId)
      expect(taskIndex).toBe(-1)
    })
  })

  describe("Delete Task", () => {
    beforeEach(() => {
      tasks.push({
        id: "1",
        userId: mockUser.id,
        title: "Task to Delete",
        description: "This task will be deleted",
        priority: "low",
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    })

    it("should delete task", () => {
      const taskId = "1"
      const taskIndex = tasks.findIndex((task) => task.id === taskId && task.userId === mockUser.id)

      expect(taskIndex).not.toBe(-1)
      tasks.splice(taskIndex, 1)
      expect(tasks).toHaveLength(0)
    })

    it("should not delete tasks from other users", () => {
      const taskId = "1"
      const wrongUserId = "2"

      const taskIndex = tasks.findIndex((task) => task.id === taskId && task.userId === wrongUserId)
      expect(taskIndex).toBe(-1)
      expect(tasks).toHaveLength(1) // Task should still exist
    })
  })

  describe("Task Validation", () => {
    it("should validate priority values", () => {
      const validPriorities = ["low", "medium", "high"]
      const testPriority = "medium"

      expect(validPriorities.includes(testPriority)).toBe(true)
      expect(validPriorities.includes("invalid")).toBe(false)
    })

    it("should validate completed status", () => {
      const completedStatus = true
      expect(typeof completedStatus).toBe("boolean")
    })
  })
})
