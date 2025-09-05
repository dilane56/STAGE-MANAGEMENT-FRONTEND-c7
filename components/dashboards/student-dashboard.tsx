"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Clock, Building2, Send, Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { internshipService, type InternshipOffer } from "@/lib/internship-service"
import { candidatureService, type Candidature } from "@/lib/candidature-service"
import { ApplyModal } from "@/components/student/apply-modal"
import { ViewInternshipModal } from "@/components/student/view-internship-modal"
import { EditApplicationModal } from "@/components/student/edit-application-modal"
import { ViewApplicationModal } from "@/components/student/view-application-modal"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"



export function StudentDashboard() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [availableInternships, setAvailableInternships] = useState<InternshipOffer[]>([])
  const [myApplications, setMyApplications] = useState<Candidature[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditApplicationModalOpen, setIsEditApplicationModalOpen] = useState(false)
  const [isViewApplicationModalOpen, setIsViewApplicationModalOpen] = useState(false)
  const [selectedInternship, setSelectedInternship] = useState<InternshipOffer | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<Candidature | null>(null)

  const loadInternships = async () => {
    setIsLoading(true)
    try {
      const data = await internshipService.getAllInternships()
      setAvailableInternships(data)
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMyApplications = async () => {
    if (!user) return
    try {
      const data = await candidatureService.getMyApplications(user.id)
      setMyApplications(data)
    } catch (error) {
      console.error('Erreur lors du chargement des candidatures:', error)
    }
  }

  const handleApply = (internship: InternshipOffer) => {
    setSelectedInternship(internship)
    setIsApplyModalOpen(true)
  }

  const handleApplicationSent = () => {
    loadMyApplications()
    toast.success('Candidature envoyée avec succès!')
  }

  const handleDeleteApplication = async (candidatureId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      try {
        await candidatureService.withdrawApplication(candidatureId)
        loadMyApplications()
        toast.success('Candidature supprimée avec succès!')
      } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la suppression')
      }
    }
  }

  const handleEditApplication = (candidature: Candidature) => {
    setSelectedApplication(candidature)
    setIsEditApplicationModalOpen(true)
  }

  const handleApplicationUpdated = () => {
    loadMyApplications()
    toast.success('Candidature modifiée avec succès!')
  }

  useEffect(() => {
    loadInternships()
    if (user) {
      loadMyApplications()
    }
  }, [user])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACCEPTE":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "REFUSE":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "EN_ATTENTE":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACCEPTE":
        return "Accepté"
      case "REFUSE":
        return "Refusé"
      case "EN_ATTENTE":
        return "En attente"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTE":
        return "bg-green-100 text-green-800"
      case "REFUSE":
        return "bg-red-100 text-red-800"
      case "EN_ATTENTE":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout title="Espace Étudiant" subtitle="Trouvez et postulez à des stages">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{availableInternships.length}</p>
                  <p className="text-sm text-muted-foreground">Offres disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{myApplications.length}</p>
                  <p className="text-sm text-muted-foreground">Candidatures</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {myApplications.filter((app) => app.statutCandidature === "ACCEPTE").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Acceptées</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {myApplications.filter((app) => app.statutCandidature === "EN_ATTENTE").length}
                  </p>
                  <p className="text-sm text-muted-foreground">En attente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList>
            <TabsTrigger value="search">Rechercher des stages</TabsTrigger>
            <TabsTrigger value="applications">Mes candidatures</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Recherche avancée</CardTitle>
                <CardDescription>Trouvez le stage parfait selon vos critères</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Rechercher par titre, entreprise, compétences..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button>
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Available Internships */}
            <div className="grid gap-4">
              {availableInternships.map((internship) => (
                <Card key={internship.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{internship.intitule} {internship.secteurName && `(${internship.secteurName})`}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {internship.nomEntreprise}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {internship.localisation}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {internship.dureeStage} mois
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3">{internship.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {internship.competences.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedInternship(internship)
                            setIsViewModalOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleApply(internship)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Postuler
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="grid gap-4">
              {myApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{application.offreStage.intitule}</h3>
                          <Badge className={getStatusColor(application.statutCandidature)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(application.statutCandidature)}
                              {getStatusLabel(application.statutCandidature)}
                            </div>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {application.offreStage.nomEntreprise}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {application.offreStage.localisation}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {application.offreStage.dureeStage} mois
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3">Secteur: {application.offreStage.secteur}</p>
                        <p className="text-sm text-muted-foreground">
                          Candidature envoyée le {new Date(application.dateCandidature).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(application)
                            setIsViewApplicationModalOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Détails
                        </Button>
                        {application.statutCandidature === "EN_ATTENTE" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditApplication(application)}
                            >
                              Modifier
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteApplication(application.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Supprimer
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <ApplyModal 
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
          onApplicationSent={handleApplicationSent}
          internship={selectedInternship}
        />
        
        <ViewInternshipModal 
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          internship={selectedInternship}
        />
        
        <EditApplicationModal 
          isOpen={isEditApplicationModalOpen}
          onClose={() => setIsEditApplicationModalOpen(false)}
          onApplicationUpdated={handleApplicationUpdated}
          candidature={selectedApplication}
        />
        
        <ViewApplicationModal 
          isOpen={isViewApplicationModalOpen}
          onClose={() => setIsViewApplicationModalOpen(false)}
          candidature={selectedApplication}
        />
      </div>
    </DashboardLayout>
  )
}
