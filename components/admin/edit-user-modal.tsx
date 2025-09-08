"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { userService, type BackendUser } from "@/lib/user-service"
import { toast } from "sonner"

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
  onUserUpdated: () => void
  user: BackendUser | null
}

export function EditUserModal({ isOpen, onClose, onUserUpdated, user }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    telephone: "",
    filiere: "",
    anneeScolaire: "",
    niveau: "",
    universite: "",
    domaineActivite: "",
    siteWeb: "",
    description: "",
    filiere: "",
    grade: "",
    departement: "",
    password: ""
  })

  const renderRoleSpecificFields = () => {
    if (!user) return null
    
    switch (user.role) {
      case "ETUDIANT":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="filiere">Filière</Label>
              <Input
                id="filiere"
                value={formData.filiere}
                onChange={(e) => setFormData({ ...formData, filiere: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anneeScolaire">Année scolaire</Label>
              <Input
                id="anneeScolaire"
                value={formData.anneeScolaire}
                onChange={(e) => setFormData({ ...formData, anneeScolaire: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="niveau">Niveau</Label>
              <Input
                id="niveau"
                value={formData.niveau}
                onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="universite">Université</Label>
              <Input
                id="universite"
                value={formData.universite}
                onChange={(e) => setFormData({ ...formData, universite: e.target.value })}
                required
              />
            </div>
          </>
        )
      case "ENTREPRISE":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="domaineActivite">Domaine d'activité</Label>
              <Input
                id="domaineActivite"
                value={formData.domaineActivite}
                onChange={(e) => setFormData({ ...formData, domaineActivite: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteWeb">Site web</Label>
              <Input
                id="siteWeb"
                value={formData.siteWeb}
                onChange={(e) => setFormData({ ...formData, siteWeb: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </>
        )
      case "ENSEIGNANT":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="universite">Université</Label>
              <Input
                id="universite"
                value={formData.universite}
                onChange={(e) => setFormData({ ...formData, universite: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filiere">Filière</Label>
              <Input
                id="filiere"
                value={formData.filiere}
                onChange={(e) => setFormData({ ...formData, filiere: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Input
                id="grade"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departement">Département</Label>
              <Input
                id="departement"
                value={formData.departement}
                onChange={(e) => setFormData({ ...formData, departement: e.target.value })}
              />
            </div>
          </>
        )
      default:
        return null
    }
  }
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        fullName: user.fullName || "",
        telephone: user.telephone || "",
        filiere: user.profile?.filiere || "",
        anneeScolaire: user.profile?.anneeScolaire || "",
        niveau: user.profile?.niveau || "",
        universite: user.profile?.universite || "",
        domaineActivite: user.profile?.domaineActivite || "",
        siteWeb: user.profile?.siteWeb || "",
        description: user.profile?.description || "",
        filiere: user.profile?.filiere || "",
        grade: user.profile?.grade || "",
        departement: user.profile?.departement || "",
        password: "" // Champ optionnel pour la mise à jour du mot de passe
      })
    }
  }, [user])

  if (!isOpen || !user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (!user) return
      
      const updateData = {
        email: formData.email,
        fullName: formData.fullName,
        telephone: formData.telephone || undefined,
        ...(formData.password && { password: formData.password })
      }
      
      switch (user.role) {
        case "ETUDIANT":
          await userService.updateStudent(user.id, {
            ...updateData,
            filiere: formData.filiere,
            anneeScolaire: formData.anneeScolaire,
            niveau: formData.niveau,
            universite: formData.universite
          })
          break
        case "ENTREPRISE":
          await userService.updateCompany(user.id, {
            ...updateData,
            domaineActivite: formData.domaineActivite,
            siteWeb: formData.siteWeb || undefined,
            description: formData.description || undefined
          })
          break
        case "ENSEIGNANT":
          await userService.updateTeacher(user.id, {
            ...updateData,
            universite: formData.universite,
            filiere: formData.filiere || undefined,
            grade: formData.grade || undefined,
            departement: formData.departement || undefined
          })
          break
        case "ADMIN":
          await userService.updateAdmin(user.id, updateData)
          break
      }
      
      toast.success("Utilisateur modifié avec succès!")
      onUserUpdated()
      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la modification')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Modifier l'utilisateur</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe (optionnel)</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Laisser vide pour ne pas changer"
              />
            </div>

            {renderRoleSpecificFields()}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Modification..." : "Modifier"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}