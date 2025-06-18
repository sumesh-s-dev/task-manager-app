import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { TaskDashboard } from "@/components/tasks/task-dashboard"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TaskDashboard user={session.user} />
    </div>
  )
}
