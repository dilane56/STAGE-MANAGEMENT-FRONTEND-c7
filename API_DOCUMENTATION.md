# Documentation API Backend - Système de Gestion de Stages

## Vue d'ensemble

Cette documentation décrit tous les endpoints API nécessaires pour le backend du système de gestion de stages universitaires. L'API doit supporter 4 types d'utilisateurs : Étudiants, Entreprises, Enseignants et Administrateurs.

## Base URL
```
https://api.stage-management.com/v1
```

## Authentification

### POST /auth/login
Connexion utilisateur

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "name": "string",
      "role": "student|company|teacher|admin",
      "avatar": "string|null",
      "profile": {
        "university": "string|null",
        "field": "string|null",
        "company": "string|null",
        "department": "string|null"
      }
    },
    "token": "string",
    "refreshToken": "string"
  }
}
```

### POST /auth/logout
Déconnexion utilisateur

### POST /auth/refresh
Renouvellement du token

---

## Gestion des Utilisateurs

### GET /users/profile
Récupérer le profil de l'utilisateur connecté

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "student|company|teacher|admin",
    "avatar": "string|null",
    "profile": {
      "university": "string|null",
      "field": "string|null",
      "company": "string|null",
      "department": "string|null",
      "year": "string|null"
    },
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

### PUT /users/profile
Mettre à jour le profil utilisateur

### GET /users (Admin seulement)
Liste tous les utilisateurs avec pagination

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `role`: string (optional filter)
- `search`: string (optional)

---

## Gestion des Stages (Offres)

### GET /internships
Récupérer la liste des offres de stage

**Query Parameters:**
- `page`: number
- `limit`: number
- `search`: string (titre, entreprise, compétences)
- `location`: string
- `field`: string
- `duration`: string
- `status`: "active|closed|draft"

**Response:**
```json
{
  "success": true,
  "data": {
    "internships": [
      {
        "id": "string",
        "title": "string",
        "company": {
          "id": "string",
          "name": "string",
          "logo": "string|null"
        },
        "location": "string",
        "duration": "string",
        "description": "string",
        "requirements": "string",
        "skills": ["string"],
        "status": "active|closed|draft",
        "startDate": "string",
        "endDate": "string",
        "applicationDeadline": "string",
        "applicationsCount": "number",
        "createdAt": "string",
        "updatedAt": "string"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number"
    }
  }
}
```

### GET /internships/:id
Récupérer les détails d'une offre de stage

### POST /internships (Entreprise seulement)
Créer une nouvelle offre de stage

**Request Body:**
```json
{
  "title": "string",
  "location": "string",
  "duration": "string",
  "description": "string",
  "requirements": "string",
  "skills": ["string"],
  "startDate": "string",
  "endDate": "string",
  "applicationDeadline": "string",
  "field": "string"
}
```

### PUT /internships/:id (Entreprise seulement)
Mettre à jour une offre de stage

### DELETE /internships/:id (Entreprise seulement)
Supprimer une offre de stage

### GET /internships/company/:companyId (Entreprise seulement)
Récupérer les offres d'une entreprise spécifique

---

## Gestion des Candidatures

### GET /applications
Récupérer les candidatures (contexte selon le rôle)
- Étudiant : ses candidatures
- Entreprise : candidatures reçues
- Enseignant/Admin : toutes les candidatures

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "string",
        "student": {
          "id": "string",
          "name": "string",
          "email": "string",
          "field": "string",
          "year": "string",
          "university": "string"
        },
        "internship": {
          "id": "string",
          "title": "string",
          "company": "string",
          "location": "string",
          "duration": "string"
        },
        "status": "pending|accepted|rejected",
        "appliedDate": "string",
        "cv": "string|null",
        "coverLetter": "string|null",
        "responseDate": "string|null",
        "responseMessage": "string|null"
      }
    ]
  }
}
```

### POST /applications
Postuler à une offre de stage (Étudiant seulement)

**Request Body:**
```json
{
  "internshipId": "string",
  "coverLetter": "string",
  "cv": "file" // multipart/form-data
}
```

### PUT /applications/:id/status (Entreprise seulement)
Mettre à jour le statut d'une candidature

**Request Body:**
```json
{
  "status": "accepted|rejected",
  "message": "string|null"
}
```

### GET /applications/:id
Récupérer les détails d'une candidature

---

## Gestion des Conventions

### GET /conventions
Récupérer les conventions (contexte selon le rôle)

**Response:**
```json
{
  "success": true,
  "data": {
    "conventions": [
      {
        "id": "string",
        "student": {
          "id": "string",
          "name": "string",
          "email": "string",
          "field": "string",
          "university": "string"
        },
        "company": {
          "id": "string",
          "name": "string",
          "address": "string"
        },
        "internship": {
          "id": "string",
          "title": "string",
          "description": "string"
        },
        "teacher": {
          "id": "string",
          "name": "string",
          "email": "string"
        },
        "duration": "string",
        "startDate": "string",
        "endDate": "string",
        "status": "pending|approved|rejected|signed",
        "submittedDate": "string",
        "approvedDate": "string|null",
        "signedDate": "string|null",
        "pdfUrl": "string|null",
        "comments": "string|null"
      }
    ]
  }
}
```

### POST /conventions (Étudiant seulement)
Soumettre une convention de stage

**Request Body:**
```json
{
  "applicationId": "string",
  "teacherId": "string",
  "startDate": "string",
  "endDate": "string",
  "additionalInfo": "string|null"
}
```

### PUT /conventions/:id/approve (Enseignant seulement)
Approuver une convention

**Request Body:**
```json
{
  "approved": "boolean",
  "comments": "string|null"
}
```

### PUT /conventions/:id/sign (Étudiant/Entreprise)
Signer une convention

### GET /conventions/:id/pdf
Télécharger le PDF de la convention

---

## Statistiques et Rapports

### GET /stats/dashboard
Statistiques pour le tableau de bord (contexte selon le rôle)

**Response pour Étudiant:**
```json
{
  "success": true,
  "data": {
    "availableInternships": "number",
    "myApplications": "number",
    "acceptedApplications": "number",
    "pendingApplications": "number"
  }
}
```

**Response pour Entreprise:**
```json
{
  "success": true,
  "data": {
    "publishedOffers": "number",
    "receivedApplications": "number",
    "acceptedApplications": "number",
    "pendingApplications": "number"
  }
}
```

**Response pour Enseignant:**
```json
{
  "success": true,
  "data": {
    "totalConventions": "number",
    "pendingConventions": "number",
    "studentsFollowed": "number",
    "completedInternships": "number"
  }
}
```

**Response pour Admin:**
```json
{
  "success": true,
  "data": {
    "totalUsers": "number",
    "totalCompanies": "number",
    "totalInternships": "number",
    "totalConventions": "number",
    "activeInternships": "number",
    "pendingConventions": "number",
    "monthlyStats": [
      {
        "month": "string",
        "internships": "number",
        "applications": "number"
      }
    ],
    "internshipsByField": [
      {
        "name": "string",
        "value": "number"
      }
    ]
  }
}
```

### GET /stats/reports (Admin seulement)
Génération de rapports détaillés

---

## Gestion des Étudiants (Enseignant/Admin)

### GET /students
Liste des étudiants avec leur statut de stage

**Response:**
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "field": "string",
        "year": "string",
        "university": "string",
        "internshipStatus": "searching|applied|accepted|completed",
        "currentInternship": {
          "id": "string|null",
          "title": "string|null",
          "company": "string|null",
          "startDate": "string|null",
          "endDate": "string|null"
        },
        "teacher": {
          "id": "string",
          "name": "string"
        }
      }
    ]
  }
}
```

### GET /students/:id
Détails d'un étudiant spécifique

---

## Upload de Fichiers

### POST /upload/cv
Upload de CV (Étudiant seulement)

### POST /upload/documents
Upload de documents divers

**Response:**
```json
{
  "success": true,
  "data": {
    "fileUrl": "string",
    "fileName": "string",
    "fileSize": "number"
  }
}
```

---

## Notifications

### GET /notifications
Récupérer les notifications de l'utilisateur

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "string",
        "type": "application_status|convention_update|new_offer",
        "title": "string",
        "message": "string",
        "read": "boolean",
        "createdAt": "string",
        "relatedId": "string|null"
      }
    ]
  }
}
```

