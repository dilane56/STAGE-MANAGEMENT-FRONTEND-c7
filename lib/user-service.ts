import { apiService } from './api'

export interface BackendUser {
  id: number
  email: string
  fullName: string
  telephone?: string
  avatar?: string
  role: 'ETUDIANT' | 'ENTREPRISE' | 'ENSEIGNANT' | 'ADMIN'
  createAt?: string
  updateAt?: string
  profile: {
    filiere?: string
    anneeScolaire?: string
    niveau?: string
    universite?: string
    domaineActivite?: string
    siteWeb?: string
    description?: string
    dateCreation?: string
  }
}

export interface UsersResponse {
  users: BackendUser[]
  totalElements: number
  totalPages: number
  currentPage: number
  size: number
}

export const userService = {
  async getUsers(): Promise<BackendUser[]> {
    const response = await apiService.get('/api/utilisateurs')
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des utilisateurs')
    }
    
    return await response.json()
  },

  async getUserById(id: number): Promise<BackendUser> {
    const response = await apiService.get(`/api/utilisateurs/${id}`)
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de l\'utilisateur')
    }
    
    return await response.json()
  },

  async deleteUser(id: number): Promise<void> {
    const response = await apiService.delete(`/api/utilisateurs/${id}`)
    
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de l\'utilisateur')
    }
  },

  async createStudent(data: {
    email: string
    password: string
    fullName: string
    telephone?: string
    filiere: string
    anneeScolaire: string
    niveau: string
    universite: string
  }) {
    const response = await apiService.post('/api/etudiants', data)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la création de l\'étudiant')
    }
    
    return await response.json()
  },

  async createCompany(data: {
    email: string
    password: string
    fullName: string
    telephone?: string
    domaineActivite: string
    siteWeb?: string
    description?: string
    dateCreation?: string
  }) {
    const response = await apiService.post('/api/entreprises', data)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la création de l\'entreprise')
    }
    
    return await response.json()
  },

  async createTeacher(data: {
    email: string
    password: string
    fullName: string
    telephone?: string
    universite: string
    filiere?: string
    grade?: string
    departement?: string
  }) {
    const response = await apiService.post('/api/enseignants', data)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la création de l\'enseignant')
    }
    
    return await response.json()
  },

  async createAdmin(data: {
    email: string
    password: string
    fullName: string
    telephone?: string
  }) {
    const response = await apiService.post('/api/administrateurs', data)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la création de l\'administrateur')
    }
    
    return await response.json()
  },

  async updateStudent(id: number, data: {
    email: string
    password?: string
    fullName: string
    telephone?: string
    filiere: string
    anneeScolaire: string
    niveau: string
    universite: string
  }) {
    const response = await apiService.put(`/api/etudiants/${id}`, data)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la mise à jour de l\'étudiant')
    }
    
    return await response.json()
  },

  async updateCompany(id: number, data: {
    email: string
    password?: string
    fullName: string
    telephone?: string
    domaineActivite: string
    siteWeb?: string
    description?: string
    dateCreation?: string
  }) {
    const response = await apiService.put(`/api/entreprises/${id}`, data)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la mise à jour de l\'entreprise')
    }
    
    return await response.json()
  },

  async updateTeacher(id: number, data: {
    email: string
    password?: string
    fullName: string
    telephone?: string
    universite: string
    filiere?: string
    grade?: string
    departement?: string
  }) {
    const response = await apiService.put(`/api/enseignants/${id}`, data)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la mise à jour de l\'enseignant')
    }
    
    return await response.json()
  },

  async updateAdmin(id: number, data: {
    email: string
    password?: string
    fullName: string
    telephone?: string
  }) {
    const response = await apiService.put(`/api/administrateurs/${id}`, data)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la mise à jour de l\'administrateur')
    }
    
    return await response.json()
  },

  async getStudentsByTeacher(enseignantId: number): Promise<BackendUser[]> {
    const response = await apiService.get(`/api/etudiants/enseignant/${enseignantId}`)
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des étudiants')
    }
    
    return await response.json()
  }
}