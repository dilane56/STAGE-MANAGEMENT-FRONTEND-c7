"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Upload } from "lucide-react"
import { type InternshipOffer } from "@/lib/internship-service"
import { candidatureService } from "@/lib/candidature-service"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

interface ApplyModalProps {
  isOpen: boolean
  onClose: () => void
  onApplicationSent: () => void
  internship: InternshipOffer | null
}

export function ApplyModal({ isOpen, onClose, onApplicationSent, internship }: ApplyModalProps) {
  const { user } = useAuth()
  const [cv, setCv] = useState<File | null>(null)
  const [lettreMotivation, setLettreMotivation] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen || !internship) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !cv) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("idEtudiant", user.id.toString())
      formData.append("idOffre", internship.id.toString())
      formData.append("cv", cv)
      formData.append("lettreMotivation", lettreMotivation)

      await candidatureService.createApplicationWithFiles(formData)
      onApplicationSent()
      onClose()
      setCv(null)
      setLettreMotivation("")
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la candidature')
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Postuler à l'offre</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="font-semibold">{internship.intitule}</h3>
            <p className="text-sm text-muted-foreground">{internship.nomEntreprise} - {internship.localisation}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cv">CV (PDF) *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="cv"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setCv(e.target.files?.[0] || null)}
                  required
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              {cv && (
                <p className="text-sm text-green-600">Fichier sélectionné: {cv.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lettreMotivation">Lettre de motivation *</Label>
              <Textarea
                id="lettreMotivation"
                value={lettreMotivation}
                onChange={(e) => setLettreMotivation(e.target.value)}
                placeholder="Rédigez votre lettre de motivation..."
                rows={10}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || !cv || !lettreMotivation.trim()} 
                className="flex-1"
              >
                {isLoading ? "Envoi..." : "Envoyer la candidature"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}