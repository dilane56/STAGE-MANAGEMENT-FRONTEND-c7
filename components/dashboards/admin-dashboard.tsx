"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Users, Building2, FileText, TrendingUp, Plus, Eye, Settings, Download } from "lucide-react"

interface SystemStats {
  totalUsers: number
  totalCompanies: number
  totalInternships: number
  totalConventions: number
  activeInternships: number
  pendingConventions: number
}

export function AdminDashboard() {
  const [stats] = useState<SystemStats>({
    totalUsers: 1247,
    totalCompanies: 89,
    totalInternships: 156,
    totalConventions: 134,
    activeInternships: 78,
    pendingConventions: 23,
  })

  const internshipsByField = [
    { name: "Informatique", value: 65, color: "#3b82f6" },
    { name: "Marketing", value: 28, color: "#10b981" },
    { name: "Design", value: 22, color: "#f59e0b" },
    { name: "Finance", value: 18, color: "#ef4444" },
    { name: "RH", value: 12, color: "#8b5cf6" },
    { name: "Autres", value: 11, color: "#6b7280" },
  ]

  const monthlyStats = [
    { month: "Jan", internships: 12, applications: 45 },
    { month: "Fév", internships: 18, applications: 67 },
    { month: "Mar", internships: 25, applications: 89 },
    { month: "Avr", internships: 32, applications: 112 },
    { month: "Mai", internships: 28, applications: 98 },
    { month: "Jun", internships: 35, applications: 134 },
  ]

  const recentUsers = [
    { id: "1", name: "Marie Dubois", email: "marie.dubois@student.fr", role: "student", joinDate: "2024-01-25" },
    { id: "2", name: "TechCorp", email: "contact@techcorp.fr", role: "company", joinDate: "2024-01-24" },
    { id: "3", name: "Pierre Martin", email: "pierre.martin@student.fr", role: "student", joinDate: "2024-01-23" },
    { id: "4", name: "Prof. Laurent", email: "laurent@university.fr", role: "teacher", joinDate: "2024-01-22" },
  ]

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "student":
        return "Étudiant"
      case "company":
        return "Entreprise"
      case "teacher":
        return "Enseignant"
      case "admin":
        return "Admin"
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student":
        return "bg-blue-100 text-blue-800"
      case "company":
        return "bg-green-100 text-green-800"
      case "teacher":
        return "bg-purple-100 text-purple-800"
      case "admin":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout title="Administration" subtitle="Vue d'ensemble du système de gestion de stages">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Utilisateurs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalCompanies}</p>
                  <p className="text-sm text-muted-foreground">Entreprises</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalInternships}</p>
                  <p className="text-sm text-muted-foreground">Stages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.activeInternships}</p>
                  <p className="text-sm text-muted-foreground">Stages actifs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stages par filière */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par filière</CardTitle>
                  <CardDescription>Distribution des stages par domaine d'études</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: "Stages",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={internshipsByField}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {internshipsByField.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Évolution mensuelle */}
              <Card>
                <CardHeader>
                  <CardTitle>Évolution mensuelle</CardTitle>
                  <CardDescription>Nombre de stages et candidatures par mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      internships: {
                        label: "Stages",
                        color: "hsl(var(--chart-1))",
                      },
                      applications: {
                        label: "Candidatures",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyStats}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="internships" fill="var(--color-chart-1)" />
                        <Bar dataKey="applications" fill="var(--color-chart-2)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Alertes et actions rapides */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alertes système</CardTitle>
                  <CardDescription>Actions nécessitant votre attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium">Conventions en attente</p>
                      <p className="text-sm text-muted-foreground">{stats.pendingConventions} conventions à valider</p>
                    </div>
                    <Button size="sm">Voir</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Nouveaux utilisateurs</p>
                      <p className="text-sm text-muted-foreground">12 inscriptions cette semaine</p>
                    </div>
                    <Button size="sm">Voir</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                  <CardDescription>Raccourcis vers les tâches courantes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un compte utilisateur
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter les données
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuration système
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvel utilisateur
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Utilisateurs récents</CardTitle>
                <CardDescription>Dernières inscriptions sur la plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium">{user.name}</h3>
                          <Badge className={getRoleColor(user.role)}>{getRoleLabel(user.role)}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Inscrit le {new Date(user.joinDate).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                        <Button size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Gérer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Rapports et exports</h2>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Exporter tout
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rapports disponibles</CardTitle>
                  <CardDescription>Générez des rapports détaillés</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Rapport des stages par filière
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Liste des utilisateurs actifs
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Building2 className="h-4 w-4 mr-2" />
                    Partenaires entreprises
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Statistiques de performance
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Exports de données</CardTitle>
                  <CardDescription>Téléchargez les données au format Excel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export stages 2024
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export conventions signées
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export utilisateurs
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export entreprises partenaires
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
