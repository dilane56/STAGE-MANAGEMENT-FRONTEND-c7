"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { internshipService, type InternshipOffer } from "@/lib/internship-service"
import { secteurService, type Secteur } from "@/lib/secteur-service"
import { useAuth } from "@/contexts/auth-context"

interface CreateInternshipModalProps {
  isOpen: boolean
  onClose: () => void
  onInternshipCreated: () => void
  internship?: InternshipOffer | null
}

export function CreateInternshipModal({ isOpen, onClose, onInternshipCreated, internship }: CreateInternshipModalProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    intitule: "",
    description: "",
    duree: "",
    localisation: "",
    secteurId: "",
    competences: "",
    dateDebut: "",
    dateLimiteCandidature: "",
    nombrePlaces: ""
  })
  const [secteurs, setSecteurs] = useState<Secteur[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadSecteurs = async () => {
      try {
        const data = await secteurService.getAllSecteurs()
        setSecteurs(data)
      } catch (error) {
        console.error('Erreur lors du chargement des secteurs:', error)
      }
    }
    loadSecteurs()
  }, [])

  useEffect(() => {
    if (internship) {
      setFormData({
        intitule: internship.intitule,
        description: internship.description,
        duree: internship.dureeStage.toString(),
        localisation: internship.localisation,
        secteurId: "", // secteurId n'est pas dans la réponse, on le laisse vide
        competences: internship.competences.join(", "),
        dateDebut: internship.dateDebutStage.split('T')[0],
        dateLimiteCandidature: internship.dateLimiteCandidature.split('T')[0],
        nombrePlaces: internship.nombrePlaces.toString()
      })
    }
  }, [internship])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (!user) throw new Error("Utilisateur non connecté")

      const data = {
        intitule: formData.intitule,
        description: formData.description,
        duree: parseInt(formData.duree),
        entrepriseId: user.id,
        localisation: formData.localisation,
        secteurId: formData.secteurId ? parseInt(formData.secteurId) : null,
        competences: formData.competences.split(",").map(c => c.trim()).filter(c => c),
        dateDebutStage: formData.dateDebut,
        dateLimiteCandidature: formData.dateLimiteCandidature + "T23:59:59",
        nombrePlaces: parseInt(formData.nombrePlaces)
      }

      if (internship) {
        await internshipService.updateInternship(internship.id, data)
      } else {
        await internshipService.createInternship(data)
      }

      onInternshipCreated()
      onClose()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{internship ? "Modifier l'offre" : "Créer une offre de stage"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="intitule">Intitulé *</Label>
                <Input
                  id="intitule"
                  value={formData.intitule}
                  onChange={(e) => setFormData({ ...formData, intitule: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secteurId">Secteur *</Label>
                <Select value={formData.secteurId} onValueChange={(value) => setFormData({ ...formData, secteurId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {secteurs.map((secteur) => (
                      <SelectItem key={secteur.id} value={secteur.id.toString()}>
                        {secteur.nomSecteur}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>



            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duree">Durée (mois) *</Label>
                <Input
                  id="duree"
                  type="number"
                  min="1"
                  value={formData.duree}
                  onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombrePlaces">Nombre de places *</Label>
                <Input
                  id="nombrePlaces"
                  type="number"
                  min="1"
                  value={formData.nombrePlaces}
                  onChange={(e) => setFormData({ ...formData, nombrePlaces: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="localisation">Localisation *</Label>
                <Input
                  id="localisation"
                  value={formData.localisation}
                  onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="competences">Compétences (séparées par des virgules)</Label>
              <Input
                id="competences"
                value={formData.competences}
                onChange={(e) => setFormData({ ...formData, competences: e.target.value })}
                placeholder="React, Node.js, TypeScript"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateDebut">Date de début</Label>
                <Input
                  id="dateDebut"
                  type="date"
                  value={formData.dateDebut}
                  onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateLimiteCandidature">Date limite candidature</Label>
                <Input
                  id="dateLimiteCandidature"
                  type="date"
                  value={formData.dateLimiteCandidature}
                  onChange={(e) => setFormData({ ...formData, dateLimiteCandidature: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (internship ? "Modification..." : "Création...") : (internship ? "Modifier" : "Créer")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}