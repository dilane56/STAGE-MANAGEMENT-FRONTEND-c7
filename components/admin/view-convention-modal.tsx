"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, User, Calendar, Download, CheckCircle } from "lucide-react"
import { type Convention } from "@/lib/convention-service"

interface ViewConventionModalProps {
  isOpen: boolean
  onClose: () => void
  convention: Convention | null
  onApprove?: (conventionId: number) => void
}

export function ViewConventionModal({ 
  isOpen, 
  onClose, 
  convention,
  onApprove 
}: ViewConventionModalProps) {
  if (!convention) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Détails de la convention
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations étudiant */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Étudiant
            </h3>
            <div className="space-y-2">
              <p><span className="font-medium">Nom:</span> {convention.candidature.etudiantUsername}</p>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Date de création:</span>
                {new Date(convention.dateCreation).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>

          <Separator />

          {/* Informations offre */}
          <div>
            <h3 className="font-semibold mb-3">Offre de stage</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Poste:</span> {convention.candidature.offreStage.intitule}</p>
              <p><span className="font-medium">Secteur:</span> {convention.candidature.offreStage.secteur}</p>
            </div>
          </div>

          <Separator />

          {/* Statuts de validation */}
          <div>
            <h3 className="font-semibold mb-3">Statuts de validation</h3>
            <div className="flex gap-2">
              <Badge className={convention.enseignantName ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                Enseignant: {convention.enseignantName ? `Validé par ${convention.enseignantName}` : 'En attente'}
              </Badge>
              <Badge className={convention.administratorName ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                Admin: {convention.administratorName ? `Approuvé par ${convention.administratorName}` : 'En attente'}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Button 
              variant="outline"
              onClick={() => {
                // Télécharger le PDF
                window.open(`/api/conventions/${convention.idConvention}/download`, '_blank')
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </Button>

            {convention.enseignantName && !convention.administratorName && onApprove && (
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  onApprove(convention.idConvention)
                  onClose()
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approuver
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}