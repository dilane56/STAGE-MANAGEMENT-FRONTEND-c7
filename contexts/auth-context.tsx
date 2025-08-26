"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export type UserRole = "student" | "company" | "teacher" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  profile?: {
    university?: string
    field?: string
    company?: string
    department?: string
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock user based on email domain
    let mockUser: User
    if (email.includes("student")) {
      mockUser = {
        id: "1",
        email,
        name: "Marie Dubois",
        role: "student",
        profile: { university: "Université Paris-Saclay", field: "Informatique" },
      }
    } else if (email.includes("company")) {
      mockUser = {
        id: "2",
        email,
        name: "Jean Martin",
        role: "company",
        profile: { company: "TechCorp" },
      }
    } else if (email.includes("teacher")) {
      mockUser = {
        id: "3",
        email,
        name: "Prof. Sophie Laurent",
        role: "teacher",
        profile: { university: "Université Paris-Saclay", department: "Informatique" },
      }
    } else {
      mockUser = {
        id: "4",
        email,
        name: "Admin Système",
        role: "admin",
      }
    }

    setUser(mockUser)
    localStorage.setItem("user", JSON.stringify(mockUser))
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
