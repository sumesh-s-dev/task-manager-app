import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare, Users, Shield, Smartphone } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">TaskFlow</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your productivity with our secure, mobile-first task management solution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <CheckSquare className="h-12 w-12 mx-auto text-blue-600 mb-2" />
              <CardTitle>Task Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Create, update, and organize your tasks with full CRUD operations</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 mx-auto text-green-600 mb-2" />
              <CardTitle>Secure Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Password hashing and secure session management protect your data</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Smartphone className="h-12 w-12 mx-auto text-purple-600 mb-2" />
              <CardTitle>Mobile First</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Responsive design optimized for mobile devices and tablets</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto text-orange-600 mb-2" />
              <CardTitle>User Focused</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Personal task spaces with comprehensive testing coverage</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to boost your productivity?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of users who trust TaskFlow for their daily task management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/auth/signup">Start Managing Tasks Today</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
