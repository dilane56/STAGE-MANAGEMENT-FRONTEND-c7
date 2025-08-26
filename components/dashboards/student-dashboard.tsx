"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Clock, Building2, Send, Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface Internship {
  id: string
  title: string
  company: string
  location: string
  duration: string
  description: string
  skills: string[]
  status?: "pending" | "accepted" | "rejected"
  appliedDate?: string
}

export function StudentDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const availableInternships: Internship[] = [
    {
      id: "1",
      title: "Développeur Full-Stack",
      company: "TechCorp",
      location: "Paris",
      duration: "6 mois",
      description: "Développement d'applications web avec React et Node.js",
      skills: ["React", "Node.js", "TypeScript", "MongoDB"],
    },
    {
      id: "2",
      title: "Data Scientist",
      company: "DataLab",
      location: "Lyon",
      duration: "4 mois",
      description: "Analyse de données et machine learning",
      skills: ["Python", "TensorFlow", "SQL", "Pandas"],
    },
    {
      id: "3",
      title: "Designer UX/UI",
      company: "CreativeStudio",
      location: "Bordeaux",
      duration: "5 mois",
      description: "Conception d'interfaces utilisateur modernes",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    },
  ]

  const myApplications: Internship[] = [
    {
      id: "1",
      title: "Développeur Full-Stack",
      company: "TechCorp",
      location: "Paris",
      duration: "6 mois",
      description: "Développement d'applications web avec React et Node.js",
      skills: ["React", "Node.js", "TypeScript", "MongoDB"],
      status: "pending",
      appliedDate: "2024-01-15",
    },
    {
      id: "4",
      title: "Développeur Mobile",
      company: "MobileFirst",
      location: "Lille",
      duration: "6 mois",
      description: "Développement d'applications mobiles React Native",
      skills: ["React Native", "JavaScript", "Firebase"],
      status: "accepted",
      appliedDate: "2024-01-10",
    },
    {
      id: "5",
      title: "DevOps Engineer",
      company: "CloudTech",
      location: "Toulouse",
      duration: "4 mois",
      description: "Gestion d'infrastructure cloud et CI/CD",
      skills: ["Docker", "Kubernetes", "AWS", "Jenkins"],
      status: "rejected",
      appliedDate: "2024-01-05",
    },
  ]

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

  const getStatusLabel = (status: string) => {
    switch (status) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
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
                    {myApplications.filter((app) => app.status === "accepted").length}
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
                    {myApplications.filter((app) => app.status === "pending").length}
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
                        <h3 className="text-xl font-semibold mb-2">{internship.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {internship.company}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {internship.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {internship.duration}
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3">{internship.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {internship.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                        <Button size="sm">
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
                          <h3 className="text-xl font-semibold">{application.title}</h3>
                          <Badge className={getStatusColor(application.status || "")}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(application.status || "")}
                              {getStatusLabel(application.status || "")}
                            </div>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {application.company}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {application.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {application.duration}
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3">{application.description}</p>
                        <p className="text-sm text-muted-foreground">
                          Candidature envoyée le {new Date(application.appliedDate || "").toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
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
