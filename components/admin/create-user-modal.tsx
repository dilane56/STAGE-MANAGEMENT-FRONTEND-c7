"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { userService } from "@/lib/user-service"
import { toast } from "sonner"

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onUserCreated: () => void
}

export function CreateUserModal({ isOpen, onClose, onUserCreated }: CreateUserModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    telephone: "",
    // Étudiant
    filiere: "",
    anneeScolaire: "",
    niveau: "",
    universite: "",
    // Entreprise
    domaineActivite: "",
    siteWeb: "",
    description: "",
    dateCreation: "",
    // Enseignant
    filiere: "",
    grade: "",
    departement: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      switch (selectedRole) {
        case "ETUDIANT":
          await userService.createStudent({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            telephone: formData.telephone || undefined,
            filiere: formData.filiere,
            anneeScolaire: formData.anneeScolaire,
            niveau: formData.niveau,
            universite: formData.universite
          })
          break
        case "ENTREPRISE":
          await userService.createCompany({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            telephone: formData.telephone || undefined,
            domaineActivite: formData.domaineActivite,
            siteWeb: formData.siteWeb || undefined,
            description: formData.description || undefined,
            dateCreation: formData.dateCreation || undefined
          })
          break
        case "ENSEIGNANT":
          await userService.createTeacher({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            telephone: formData.telephone || undefined,
            universite: formData.universite,
            filiere: formData.filiere || undefined,
            grade: formData.grade || undefined,
            departement: formData.departement || undefined
          })
          break
        case "ADMIN":
          await userService.createAdmin({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            telephone: formData.telephone || undefined
          })
          break
        default:
          throw new Error("Veuillez sélectionner un rôle")
      }

      toast.success("Utilisateur créé avec succès!")
      onUserCreated()
      onClose()
      setFormData({
        email: "",
        password: "",
        fullName: "",
        telephone: "",
        filiere: "",
        anneeScolaire: "",
        niveau: "",
        universite: "",
        domaineActivite: "",
        siteWeb: "",
        description: "",
        dateCreation: "",
        filiere: "",
        grade: "",
        departement: ""
      })
      setSelectedRole("")
    } catch (error: any) {
      setError(error.message)
      toast.error(error.message || "Erreur lors de la création")
    } finally {
      setIsLoading(false)
    }
  }

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case "ETUDIANT":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="filiere">Filière *</Label>
              <Input
                id="filiere"
                value={formData.filiere}
                onChange={(e) => setFormData({ ...formData, filiere: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anneeScolaire">Année scolaire *</Label>
              <Input
                id="anneeScolaire"
                value={formData.anneeScolaire}
                onChange={(e) => setFormData({ ...formData, anneeScolaire: e.target.value })}
                placeholder="2023-2024"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="niveau">Niveau *</Label>
              <Input
                id="niveau"
                value={formData.niveau}
                onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                placeholder="Master 2"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="universite">Université *</Label>
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
              <Label htmlFor="domaineActivite">Domaine d'activité *</Label>
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
                type="url"
                value={formData.siteWeb}
                onChange={(e) => setFormData({ ...formData, siteWeb: e.target.value })}
                placeholder="https://example.com"
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
            <div className="space-y-2">
              <Label htmlFor="dateCreation">Date de création</Label>
              <Input
                id="dateCreation"
                type="date"
                value={formData.dateCreation}
                onChange={(e) => setFormData({ ...formData, dateCreation: e.target.value })}
              />
            </div>
          </>
        )
      case "ENSEIGNANT":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="universite">Université *</Label>
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
                placeholder="Professeur, Maître de conférences..."
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Créer un utilisateur</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Rôle *</Label>
              <select
                id="role"
                className="w-full px-3 py-2 border rounded-md"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                required
              >
                <option value="">Sélectionner un rôle</option>
                <option value="ETUDIANT">Étudiant</option>
                <option value="ENTREPRISE">Entreprise</option>
                <option value="ENSEIGNANT">Enseignant</option>
                <option value="ADMIN">Administrateur</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet *</Label>
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

            {renderRoleSpecificFields()}

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
                {isLoading ? "Création..." : "Créer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}