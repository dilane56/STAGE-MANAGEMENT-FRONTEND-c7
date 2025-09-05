"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Calendar, FileText, Eye, CheckCircle, XCircle } from "lucide-react"
import { type Candidature } from "@/lib/candidature-service"

interface ViewApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  application: Candidature | null
  onStatusUpdate?: (candidatureId: number, statut: string, message?: string) => void
}

export function ViewApplicationModal({ 
  isOpen, 
  onClose, 
  application,
  onStatusUpdate 
}: ViewApplicationModalProps) {
  if (!application) return null

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

  const handleStatusUpdate = (statut: string) => {
    if (!onStatusUpdate) return
    const message = prompt(`Message ${statut === 'ACCEPTE' ? 'd\'acceptation' : 'de refus'} (optionnel):`)
    onStatusUpdate(application.id, statut, message || undefined)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Détails de la candidature
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations candidat */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Candidat
            </h3>
            <div className="space-y-2">
              <p><span className="font-medium">Nom:</span> {application.etudiantUsername}</p>
              <div className="flex items-center gap-2">
                <span className="font-medium">Statut:</span>
                <Badge className={getStatusColor(application.statutCandidature)}>
                  {getStatusLabel(application.statutCandidature)}
                </Badge>
              </div>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Date de candidature:</span>
                {new Date(application.dateCandidature).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>

          <Separator />

          {/* Informations offre */}
          <div>
            <h3 className="font-semibold mb-3">Offre de stage</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Poste:</span> {application.offreStage.intitule}</p>
              <p><span className="font-medium">Secteur:</span> {application.offreStage.secteur}</p>
              <p><span className="font-medium">Localisation:</span> {application.offreStage.localisation}</p>
              <p><span className="font-medium">Durée:</span> {application.offreStage.dureeStage} mois</p>
            </div>
          </div>

          <Separator />

          {/* Lettre de motivation */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Lettre de motivation
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {application.lettreMotivation || "Aucune lettre de motivation fournie."}
              </p>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Button 
              variant="outline"
              onClick={() => window.open(application.cheminFichier, '_blank')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Voir le CV
            </Button>

            {application.statutCandidature === "EN_ATTENTE" && onStatusUpdate && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleStatusUpdate('REFUSE')}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Refuser
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusUpdate('ACCEPTE')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accepter
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}