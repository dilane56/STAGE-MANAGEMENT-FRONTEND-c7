"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, CheckCircle, XCircle, AlertCircle, Users, GraduationCap, Eye } from "lucide-react"

interface Convention {
  id: string
  studentName: string
  studentEmail: string
  company: string
  internshipTitle: string
  duration: string
  startDate: string
  status: "pending" | "approved" | "rejected" | "signed"
  submittedDate: string
  field: string
}

interface Student {
  id: string
  name: string
  email: string
  field: string
  year: string
  internshipStatus: "searching" | "applied" | "accepted" | "completed"
  company?: string
  internshipTitle?: string
}

export function TeacherDashboard() {
  const [conventions] = useState<Convention[]>([
    {
      id: "1",
      studentName: "Marie Dubois",
      studentEmail: "marie.dubois@student.fr",
      company: "TechCorp",
      internshipTitle: "Développeur Full-Stack",
      duration: "6 mois",
      startDate: "2024-03-01",
      status: "pending",
      submittedDate: "2024-01-25",
      field: "Informatique",
    },
    {
      id: "2",
      studentName: "Pierre Martin",
      studentEmail: "pierre.martin@student.fr",
      company: "DataLab",
      internshipTitle: "Data Scientist",
      duration: "4 mois",
      startDate: "2024-02-15",
      status: "approved",
      submittedDate: "2024-01-20",
      field: "Informatique",
    },
    {
      id: "3",
      studentName: "Sophie Laurent",
      studentEmail: "sophie.laurent@student.fr",
      company: "CreativeStudio",
      internshipTitle: "Designer UX/UI",
      duration: "5 mois",
      startDate: "2024-04-01",
      status: "signed",
      submittedDate: "2024-01-15",
      field: "Design",
    },
    {
      id: "4",
      studentName: "Thomas Durand",
      studentEmail: "thomas.durand@student.fr",
      company: "FinanceApp",
      internshipTitle: "Développeur Backend",
      duration: "6 mois",
      startDate: "2024-03-15",
      status: "rejected",
      submittedDate: "2024-01-18",
      field: "Informatique",
    },
  ])

  const [students] = useState<Student[]>([
    {
      id: "1",
      name: "Marie Dubois",
      email: "marie.dubois@student.fr",
      field: "Informatique",
      year: "M2",
      internshipStatus: "accepted",
      company: "TechCorp",
      internshipTitle: "Développeur Full-Stack",
    },
    {
      id: "2",
      name: "Pierre Martin",
      email: "pierre.martin@student.fr",
      field: "Informatique",
      year: "M2",
      internshipStatus: "accepted",
      company: "DataLab",
      internshipTitle: "Data Scientist",
    },
    {
      id: "3",
      name: "Sophie Laurent",
      email: "sophie.laurent@student.fr",
      field: "Design",
      year: "M1",
      internshipStatus: "completed",
      company: "CreativeStudio",
      internshipTitle: "Designer UX/UI",
    },
    {
      id: "4",
      name: "Thomas Durand",
      email: "thomas.durand@student.fr",
      field: "Informatique",
      year: "M2",
      internshipStatus: "searching",
    },
    {
      id: "5",
      name: "Emma Moreau",
      email: "emma.moreau@student.fr",
      field: "Marketing",
      year: "M1",
      internshipStatus: "applied",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "signed":
      case "accepted":
      case "completed":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
      case "applied":
      case "searching":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Approuvé"
      case "rejected":
        return "Refusé"
      case "pending":
        return "En attente"
      case "signed":
        return "Signé"
      case "searching":
        return "En recherche"
      case "applied":
        return "Candidature envoyée"
      case "accepted":
        return "Stage accepté"
      case "completed":
        return "Stage terminé"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "signed":
      case "accepted":
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
      case "applied":
      case "searching":
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
                  <p className="text-2xl font-bold">{conventions.filter((conv) => conv.status === "pending").length}</p>
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
                    {students.filter((student) => student.internshipStatus === "completed").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Stages terminés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="conventions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="conventions">Conventions à valider</TabsTrigger>
            <TabsTrigger value="students">Suivi des étudiants</TabsTrigger>
          </TabsList>

          <TabsContent value="conventions" className="space-y-6">
            <h2 className="text-2xl font-bold">Conventions de stage</h2>

            <div className="grid gap-4">
              {conventions.map((convention) => (
                <Card key={convention.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{convention.studentName}</h3>
                          <Badge className={getStatusColor(convention.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(convention.status)}
                              {getStatusLabel(convention.status)}
                            </div>
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground mb-3">
                          <p>
                            <span className="font-medium">Email:</span> {convention.studentEmail}
                          </p>
                          <p>
                            <span className="font-medium">Entreprise:</span> {convention.company}
                          </p>
                          <p>
                            <span className="font-medium">Poste:</span> {convention.internshipTitle}
                          </p>
                          <p>
                            <span className="font-medium">Durée:</span> {convention.duration}
                          </p>
                          <p>
                            <span className="font-medium">Début:</span>{" "}
                            {new Date(convention.startDate).toLocaleDateString("fr-FR")}
                          </p>
                          <p>
                            <span className="font-medium">Filière:</span> {convention.field}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Soumise le {new Date(convention.submittedDate).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir PDF
                        </Button>
                        {convention.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Refuser
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approuver
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

          <TabsContent value="students" className="space-y-6">
            <h2 className="text-2xl font-bold">Suivi des étudiants</h2>

            <div className="grid gap-4">
              {students.map((student) => (
                <Card key={student.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{student.name}</h3>
                          <Badge className={getStatusColor(student.internshipStatus)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(student.internshipStatus)}
                              {getStatusLabel(student.internshipStatus)}
                            </div>
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground mb-3">
                          <p>
                            <span className="font-medium">Email:</span> {student.email}
                          </p>
                          <p>
                            <span className="font-medium">Filière:</span> {student.field}
                          </p>
                          <p>
                            <span className="font-medium">Année:</span> {student.year}
                          </p>
                          {student.company && (
                            <>
                              <p>
                                <span className="font-medium">Entreprise:</span> {student.company}
                              </p>
                              <p>
                                <span className="font-medium">Poste:</span> {student.internshipTitle}
                              </p>
                            </>
                          )}
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
