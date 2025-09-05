# STAGE-MANAGEMENT-BACKEND

## API Documentation

### Authentication Endpoints

#### 1. Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "John Doe",
      "telephone": "+1234567890",
      "avatar": "avatar_url",
      "role": "etudiant",
      "createAt": "2024-01-01",
      "updateAt": "2024-01-01",
      "profile": {
        "filiere": "Informatique",
        "anneeScolaire": "2023-2024",
        "niveau": "Master 2",
        "universite": "Université XYZ",
        "domaineActivite": null,
        "siteWeb": null,
        "description": null,
        "dateCreation": null
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Profile Fields by User Type:**

- **Etudiant:** `filiere`, `anneeScolaire`, `niveau`, `universite`
- **Entreprise:** `domaineActivite`, `siteWeb`, `description`, `dateCreation`
- **Enseignant:** `universite`
- **Administrateur:** Tous les champs à null

#### 2. Refresh Token
```
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "new_access_token"
}
```

**Response (Expired):**
```json
{
  "success": false,
  "error": "REFRESH_TOKEN_EXPIRED",
  "message": "Refresh token expiré, reconnexion requise"
}
```

#### 3. Logout
```
POST /api/auth/logout
```

**Response:**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

## Token Management

- **Access Token:** 15 minutes expiration
- **Refresh Token:** 7 days expiration
- **Usage:** Include access token in Authorization header: `Bearer <token>`

## User Management Endpoints

### 1. Get All Users (Admin only)
```
GET /api/users
```

**Query Parameters:**
- `page`: number (default: 0)
- `size`: number (default: 10)
- `role`: string (optional: ETUDIANT, ENTREPRISE, ENSEIGNANT, ADMIN)
- `search`: string (optional: search by name or email)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "email": "user@example.com",
        "fullName": "John Doe",
        "telephone": "+1234567890",
        "avatar": "avatar_url",
        "role": "ETUDIANT",
        "createAt": "2024-01-01",
        "updateAt": "2024-01-01",
        "profile": {
          "filiere": "Informatique",
          "anneeScolaire": "2023-2024",
          "niveau": "Master 2",
          "universite": "Université XYZ",
          "domaineActivite": null,
          "siteWeb": null,
          "description": null,
          "dateCreation": null
        }
      }
    ],
    "totalElements": 100,
    "totalPages": 10,
    "currentPage": 0,
    "size": 10
  }
}
```

### 2. Get User by ID
```
GET /api/users/{id}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "telephone": "+1234567890",
    "avatar": "avatar_url",
    "role": "ETUDIANT",
    "createAt": "2024-01-01",
    "updateAt": "2024-01-01",
    "profile": {
      "filiere": "Informatique",
      "anneeScolaire": "2023-2024",
      "niveau": "Master 2",
      "universite": "Université XYZ",
      "domaineActivite": null,
      "siteWeb": null,
      "description": null,
      "dateCreation": null
    }
  }
}
```

### 3. Create Student
```
POST /api/etudiants
```

**Request Body:**
```json
{
  "email": "etudiant@example.com",
  "password": "password123",
  "fullName": "Jean Dupont",
  "telephone": "+1234567890",
  "avatar": "avatar_url",
  "filiere": "Informatique",
  "anneeScolaire": "2023-2024",
  "niveau": "Master 2",
  "universite": "Université XYZ"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "etudiant@example.com",
    "fullName": "Jean Dupont",
    "telephone": "+1234567890",
    "avatar": "avatar_url",
    "role": "ETUDIANT",
    "filiere": "Informatique",
    "anneeScolaire": "2023-2024",
    "niveau": "Master 2",
    "universite": "Université XYZ",
    "createAt": "2024-01-01",
    "updateAt": "2024-01-01"
  }
}
```

### 4. Create Company
```
POST /api/entreprises
```

**Request Body:**
```json
{
  "email": "entreprise@example.com",
  "password": "password123",
  "fullName": "Tech Corp",
  "telephone": "+1234567890",
  "avatar": "logo_url",
  "domaineActivite": "Technologie",
  "siteWeb": "https://techcorp.com",
  "description": "Entreprise de technologie",
  "dateCreation": "2020-01-01"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "entreprise@example.com",
    "fullName": "Tech Corp",
    "telephone": "+1234567890",
    "avatar": "logo_url",
    "role": "ENTREPRISE",
    "domaineActivite": "Technologie",
    "siteWeb": "https://techcorp.com",
    "description": "Entreprise de technologie",
    "dateCreation": "2020-01-01",
    "createAt": "2024-01-01",
    "updateAt": "2024-01-01"
  }
}
```

### 5. Create Teacher
```
POST /api/enseignants
```

**Request Body:**
```json
{
  "email": "enseignant@example.com",
  "password": "password123",
  "fullName": "Dr. Marie Martin",
  "telephone": "+1234567890",
  "avatar": "avatar_url",
  "universite": "Université XYZ",
  "specialite": "Informatique",
  "grade": "Professeur",
  "departement": "Sciences Informatiques"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "enseignant@example.com",
    "fullName": "Dr. Marie Martin",
    "telephone": "+1234567890",
    "avatar": "avatar_url",
    "role": "ENSEIGNANT",
    "universite": "Université XYZ",
    "specialite": "Informatique",
    "grade": "Professeur",
    "departement": "Sciences Informatiques",
    "createAt": "2024-01-01",
    "updateAt": "2024-01-01"
  }
}
```

### 6. Create Administrator
```
POST /api/administrateurs
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123",
  "fullName": "Admin User",
  "telephone": "+1234567890",
  "avatar": "avatar_url"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@example.com",
    "fullName": "Admin User",
    "telephone": "+1234567890",
    "avatar": "avatar_url",
    "role": "ADMIN",
    "createAt": "2024-01-01",
    "updateAt": "2024-01-01"
  }
}
```

### 7. Update Student
```
PUT /api/etudiants/{id}
```

**Request Body:**
```json
{
  "email": "etudiant@example.com",
  "password": "newpassword123",
  "fullName": "Jean Dupont",
  "telephone": "+1234567890",
  "avatar": "avatar_url",
  "filiere": "Informatique",
  "anneeScolaire": "2023-2024",
  "niveau": "Master 2",
  "universite": "Université XYZ"
}
```

### 8. Update Company
```
PUT /api/entreprises/{id}
```

### 9. Update Teacher
```
PUT /api/enseignants/{id}
```

### 10. Update Administrator
```
PUT /api/administrateurs/{id}
```

### 11. Delete User
```
DELETE /api/users/{id}
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### 12. Get Dashboard Statistics
```
GET /api/stats/dashboard
```

**Response (varies by user role):**

**For Student:**
```json
{
  "success": true,
  "data": {
    "availableInternships": 25,
    "myApplications": 5,
    "acceptedApplications": 1,
    "pendingApplications": 3
  }
}
```

**For Company:**
```json
{
  "success": true,
  "data": {
    "publishedOffers": 10,
    "receivedApplications": 45,
    "acceptedApplications": 8,
    "pendingApplications": 20
  }
}
```

**For Teacher:**
```json
{
  "success": true,
  "data": {
    "totalConventions": 15,
    "pendingConventions": 3,
    "studentsFollowed": 12,
    "completedInternships": 10
  }
}
```

**For Admin:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalCompanies": 25,
    "totalInternships": 50,
    "totalConventions": 30,
    "activeInternships": 35,
    "pendingConventions": 5
  }
}
```