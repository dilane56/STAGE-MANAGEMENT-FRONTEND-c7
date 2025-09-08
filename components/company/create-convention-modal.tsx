"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { conventionService } from "@/lib/convention-service"
import { type Candidature } from "@/lib/candidature-service"
import { toast } from "sonner"

interface CreateConventionModalProps {
  isOpen: boolean
  onClose: () => void
  onConventionCreated: () => void
  acceptedApplications: Candidature[]
}

export function CreateConventionModal({ 
  isOpen, 
  onClose, 
  onConventionCreated,
  acceptedApplications 
}: CreateConventionModalProps) {
  const [selectedCandidatureId, setSelectedCandidatureId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCandidatureId) {
      toast.error("Veuillez sélectionner une candidature")
      return
    }

    setIsLoading(true)
    try {
      await conventionService.createConvention(parseInt(selectedCandidatureId))
      toast.success("Convention créée avec succès! Vous pouvez maintenant télécharger le PDF.")
      onConventionCreated()
      onClose()
      setSelectedCandidatureId("")
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création de la convention")
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Créer une convention de stage</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="candidature">Candidature acceptée</Label>
            <Select value={selectedCandidatureId} onValueChange={setSelectedCandidatureId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une candidature" />
              </SelectTrigger>
              <SelectContent>
                {acceptedApplications.map((app) => (
                  <SelectItem key={app.id} value={app.id.toString()}>
                    {app.etudiantUsername} - {app.offreStage.intitule}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              La convention sera générée automatiquement après création. Vous pourrez ensuite télécharger le PDF.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              {isLoading ? "Création..." : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}