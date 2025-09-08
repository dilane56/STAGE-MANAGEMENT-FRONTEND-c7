"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, CheckCircle, XCircle, AlertCircle, Users, GraduationCap, Eye, BarChart3, Download } from "lucide-react"
import { conventionService, type Convention } from "@/lib/convention-service"
import { userService, type BackendUser } from "@/lib/user-service"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { reportsService, type StagesByFiliere } from "@/lib/reports-service"
import { ViewConventionPdfModal } from "@/components/teacher/view-convention-pdf-modal"

export function TeacherDashboard() {
  const { user } = useAuth()
  const [conventions, setConventions] = useState<Convention[]>([])
  const [students, setStudents] = useState<BackendUser[]>([])
  const [isLoadingConventions, setIsLoadingConventions] = useState(false)
  const [isLoadingStudents, setIsLoadingStudents] = useState(false)
  const [stagesByFiliere, setStagesByFiliere] = useState<StagesByFiliere[]>([])
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [selectedConvention, setSelectedConvention] = useState<Convention | null>(null)
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)

  const loadConventions = async () => {
    if (!user) return
    setIsLoadingConventions(true)
    try {
      const data = await conventionService.getConventionsByTeacher(user.id)
      setConventions(data)
    } catch (error) {
      console.error('Erreur lors du chargement des conventions:', error)
    } finally {
      setIsLoadingConventions(false)
    }
  }

  const loadStudents = async () => {
    if (!user) return
    setIsLoadingStudents(true)
    try {
      const data = await userService.getStudentsByTeacher(user.id)
      setStudents(data)
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants:', error)
    } finally {
      setIsLoadingStudents(false)
    }
  }

  const loadStagesByFiliere = async () => {
    setIsLoadingStats(true)
    try {
      const data = await reportsService.getStagesByFiliere()
      setStagesByFiliere(data)
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const handleValidateConvention = async (conventionId: number) => {
    if (!user) return
    try {
      await conventionService.validateConventionByTeacher(conventionId, user.id)
      toast.success('Convention validée avec succès!')
      loadConventions()
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la validation')
    }
  }

  useEffect(() => {
    if (user) {
      loadConventions()
      loadStudents()
      loadStagesByFiliere()
    }
  }, [user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VALIDE":
      case "APPROUVE":
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
      case "VALIDE":
        return "Validé"
      case "REFUSE":
        return "Refusé"
      case "EN_ATTENTE":
        return "En attente"
      case "APPROUVE":
        return "Approuvé"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VALIDE":
      case "APPROUVE":
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
    <DashboardLayout title="Espace Enseignant" subtitle="Validez les conventions et suivez vos étudiants">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{conventions.length}</p>
                  <p className="text-sm text-muted-foreground">Conventions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{conventions.filter((conv) => !conv.enseignantName).length}</p>
                  <p className="text-sm text-muted-foreground">En attente</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{students.length}</p>
                  <p className="text-sm text-muted-foreground">Étudiants suivis</p>
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
                    {conventions.filter((conv) => conv.enseignantName).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Conventions validées</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="conventions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="conventions">Conventions à valider</TabsTrigger>
            <TabsTrigger value="students">Suivi des étudiants</TabsTrigger>
            <TabsTrigger value="statistics">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="conventions" className="space-y-6">
            <h2 className="text-2xl font-bold">Conventions de stage</h2>

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
                            <Badge className={getStatusColor(convention.enseignantName ? 'VALIDE' : 'EN_ATTENTE')}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(convention.enseignantName ? 'VALIDE' : 'EN_ATTENTE')}
                                {getStatusLabel(convention.enseignantName ? 'VALIDE' : 'EN_ATTENTE')}
                              </div>
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground mb-3">
                            <p>
                              <span className="font-medium">Poste:</span> {convention.candidature.offreStage.intitule}
                            </p>
                            <p>
                              <span className="font-medium">Secteur:</span> {convention.candidature.offreStage.secteur}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Créée le {new Date(convention.dateCreation).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedConvention(convention)
                              setIsPdfModalOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir PDF
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => conventionService.downloadConvention(convention.idConvention)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                          </Button>
                          {!convention.enseignantName && (
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleValidateConvention(convention.idConvention)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Valider
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {conventions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune convention à valider.
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <h2 className="text-2xl font-bold">Suivi des étudiants</h2>

            {isLoadingStudents ? (
              <div className="text-center py-8">Chargement...</div>
            ) : (
              <div className="grid gap-4">
                {students.map((student) => (
                  <Card key={student.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{student.fullName}</h3>
                            <Badge className="bg-blue-100 text-blue-800">
                              Étudiant
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground mb-3">
                            <p>
                              <span className="font-medium">Email:</span> {student.email}
                            </p>
                            <p>
                              <span className="font-medium">Filière:</span> {student.profile.filiere || 'Non défini'}
                            </p>
                            <p>
                              <span className="font-medium">Niveau:</span> {student.profile.niveau || 'Non défini'}
                            </p>
                            <p>
                              <span className="font-medium">Université:</span> {student.profile.universite || 'Non défini'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            Profil
                          </Button>
                          <Button size="sm">Contacter</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {students.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun étudiant assigné.
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <h2 className="text-2xl font-bold">Statistiques des stages</h2>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Répartition des stages par filière</h3>
                {isLoadingStats ? (
                  <div className="text-center py-8">Chargement...</div>
                ) : (
                  <ChartContainer
                    config={{
                      totalStages: {
                        label: "Stages",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stagesByFiliere.map((item, index) => ({
                            name: item.filiere,
                            value: item.totalStages,
                            color: `hsl(${(index * 60) % 360}, 70%, 50%)`
                          }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {stagesByFiliere.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${(index * 60) % 360}, 70%, 50%)`} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            {stagesByFiliere.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stagesByFiliere.map((filiere, index) => (
                  <Card key={filiere.filiere}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)` }}
                        />
                        <h4 className="font-medium">{filiere.filiere}</h4>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p>Total: <span className="font-semibold">{filiere.totalStages}</span></p>
                        <p>En cours: <span className="text-blue-600">{filiere.stagesEnCours}</span></p>
                        <p>Terminés: <span className="text-green-600">{filiere.stagesTermines}</span></p>
                        <p>En attente: <span className="text-yellow-600">{filiere.stagesEnAttente}</span></p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <ViewConventionPdfModal 
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          convention={selectedConvention}
        />
      </div>
    </DashboardLayout>
  )
}