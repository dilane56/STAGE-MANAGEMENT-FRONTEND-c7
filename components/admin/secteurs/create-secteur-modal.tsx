"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { secteurService } from "@/lib/secteur-service"
import { toast } from "sonner"

interface CreateSecteurModalProps {
  isOpen: boolean
  onClose: () => void
  onSecteurCreated: () => void
}

export function CreateSecteurModal({ isOpen, onClose, onSecteurCreated }: CreateSecteurModalProps) {
  const [nomSecteur, setNomSecteur] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await secteurService.createSecteur({ nomSecteur })
      onSecteurCreated()
      onClose()
      setNomSecteur("")
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création du secteur')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Créer un secteur</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomSecteur">Nom du secteur</Label>
              <Input
                id="nomSecteur"
                value={nomSecteur}
                onChange={(e) => setNomSecteur(e.target.value)}
                placeholder="Ex: Informatique, Marketing, Finance..."
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading || !nomSecteur.trim()} className="flex-1">
                {isLoading ? "Création..." : "Créer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}