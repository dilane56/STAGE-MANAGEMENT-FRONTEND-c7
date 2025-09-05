"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, MapPin, Clock, Users, Calendar, AlertCircle } from "lucide-react"
import { type InternshipOffer } from "@/lib/internship-service"

interface ViewInternshipModalProps {
  isOpen: boolean
  onClose: () => void
  internship: InternshipOffer | null
}

export function ViewInternshipModal({ isOpen, onClose, internship }: ViewInternshipModalProps) {
  if (!isOpen || !internship) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Détails de l'offre</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {internship.intitule} {internship.secteurName && `(${internship.secteurName})`}
            </h2>
            <p className="text-muted-foreground">{internship.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{internship.localisation}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{internship.dureeStage} mois</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{internship.candidatures?.length || 0} candidatures</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{internship.nombrePlaces} places disponibles</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Début: {new Date(internship.dateDebutStage).toLocaleDateString("fr-FR")}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <span>Date limite de candidature: {new Date(internship.dateLimiteCandidature).toLocaleDateString("fr-FR")}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Publié le: {new Date(internship.datePublication).toLocaleDateString("fr-FR")}</span>
          </div>

          {internship.competences.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Compétences requises</h3>
              <div className="flex flex-wrap gap-2">
                {internship.competences.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
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