### PUT /notifications/:id/read
Marquer une notification comme lue

---

## Codes d'Erreur

### Codes HTTP Standards
- `200` - Succès
- `201` - Créé avec succès
- `400` - Requête invalide
- `401` - Non authentifié
- `403` - Non autorisé
- `404` - Ressource non trouvée
- `422` - Erreur de validation
- `500` - Erreur serveur

### Format des Erreurs
```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string",
    "details": "object|null"
  }
}
```

---

## Modèles de Données

### User
```typescript
interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'company' | 'teacher' | 'admin'
  avatar?: string
  profile: {
    university?: string
    field?: string
    company?: string
    department?: string
    year?: string
  }
  createdAt: string
  updatedAt: string
}
```

### Internship
```typescript
interface Internship {
  id: string
  title: string
  companyId: string
  location: string
  duration: string
  description: string
  requirements: string
  skills: string[]
  field: string
  status: 'active' | 'closed' | 'draft'
  startDate: string
  endDate: string
  applicationDeadline: string
  createdAt: string
  updatedAt: string
}
```

### Application
```typescript
interface Application {
  id: string
  studentId: string
  internshipId: string
  status: 'pending' | 'accepted' | 'rejected'
  appliedDate: string
  cv?: string
  coverLetter?: string
  responseDate?: string
  responseMessage?: string
}
```

### Convention
```typescript
interface Convention {
  id: string
  studentId: string
  companyId: string
  internshipId: string
  teacherId: string
  duration: string
  startDate: string
  endDate: string
  status: 'pending' | 'approved' | 'rejected' | 'signed'
  submittedDate: string
  approvedDate?: string
  signedDate?: string
  pdfUrl?: string
  comments?: string
}
```

---

## Notes d'Implémentation

1. **Authentification** : Utiliser JWT avec refresh tokens
2. **Autorisation** : Middleware de vérification des rôles
3. **Validation** : Valider toutes les entrées utilisateur
4. **Pagination** : Implémenter la pagination pour toutes les listes
5. **Upload** : Gérer l'upload sécurisé des fichiers (CV, documents)
6. **Notifications** : Système de notifications en temps réel (WebSocket optionnel)
7. **Logs** : Logger toutes les actions importantes
8. **Cache** : Mettre en cache les données fréquemment consultées
9. **Rate Limiting** : Limiter le nombre de requêtes par utilisateur
10. **CORS** : Configurer CORS pour le frontend

Cette documentation couvre tous les besoins identifiés dans votre application frontend React.