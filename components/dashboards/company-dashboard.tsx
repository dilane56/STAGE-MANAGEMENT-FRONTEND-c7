"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Users, Eye, CheckCircle, XCircle, AlertCircle, Building2, MapPin, Clock } from "lucide-react"

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

interface Application {
  id: string
  studentName: string
  studentEmail: string
  jobTitle: string
  status: "pending" | "accepted" | "rejected"
  appliedDate: string
  cv?: string
  coverLetter?: string
}

export function CompanyDashboard() {
  const [jobOffers] = useState<JobOffer[]>([
    {
      id: "1",
      title: "Développeur Full-Stack",
      location: "Paris",
      duration: "6 mois",
      description: "Développement d'applications web avec React et Node.js",
      skills: ["React", "Node.js", "TypeScript", "MongoDB"],
      status: "active",
      applicationsCount: 12,
      createdDate: "2024-01-10",
    },
    {
      id: "2",
      title: "Designer UX/UI",
      location: "Paris",
      duration: "4 mois",
      description: "Conception d'interfaces utilisateur modernes",
      skills: ["Figma", "Adobe XD", "Prototyping"],
      status: "active",
      applicationsCount: 8,
      createdDate: "2024-01-15",
    },
    {
      id: "3",
      title: "Data Analyst",
      location: "Lyon",
      duration: "5 mois",
      description: "Analyse de données et reporting",
      skills: ["Python", "SQL", "Tableau", "Excel"],
      status: "closed",
      applicationsCount: 15,
      createdDate: "2024-01-05",
    },
  ])

  const [applications] = useState<Application[]>([
    {
      id: "1",
      studentName: "Marie Dubois",
      studentEmail: "marie.dubois@student.fr",
      jobTitle: "Développeur Full-Stack",
      status: "pending",
      appliedDate: "2024-01-20",
    },
    {
      id: "2",
      studentName: "Pierre Martin",
      studentEmail: "pierre.martin@student.fr",
      jobTitle: "Développeur Full-Stack",
      status: "accepted",
      appliedDate: "2024-01-18",
    },
    {
      id: "3",
      studentName: "Sophie Laurent",
      studentEmail: "sophie.laurent@student.fr",
      jobTitle: "Designer UX/UI",
      status: "pending",
      appliedDate: "2024-01-22",
    },
    {
      id: "4",
      studentName: "Thomas Durand",
      studentEmail: "thomas.durand@student.fr",
      jobTitle: "Data Analyst",
      status: "rejected",
      appliedDate: "2024-01-12",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
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
      case "accepted":
        return "Accepté"
      case "rejected":
        return "Refusé"
      case "pending":
        return "En attente"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
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
                  <p className="text-2xl font-bold">{applications.filter((app) => app.status === "accepted").length}</p>
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
                  <p className="text-2xl font-bold">{applications.filter((app) => app.status === "pending").length}</p>
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
          </TabsList>

          <TabsContent value="offers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Offres de stage</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle offre
              </Button>
            </div>

            <div className="grid gap-4">
              {jobOffers.map((offer) => (
                <Card key={offer.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{offer.title}</h3>
                          <Badge className={getStatusColor(offer.status)}>{getStatusLabel(offer.status)}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {offer.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {offer.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {offer.applicationsCount} candidatures
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3">{offer.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {offer.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Publiée le {new Date(offer.createdDate).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                        <Button size="sm">Modifier</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <h2 className="text-2xl font-bold">Candidatures reçues</h2>

            <div className="grid gap-4">
              {applications.map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{application.studentName}</h3>
                          <Badge className={getStatusColor(application.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(application.status)}
                              {getStatusLabel(application.status)}
                            </div>
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-1">{application.studentEmail}</p>
                        <p className="text-sm font-medium mb-2">Poste: {application.jobTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          Candidature reçue le {new Date(application.appliedDate).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          CV
                        </Button>
                        {application.status === "pending" && (
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
                              Accepter
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
      </div>
    </DashboardLayout>
  )
}
