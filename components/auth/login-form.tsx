"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { GraduationCap, Building2, Users, Shield } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  const demoAccounts = [
    { type: "Étudiant", email: "student@university.fr", icon: GraduationCap },
    { type: "Entreprise", email: "company@techcorp.fr", icon: Building2 },
    { type: "Enseignant", email: "teacher@university.fr", icon: Users },
    { type: "Admin", email: "admin@university.fr", icon: Shield },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
            <CardDescription>Accédez à votre espace de gestion de stages</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.fr"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Comptes de démonstration</CardTitle>
            <CardDescription>Cliquez sur un compte pour vous connecter automatiquement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoAccounts.map((account) => {
              const Icon = account.icon
              return (
                <Button
                  key={account.type}
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto p-4 bg-transparent"
                  onClick={() => {
                    setEmail(account.email)
                    setPassword("demo123")
                  }}
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">{account.type}</div>
                    <div className="text-sm text-muted-foreground">{account.email}</div>
                  </div>
                </Button>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
