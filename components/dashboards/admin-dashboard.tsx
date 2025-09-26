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
import { Users, Building2, FileText, TrendingUp, Plus, Eye, Settings, Download, Search, Trash2, Tag, MapPin, Clock, CheckCircle } from "lucide-react"
import { userService, type BackendUser } from "@/lib/user-service"
import { statsService, type AdminStats, type MonthlyStats, type SectorStats } from "@/lib/stats-service"
import { secteurService, type Secteur } from "@/lib/secteur-service"
import { internshipService, type InternshipOffer } from "@/lib/internship-service"
import { conventionService, type Convention } from "@/lib/convention-service"
import { ViewConventionModal } from "@/components/admin/view-convention-modal"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { reportsService } from "@/lib/reports-service"
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

  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([])
  const [internshipsByField, setInternshipsByField] = useState<SectorStats[]>([])
  const [isLoadingCharts, setIsLoadingCharts] = useState(false)

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
  const [internships, setInternships] = useState<InternshipOffer[]>([])
  const [conventions, setConventions] = useState<Convention[]>([])
  const [isLoadingInternships, setIsLoadingInternships] = useState(false)
  const [isLoadingConventions, setIsLoadingConventions] = useState(false)
  const [selectedConvention, setSelectedConvention] = useState<Convention | null>(null)
  const [isViewConventionModalOpen, setIsViewConventionModalOpen] = useState(false)
  const { user } = useAuth()

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

  const loadInternships = async () => {
    setIsLoadingInternships(true)
    try {
      const data = await internshipService.getAllInternships()
      setInternships(data)
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error)
    } finally {
      setIsLoadingInternships(false)
    }
  }

  const loadConventions = async () => {
    setIsLoadingConventions(true)
    try {
      const data = await conventionService.getAllConventions()
      setConventions(data)
    } catch (error) {
      console.error('Erreur lors du chargement des conventions:', error)
    } finally {
      setIsLoadingConventions(false)
    }
  }

  const handleApproveConvention = async (conventionId: number) => {
    if (!user) return
    try {
      await conventionService.approveConventionByAdmin(conventionId, user.id)
      toast.success('Convention approuvée avec succès!')
      loadConventions()
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'approbation')
    }
  }

  // Fonctions pour les rapports
  const handleExportStagesByFiliere = async () => {
    try {
      const blob = await reportsService.exportStagesByFiliere()
      reportsService.downloadFile(blob, `stages-par-filiere-${new Date().toISOString().split('T')[0]}.xlsx`)
      toast.success('Export réussi!')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'export')
    }
  }

  const handleExportActiveUsers = async () => {
    try {
      const blob = await reportsService.exportActiveUsers()
      reportsService.downloadFile(blob, `utilisateurs-actifs-${new Date().toISOString().split('T')[0]}.xlsx`)
      toast.success('Export réussi!')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'export')
    }
  }

  const handleExportCompanyPartners = async () => {
    try {
      const blob = await reportsService.exportCompanyPartners()
      reportsService.downloadFile(blob, `partenaires-entreprises-${new Date().toISOString().split('T')[0]}.xlsx`)
      toast.success('Export réussi!')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'export')
    }
  }



  const handleExportStages2024 = async () => {
    try {
      const blob = await reportsService.exportStagesByYear(2024)
      reportsService.downloadFile(blob, 'stages-2024.xlsx')
      toast.success('Export réussi!')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'export')
    }
  }

  const handleExportSignedConventions = async () => {
    try {
      const blob = await reportsService.exportSignedConventions()
      reportsService.downloadFile(blob, `conventions-signees-${new Date().toISOString().split('T')[0]}.xlsx`)
      toast.success('Export réussi!')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'export')
    }
  }

  const handleExportAllUsers = async () => {
    try {
      const blob = await reportsService.exportAllUsers()
      reportsService.downloadFile(blob, `tous-utilisateurs-${new Date().toISOString().split('T')[0]}.xlsx`)
      toast.success('Export réussi!')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'export')
    }
  }



  const handleExportAll = async () => {
    try {
      const blob = await reportsService.exportAllData()
      reportsService.downloadFile(blob, `export-complet-${new Date().toISOString().split('T')[0]}.xlsx`)
      toast.success('Export complet réussi!')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'export complet')
    }
  }

  useEffect(() => {
    loadUsers()
    loadStats()
    loadSecteurs()
    loadInternships()
    loadConventions()
    loadChartData()
  }, [])

  const loadStats = async () => {
    try {
      const data = await statsService.getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    }
  }

  const loadChartData = async () => {
    setIsLoadingCharts(true)
    try {
      const [monthlyData, sectorData] = await Promise.all([
        statsService.getMonthlyEvolution(),
        statsService.getInternshipsBySector()
      ])
      setMonthlyStats(monthlyData)
      setInternshipsByField(sectorData)
    } catch (error) {
      console.error('Erreur lors du chargement des données graphiques:', error)
      toast.error('Erreur lors du chargement des graphiques')
    } finally {
      setIsLoadingCharts(false)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await userService.deleteUser(userId)
        toast.success('Utilisateur supprimé avec succès!')
        loadUsers()
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error)
        toast.error(error.message || 'Erreur lors de la suppression de l\'utilisateur')
      }
    }
  }

  const handleDeleteSecteur = async (secteurId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce secteur ?')) {
      try {
        await secteurService.deleteSecteur(secteurId)
        toast.success('Secteur supprimé avec succès!')
        loadSecteurs()
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error)
        toast.error(error.message || 'Erreur lors de la suppression du secteur')
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
            <TabsTrigger value="offers">Offres</TabsTrigger>
            <TabsTrigger value="conventions">Conventions</TabsTrigger>
            <TabsTrigger value="secteurs">Secteurs</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              {/* Évolution mensuelle */}
              <Card>
                <CardHeader>
                  <CardTitle>Évolution mensuelle</CardTitle>
                  <CardDescription>Nombre de stages et candidatures par mois</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingCharts ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                        <p className="text-sm text-muted-foreground">Chargement des données...</p>
                      </div>
                    </div>
                  ) : (
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
                  )}
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

          <TabsContent value="offers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Toutes les offres de stage</h2>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Liste des offres ({internships.length})</CardTitle>
                <CardDescription>Consultation de toutes les offres de stage publiées</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingInternships ? (
                  <div className="text-center py-8">Chargement...</div>
                ) : (
                  <div className="space-y-4">
                    {internships.map((offer) => (
                      <div key={offer.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{offer.intitule}</h3>
                            <p className="text-sm text-muted-foreground">{offer.nomEntreprise}</p>
                          </div>
                          <Badge variant="secondary">{offer.secteurName || 'Non défini'}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {offer.localisation}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {offer.dureeStage} mois
                          </div>
                          <span>Places: {offer.nombrePlaces}</span>
                        </div>
                        <p className="text-sm mb-2">{offer.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {offer.competences.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                          <span>Publié le {new Date(offer.datePublication).toLocaleDateString("fr-FR")}</span>
                          <span>Limite: {new Date(offer.dateLimiteCandidature).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                    ))}
                    {internships.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Aucune offre de stage trouvée.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conventions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Toutes les conventions</h2>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Liste des conventions ({conventions.length})</CardTitle>
                <CardDescription>Consultation de toutes les conventions de stage</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingConventions ? (
                  <div className="text-center py-8">Chargement...</div>
                ) : (
                  <div className="space-y-4">
                    {conventions.map((convention) => (
                      <div key={convention.idConvention} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{convention.candidature.etudiantUsername}</h3>
                            <p className="text-sm text-muted-foreground">{convention.candidature.offreStage.intitule}</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            <FileText className="h-3 w-3 mr-1" />
                            Convention
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Secteur: {convention.candidature.offreStage.secteur}</p>
                        <p className="text-sm text-muted-foreground mb-3">
                          Créée le {new Date(convention.dateCreation).toLocaleDateString("fr-FR")}
                        </p>
                        <div className="flex gap-2">
                          <Badge key={`enseignant-${convention.idConvention}`} className={convention.enseignantName ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            Enseignant: {convention.enseignantName ? 'Validé' : 'En attente'}
                          </Badge>
                          <Badge key={`admin-${convention.idConvention}`} className={convention.administratorName ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            Admin: {convention.administratorName ? 'Approuvé' : 'En attente'}
                          </Badge>
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedConvention(convention)
                              setIsViewConventionModalOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Détails
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => conventionService.downloadConvention(convention.idConvention)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                          </Button>
                          {convention.enseignantName && !convention.administratorName && (
                            <Button 
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveConvention(convention.idConvention)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approuver
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {conventions.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        Aucune convention trouvée.
                      </div>
                    )}
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
              <Button onClick={handleExportAll}>
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
                  <Button className="w-full justify-start bg-transparent" variant="outline" onClick={handleExportStagesByFiliere}>
                    <FileText className="h-4 w-4 mr-2" />
                    Rapport des stages par filière
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline" onClick={handleExportActiveUsers}>
                    <Users className="h-4 w-4 mr-2" />
                    Liste des utilisateurs actifs
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline" onClick={handleExportCompanyPartners}>
                    <Building2 className="h-4 w-4 mr-2" />
                    Partenaires entreprises
                  </Button>

                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Exports de données</CardTitle>
                  <CardDescription>Téléchargez les données au format Excel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline" onClick={handleExportStages2024}>
                    <Download className="h-4 w-4 mr-2" />
                    Export stages 2024
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline" onClick={handleExportSignedConventions}>
                    <Download className="h-4 w-4 mr-2" />
                    Export conventions signées
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline" onClick={handleExportAllUsers}>
                    <Download className="h-4 w-4 mr-2" />
                    Export utilisateurs
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline" onClick={handleExportCompanyPartners}>
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
        
        <ViewConventionModal 
          isOpen={isViewConventionModalOpen}
          onClose={() => setIsViewConventionModalOpen(false)}
          convention={selectedConvention}
          onApprove={handleApproveConvention}
        />
      </div>
    </DashboardLayout>
  )
}
