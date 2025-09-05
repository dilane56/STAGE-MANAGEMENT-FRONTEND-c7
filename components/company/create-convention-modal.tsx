"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"
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
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedCandidatureId || !file) {
      toast.error("Veuillez sélectionner une candidature et un fichier PDF")
      return
    }

    setIsLoading(true)
    try {
      await conventionService.createConvention(parseInt(selectedCandidatureId), file)
      toast.success("Convention créée avec succès!")
      onConventionCreated()
      onClose()
      setSelectedCandidatureId("")
      setFile(null)
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création de la convention")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
    } else {
      toast.error("Veuillez sélectionner un fichier PDF")
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

          <div>
            <Label htmlFor="pdf">Fichier PDF de la convention</Label>
            <div className="mt-1">
              <Input
                id="pdf"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
            {file && (
              <p className="text-sm text-green-600 mt-1">
                Fichier sélectionné: {file.name}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Upload className="h-4 w-4 mr-2" />
              {isLoading ? "Création..." : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}