"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"

interface DashboardLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const { user, logout } = useAuth()

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "etudiant":
        return "Étudiant"
      case "entreprise":
        return "Entreprise"
      case "enseignant":
        return "Enseignant"
      case "admin":
        return "Administrateur"
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "etudiant":
        return "bg-blue-100 text-blue-800"
      case "entreprise":
        return "bg-green-100 text-green-800"
      case "enseignant":
        return "bg-purple-100 text-purple-800"
      case "admin":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
            </div>

            <div className="flex items-center gap-4">
              <NotificationDropdown />
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <Badge className={getRoleColor(user?.role || "")}>{getRoleLabel(user?.role || "")}</Badge>
                </div>
                <Avatar>
                  <AvatarFallback>
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
