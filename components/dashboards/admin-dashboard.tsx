"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Users, Building2, FileText, TrendingUp, Plus, Eye, Settings, Download, Search, Trash2, Tag } from "lucide-react"
import { userService, type BackendUser } from "@/lib/user-service"
import { statsService, type AdminStats } from "@/lib/stats-service"
import { secteurService, type Secteur } from "@/lib/secteur-service"
import { CreateUserModal } from "@/components/admin/create-user-modal"
import { ViewUserModal } from "@/components/admin/view-user-modal"
import { EditUserModal } from "@/components/admin/edit-user-modal"
import { CreateSecteurModal } from "@/components/admin/secteurs/create-secteur-modal"
import { EditSecteurModal } from "@/components/admin/secteurs/edit-secteur-modal"

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalCompanies: 0,
    totalInternships: 0,
    totalConventions: 0,
    activeInternships: 0,
    pendingConventions: 0,
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

  const [users, setUsers] = useState<BackendUser[]>([])
  const [secteurs, setSecteurs] = useState<Secteur[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSecteurs, setIsLoadingSecteurs] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<BackendUser | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCreateSecteurModalOpen, setIsCreateSecteurModalOpen] = useState(false)
  const [selectedSecteur, setSelectedSecteur] = useState<Secteur | null>(null)
  const [isEditSecteurModalOpen, setIsEditSecteurModalOpen] = useState(false)

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const data = await userService.getUsers()
      setUsers(data)
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadSecteurs = async () => {
    setIsLoadingSecteurs(true)
    try {
      const data = await secteurService.getAllSecteurs()
      setSecteurs(data)
    } catch (error) {
      console.error('Erreur lors du chargement des secteurs:', error)
    } finally {
      setIsLoadingSecteurs(false)
    }
  }

  useEffect(() => {
    loadUsers()
    loadStats()
    loadSecteurs()
  }, [])

  const loadStats = async () => {
    try {
      const data = await statsService.getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await userService.deleteUser(userId)
        loadUsers()
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        alert('Erreur lors de la suppression de l\'utilisateur')
      }
    }
  }

  const handleDeleteSecteur = async (secteurId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce secteur ?')) {
      try {
        await secteurService.deleteSecteur(secteurId)
        loadSecteurs()
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        alert('Erreur lors de la suppression du secteur')
      }
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ETUDIANT":
        return "Étudiant"
      case "ENTREPRISE":
        return "Entreprise"
      case "ENSEIGNANT":
        return "Enseignant"
      case "ADMIN":
        return "Admin"
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ETUDIANT":
        return "bg-blue-100 text-blue-800"
      case "ENTREPRISE":
        return "bg-green-100 text-green-800"
      case "ENSEIGNANT":
        return "bg-purple-100 text-purple-800"
      case "ADMIN":
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
            <TabsTrigger value="secteurs">Secteurs</TabsTrigger>
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
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvel utilisateur
              </Button>
            </div>



            <Card>
              <CardHeader>
                <CardTitle>Liste des utilisateurs ({users.length})</CardTitle>
                <CardDescription>Gestion des comptes utilisateurs</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Chargement...</div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-medium">{user.fullName}</h3>
                            <Badge className={getRoleColor(user.role)}>{getRoleLabel(user.role)}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          {user.telephone && (
                            <p className="text-xs text-muted-foreground">{user.telephone}</p>
                          )}
                          {user.createAt && (
                            <p className="text-xs text-muted-foreground">
                              Inscrit le {new Date(user.createAt).toLocaleDateString("fr-FR")}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsViewModalOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsEditModalOpen(true)
                            }}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    ))}
                    

                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="secteurs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des secteurs</h2>
              <Button onClick={() => setIsCreateSecteurModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau secteur
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Liste des secteurs ({secteurs.length})</CardTitle>
                <CardDescription>Gestion des secteurs d'activité pour les offres de stage</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingSecteurs ? (
                  <div className="text-center py-8">Chargement...</div>
                ) : (
                  <div className="space-y-4">
                    {secteurs.map((secteur) => (
                      <div key={secteur.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Tag className="h-5 w-5 text-primary" />
                          <div>
                            <h3 className="font-medium">{secteur.nomSecteur}</h3>
                            <p className="text-sm text-muted-foreground">ID: {secteur.id}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedSecteur(secteur)
                              setIsEditSecteurModalOpen(true)
                            }}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteSecteur(secteur.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    ))}
                    {secteurs.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Aucun secteur trouvé. Créez le premier secteur.
                      </div>
                    )}
                  </div>
                )}
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
        
        <CreateUserModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onUserCreated={loadUsers}
        />
        
        <ViewUserModal 
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          user={selectedUser}
        />
        
        <EditUserModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUserUpdated={loadUsers}
          user={selectedUser}
        />
        
        <CreateSecteurModal 
          isOpen={isCreateSecteurModalOpen}
          onClose={() => setIsCreateSecteurModalOpen(false)}
          onSecteurCreated={loadSecteurs}
        />
        
        <EditSecteurModal 
          isOpen={isEditSecteurModalOpen}
          onClose={() => setIsEditSecteurModalOpen(false)}
          onSecteurUpdated={loadSecteurs}
          secteur={selectedSecteur}
        />
      </div>
    </DashboardLayout>
  )
}
