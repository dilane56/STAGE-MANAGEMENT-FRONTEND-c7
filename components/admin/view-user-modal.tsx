"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { type BackendUser } from "@/lib/user-service"

interface ViewUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: BackendUser | null
}

export function ViewUserModal({ isOpen, onClose, user }: ViewUserModalProps) {
  if (!isOpen || !user) return null

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ETUDIANT":
        return "Étudiant"
      case "ENTREPRISE":
        return "Entreprise"
      case "ENSEIGNANT":
        return "Enseignant"
      case "ADMIN":
        return "Admin"
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ETUDIANT":
        return "bg-blue-100 text-blue-800"
      case "ENTREPRISE":
        return "bg-green-100 text-green-800"
      case "ENSEIGNANT":
        return "bg-purple-100 text-purple-800"
      case "ADMIN":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3">
              {user.fullName}
              <Badge className={getRoleColor(user.role)}>{getRoleLabel(user.role)}</Badge>
            </CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informations générales */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Informations générales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                <p className="text-sm">{user.telephone || "Non renseigné"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date de création</p>
                <p className="text-sm">
                  {user.createAt ? new Date(user.createAt).toLocaleDateString("fr-FR") : "Non renseigné"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dernière mise à jour</p>
                <p className="text-sm">
                  {user.updateAt ? new Date(user.updateAt).toLocaleDateString("fr-FR") : "Non renseigné"}
                </p>
              </div>
            </div>
          </div>

          {/* Profil spécifique selon le rôle */}
          {user.profile && Object.keys(user.profile).some(key => user.profile[key as keyof typeof user.profile]) && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Profil {getRoleLabel(user.role).toLowerCase()}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.role === "ETUDIANT" && (
                  <>
                    {user.profile.filiere && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Filière</p>
                        <p className="text-sm">{user.profile.filiere}</p>
                      </div>
                    )}
                    {user.profile.niveau && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Niveau</p>
                        <p className="text-sm">{user.profile.niveau}</p>
                      </div>
                    )}
                    {user.profile.anneeScolaire && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Année scolaire</p>
                        <p className="text-sm">{user.profile.anneeScolaire}</p>
                      </div>
                    )}
                    {user.profile.universite && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Université</p>
                        <p className="text-sm">{user.profile.universite}</p>
                      </div>
                    )}
                  </>
                )}
                
                {user.role === "ENTREPRISE" && (
                  <>
                    {user.profile.domaineActivite && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Domaine d'activité</p>
                        <p className="text-sm">{user.profile.domaineActivite}</p>
                      </div>
                    )}
                    {user.profile.siteWeb && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Site web</p>
                        <p className="text-sm">
                          <a href={user.profile.siteWeb} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {user.profile.siteWeb}
                          </a>
                        </p>
                      </div>
                    )}
                    {user.profile.description && (
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Description</p>
                        <p className="text-sm">{user.profile.description}</p>
                      </div>
                    )}
                    {user.profile.dateCreation && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Date de création de l'entreprise</p>
                        <p className="text-sm">{new Date(user.profile.dateCreation).toLocaleDateString("fr-FR")}</p>
                      </div>
                    )}
                  </>
                )}
                
                {user.role === "ENSEIGNANT" && (
                  <>
                    {user.profile.universite && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Université</p>
                        <p className="text-sm">{user.profile.universite}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={onClose}>Fermer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}