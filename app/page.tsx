"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/auth/login-form"
import { StudentDashboard } from "@/components/dashboards/student-dashboard"
import { CompanyDashboard } from "@/components/dashboards/company-dashboard"
import { TeacherDashboard } from "@/components/dashboards/teacher-dashboard"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function HomePage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  switch (user.role) {
    case "etudiant":
      return <StudentDashboard />
    case "entreprise":
      return <CompanyDashboard />
    case "enseignant":
      return <TeacherDashboard />
    case "admin":
      return <AdminDashboard />
    default:
      return <LoginForm />
  }
}
