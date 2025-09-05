"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Upload } from "lucide-react"
import { type Candidature } from "@/lib/candidature-service"
import { candidatureService } from "@/lib/candidature-service"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

interface EditApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  onApplicationUpdated: () => void
  candidature: Candidature | null
}

export function EditApplicationModal({ isOpen, onClose, onApplicationUpdated, candidature }: EditApplicationModalProps) {
  const { user } = useAuth()
  const [cv, setCv] = useState<File | null>(null)
  const [lettreMotivation, setLettreMotivation] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (candidature) {
      setLettreMotivation(candidature.lettreMotivation)
    }
  }, [candidature])

  if (!isOpen || !candidature) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (!user) return
      
      await candidatureService.updateApplication(
        candidature.id,
        user.id,
        candidature.offreStage.id,
        lettreMotivation,
        cv || undefined
      )
      onApplicationUpdated()
      onClose()
      setCv(null)
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la modification')
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Modifier la candidature</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="font-semibold">{candidature.offreStage.intitule}</h3>
            <p className="text-sm text-muted-foreground">{candidature.offreStage.nomEntreprise} - {candidature.offreStage.localisation}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cv">Nouveau CV (PDF, optionnel)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="cv"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setCv(e.target.files?.[0] || null)}
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              {cv && (
                <p className="text-sm text-green-600">Nouveau fichier sélectionné: {cv.name}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Laissez vide pour conserver le CV actuel
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lettreMotivation">Lettre de motivation *</Label>
              <Textarea
                id="lettreMotivation"
                value={lettreMotivation}
                onChange={(e) => setLettreMotivation(e.target.value)}
                placeholder="Modifiez votre lettre de motivation..."
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
                disabled={isLoading || !lettreMotivation.trim()} 
                className="flex-1"
              >
                {isLoading ? "Modification..." : "Modifier la candidature"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}