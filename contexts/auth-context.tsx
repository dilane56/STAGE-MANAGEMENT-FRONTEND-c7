"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export type UserRole = "etudiant" | "entreprise" | "enseignant" | "admin"

export interface User {
  id: number
  email: string
  name: string
  telephone?: string
  avatar?: string
  role: UserRole
  createAt?: string
  updateAt?: string
  profile: {
    filiere?: string
    anneeScolaire?: string
    niveau?: string
    universite?: string
    domaineActivite?: string
    siteWeb?: string
    description?: string
    dateCreation?: string
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const API_BASE_URL = "http://localhost:9001"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkExistingSession = async () => {
      const token = localStorage.getItem("token")
      const refreshToken = localStorage.getItem("refreshToken")
      
      if (token && refreshToken) {
        try {
          // Try to refresh token to validate session
          const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
          })
          
          if (response.ok) {
            const data = await response.json()
            if (data.success) {
              localStorage.setItem("token", data.token)
              const savedUser = localStorage.getItem("user")
              if (savedUser) {
                setUser(JSON.parse(savedUser))
              }
            }
          } else {
            // Clear invalid tokens
            localStorage.removeItem("token")
            localStorage.removeItem("refreshToken")
            localStorage.removeItem("user")
          }
        } catch (error) {
          console.error("Session check failed:", error)
          localStorage.removeItem("token")
          localStorage.removeItem("refreshToken")
          localStorage.removeItem("user")
        }
      }
      setIsLoading(false)
    }

    checkExistingSession()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Échec de la connexion")
      }
      
      const { user: userData, token, refreshToken } = data.data
      
      // Store tokens and user data
      localStorage.setItem("token", token)
      localStorage.setItem("refreshToken", refreshToken)
      localStorage.setItem("user", JSON.stringify(userData))
      
      setUser(userData)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear local storage regardless of API call result
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
      setUser(null)
    }
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
