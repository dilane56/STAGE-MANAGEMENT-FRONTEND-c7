"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, MapPin, Clock, Users, Calendar, Building2, FileText, User } from "lucide-react"
import { type Candidature } from "@/lib/candidature-service"

interface ViewApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  candidature: Candidature | null
}

export function ViewApplicationModal({ isOpen, onClose, candidature }: ViewApplicationModalProps) {
  if (!isOpen || !candidature) return null

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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Détails de la candidature</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{candidature.offreStage.intitule}</h2>
            <Badge className={getStatusColor(candidature.statutCandidature)}>
              {getStatusLabel(candidature.statutCandidature)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{candidature.offreStage.nomEntreprise}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{candidature.offreStage.localisation}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{candidature.offreStage.dureeStage} mois</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>Secteur: {candidature.offreStage.secteur}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Candidature envoyée le {new Date(candidature.dateCandidature).toLocaleDateString("fr-FR")}</span>
            </div>

            {candidature.dateReponse && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Réponse reçue le {new Date(candidature.dateReponse).toLocaleDateString("fr-FR")}</span>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Lettre de motivation
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="whitespace-pre-wrap">{candidature.lettreMotivation}</p>
            </div>
          </div>

          {candidature.messageReponse && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                Message de l'entreprise
              </h3>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="whitespace-pre-wrap">{candidature.messageReponse}</p>
              </div>
            </div>
          )}

          {candidature.cheminFichier && (
            <div>
              <h3 className="font-semibold mb-2">CV</h3>
              <Button 
                variant="outline" 
                onClick={() => window.open(candidature.cheminFichier, '_blank')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Télécharger le CV
              </Button>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={onClose}>Fermer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}