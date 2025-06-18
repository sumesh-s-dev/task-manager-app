"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Calendar } from "lucide-react"
import type { Task } from "@/lib/types"

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onToggleComplete: (taskId: string, completed: boolean) => void
}

export function TaskList({ tasks, onEdit, onDelete, onToggleComplete }: TaskListProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className={`transition-all ${task.completed ? "opacity-75" : ""}`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => onToggleComplete(task.id, !!checked)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <CardTitle className={`text-lg ${task.completed ? "line-through text-gray-500" : ""}`}>
                    {task.title}
                  </CardTitle>
                  {task.description && <CardDescription className="mt-1">{task.description}</CardDescription>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                <Button variant="ghost" size="icon" onClick={() => onEdit(task)} className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(task.id)}
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              Created {formatDate(task.createdAt)}
              {task.updatedAt !== task.createdAt && (
                <span className="ml-2">• Updated {formatDate(task.updatedAt)}</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
