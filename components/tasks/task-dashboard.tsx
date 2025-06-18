"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskForm } from "./task-form"
import { TaskList } from "./task-list"
import { logout } from "@/app/actions/auth"
import { getTasks, createTask, updateTask, deleteTask } from "@/app/actions/tasks"
import { Plus, LogOut, CheckSquare } from "lucide-react"
import type { Task, User } from "@/lib/types"

interface TaskDashboardProps {
  user: User
}

export function TaskDashboard({ user }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    try {
      const userTasks = await getTasks()
      setTasks(userTasks)
    } catch (error) {
      console.error("Failed to load tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateTask(taskData: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">) {
    try {
      const newTask = await createTask(taskData)
      setTasks((prev) => [newTask, ...prev])
      setShowTaskForm(false)
    } catch (error) {
      console.error("Failed to create task:", error)
    }
  }

  async function handleUpdateTask(taskId: string, taskData: Partial<Task>) {
    try {
      const updatedTask = await updateTask(taskId, taskData)
      setTasks((prev) => prev.map((task) => (task.id === taskId ? updatedTask : task)))
      setEditingTask(null)
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      await deleteTask(taskId)
      setTasks((prev) => prev.filter((task) => task.id !== taskId))
    } catch (error) {
      console.error("Failed to delete task:", error)
    }
  }

  async function handleLogout() {
    await logout()
  }

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600 mt-1">Manage your tasks and stay productive</p>
        </div>
        <Button onClick={handleLogout} variant="outline" size="sm">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalTasks - completedTasks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Add Task Button */}
      <div className="mb-6">
        <Button onClick={() => setShowTaskForm(true)} className="w-full sm:w-auto" size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Add New Task
        </Button>
      </div>

      {/* Task Form */}
      {(showTaskForm || editingTask) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingTask ? "Edit Task" : "Create New Task"}</CardTitle>
            <CardDescription>
              {editingTask ? "Update your task details" : "Add a new task to your list"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TaskForm
              task={editingTask}
              onSubmit={editingTask ? (data) => handleUpdateTask(editingTask.id, data) : handleCreateTask}
              onCancel={() => {
                setShowTaskForm(false)
                setEditingTask(null)
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Task List */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <CheckSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
            <p className="text-gray-600 mb-4">Create your first task to get started!</p>
            <Button onClick={() => setShowTaskForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TaskList
          tasks={tasks}
          onEdit={setEditingTask}
          onDelete={handleDeleteTask}
          onToggleComplete={(taskId, completed) => handleUpdateTask(taskId, { completed })}
        />
      )}
    </div>
  )
}
