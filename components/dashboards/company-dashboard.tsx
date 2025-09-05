"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Users, Eye, CheckCircle, XCircle, AlertCircle, Building2, MapPin, Clock, Settings, FileText, Download, Edit, Trash2 } from "lucide-react"
import { internshipService, type InternshipOffer } from "@/lib/internship-service"
import { candidatureService, type Candidature } from "@/lib/candidature-service"
import { conventionService, type Convention } from "@/lib/convention-service"
import { CreateInternshipModal } from "@/components/company/create-internship-modal"
import { ViewInternshipModal } from "@/components/company/view-internship-modal"
import { ViewApplicationModal } from "@/components/company/view-application-modal"
import { CreateConventionModal } from "@/components/company/create-convention-modal"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

interface JobOffer {
  id: string
  title: string
  location: string
  duration: string
  description: string
  skills: string[]
  status: "active" | "closed" | "draft"
  applicationsCount: number
  createdDate: string
}



export function CompanyDashboard() {
  const { user } = useAuth()
  const [jobOffers, setJobOffers] = useState<InternshipOffer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<InternshipOffer | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<Candidature | null>(null)
  const [isViewApplicationModalOpen, setIsViewApplicationModalOpen] = useState(false)
  const [conventions, setConventions] = useState<Convention[]>([])
  const [isLoadingConventions, setIsLoadingConventions] = useState(false)
  const [isCreateConventionModalOpen, setIsCreateConventionModalOpen] = useState(false)

  const loadInternships = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const data = await internshipService.getInternshipsByCompany(user.id)
      setJobOffers(data)
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadApplications = async () => {
    if (!user) return
    setIsLoadingApplications(true)
    try {
      const data = await candidatureService.getCompanyApplications(user.id)
      setApplications(data)
    } catch (error) {
      console.error('Erreur lors du chargement des candidatures:', error)
    } finally {
      setIsLoadingApplications(false)
    }
  }

  const loadConventions = async () => {
    if (!user) return
    setIsLoadingConventions(true)
    try {
      const data = await conventionService.getConventionsByCompany(user.id)
      setConventions(data)
    } catch (error) {
      console.error('Erreur lors du chargement des conventions:', error)
    } finally {
      setIsLoadingConventions(false)
    }
  }

  const handleStatusUpdate = async (candidatureId: number, statut: string, message?: string) => {
    try {
      await candidatureService.updateApplicationStatus(candidatureId, statut, message)
      loadApplications()
      toast.success('Statut mis à jour avec succès!')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour')
    }
  }

  useEffect(() => {
    if (user) {
      loadInternships()
      loadApplications()
      loadConventions()
    }
  }, [user])

  const [applications, setApplications] = useState<Candidature[]>([])
  const [isLoadingApplications, setIsLoadingApplications] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "closed":
        return "Fermée"
      case "draft":
        return "Brouillon"
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

  return (
    <DashboardLayout title="Espace Entreprise" subtitle="Gérez vos offres de stage et candidatures">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{jobOffers.length}</p>
                  <p className="text-sm text-muted-foreground">Offres publiées</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{applications.length}</p>
                  <p className="text-sm text-muted-foreground">Candidatures reçues</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{applications.filter((app) => app.statutCandidature === "ACCEPTE").length}</p>
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
                  <p className="text-2xl font-bold">{applications.filter((app) => app.statutCandidature === "EN_ATTENTE").length}</p>
                  <p className="text-sm text-muted-foreground">En attente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="offers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="offers">Mes offres</TabsTrigger>
            <TabsTrigger value="applications">Candidatures</TabsTrigger>
            <TabsTrigger value="conventions">Conventions</TabsTrigger>
          </TabsList>

          <TabsContent value="offers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Offres de stage</h2>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle offre
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : (
              <div className="grid gap-4">
                {jobOffers.map((offer) => (
                  <Card key={offer.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{offer.intitule} {offer.secteurName && `(${offer.secteurName})`}</h3>
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
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {offer.candidatures?.length || 0} candidatures
                            </div>
                            <div className="flex items-center gap-1">
                              <AlertCircle className="h-4 w-4" />
                              Limite: {new Date(offer.dateLimiteCandidature).toLocaleDateString("fr-FR")}
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3">{offer.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {offer.competences.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Début: {new Date(offer.dateDebutStage).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedOffer(offer)
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
                              setSelectedOffer(offer)
                              setIsEditModalOpen(true)
                            }}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <h2 className="text-2xl font-bold">Candidatures reçues</h2>

            {isLoadingApplications ? (
              <div className="text-center py-8">Chargement...</div>
            ) : (
              <div className="grid gap-4">
                {applications.map((application) => (
                  <Card key={application.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{application.etudiantUsername}</h3>
                            <Badge className={getStatusColor(application.statutCandidature)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(application.statutCandidature)}
                                {getStatusLabel(application.statutCandidature)}
                              </div>
                            </Badge>
                          </div>
                          <p className="text-sm font-medium mb-2">Poste: {application.offreStage.intitule}</p>
                          <p className="text-sm text-muted-foreground mb-1">Secteur: {application.offreStage.secteur}</p>
                          <p className="text-sm text-muted-foreground">
                            Candidature reçue le {new Date(application.dateCandidature).toLocaleDateString("fr-FR")}
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
                                className="text-red-600 hover:text-red-700 bg-transparent"
                                onClick={() => {
                                  const message = prompt('Message de refus (optionnel):')
                                  handleStatusUpdate(application.id, 'REFUSE', message || undefined)
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Refuser
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  const message = prompt('Message d\'acceptation (optionnel):')
                                  handleStatusUpdate(application.id, 'ACCEPTE', message || undefined)
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Accepter
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {applications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune candidature reçue.
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="conventions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Conventions de stage</h2>
              <Button onClick={() => setIsCreateConventionModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle convention
              </Button>
            </div>

            {isLoadingConventions ? (
              <div className="text-center py-8">Chargement...</div>
            ) : (
              <div className="grid gap-4">
                {conventions.map((convention) => (
                  <Card key={convention.idConvention} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{convention.candidature.etudiantUsername}</h3>
                            <Badge className="bg-blue-100 text-blue-800">
                              <FileText className="h-3 w-3 mr-1" />
                              Convention
                            </Badge>
                          </div>
                          <p className="text-sm font-medium mb-2">Poste: {convention.candidature.offreStage.intitule}</p>
                          <p className="text-sm text-muted-foreground mb-1">Secteur: {convention.candidature.offreStage.secteur}</p>
                          <p className="text-sm text-muted-foreground mb-2">
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
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => conventionService.downloadConvention(convention.idConvention)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const input = document.createElement('input')
                              input.type = 'file'
                              input.accept = '.pdf'
                              input.onchange = async (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0]
                                if (file) {
                                  try {
                                    console.log('Convention ID:', convention.idConvention, 'Candidature ID:', convention.candidature.id)
                                    await conventionService.updateConvention(convention.idConvention, convention.candidature.id, file)
                                    toast.success('Convention mise à jour!')
                                    loadConventions()
                                  } catch (error: any) {
                                    console.error('Erreur mise à jour convention:', error)
                                    toast.error(error.message || 'Erreur lors de la mise à jour')
                                  }
                                }
                              }
                              input.click()
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                          {(!convention.enseignantName && !convention.administratorName) && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={async () => {
                                if (confirm('Êtes-vous sûr de vouloir supprimer cette convention ?')) {
                                  try {
                                    await conventionService.deleteConvention(convention.idConvention)
                                    toast.success('Convention supprimée!')
                                    loadConventions()
                                  } catch (error: any) {
                                    toast.error(error.message || 'Erreur lors de la suppression')
                                  }
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {conventions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune convention créée.
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <CreateInternshipModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onInternshipCreated={loadInternships}
        />
        
        <CreateInternshipModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onInternshipCreated={loadInternships}
          internship={selectedOffer}
        />
        
        <ViewInternshipModal 
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          internship={selectedOffer}
        />
        
        <ViewApplicationModal 
          isOpen={isViewApplicationModalOpen}
          onClose={() => setIsViewApplicationModalOpen(false)}
          application={selectedApplication}
          onStatusUpdate={handleStatusUpdate}
        />
        
        <CreateConventionModal 
          isOpen={isCreateConventionModalOpen}
          onClose={() => setIsCreateConventionModalOpen(false)}
          onConventionCreated={loadConventions}
          acceptedApplications={applications.filter(app => app.statutCandidature === 'ACCEPTE')}
        />
      </div>
    </DashboardLayout>
  )
}
