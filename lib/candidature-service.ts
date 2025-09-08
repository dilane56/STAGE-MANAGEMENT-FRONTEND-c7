import { apiService } from './api'
import { type InternshipOffer } from './internship-service'

export interface Candidature {
  id: number
  etudiantId: number
  etudiantUsername: string
  offreStage: {
    id: number
    intitule: string
    secteur: string
    dureeStage: number
    nomEntreprise: string
    localisation: string
  }
  dateCandidature: string
  statutCandidature: "EN_ATTENTE" | "ACCEPTE" | "REFUSE"
  lettreMotivation: string
  cheminFichier: string
  dateReponse?: string
  messageReponse?: string
}

export interface CreateCandidatureData {
  etudiantId: number
  offreStageId: number
}

export const candidatureService = {
  async getMyApplications(etudiantId: number): Promise<Candidature[]> {
    const response = await apiService.get(`/api/candidatures/etudiant/${etudiantId}`)
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des candidatures')
    }
    
    return await response.json()
  },

  async createApplication(data: CreateCandidatureData): Promise<Candidature> {
    const response = await apiService.post('/api/candidatures', data)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la candidature')
    }
    
    return await response.json()
  },

  async createApplicationWithFiles(formData: FormData): Promise<Candidature> {
    const token = localStorage.getItem("token")
    const headers: Record<string, string> = {}
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch('http://localhost:9001/api/candidatures/ajouter', {
      method: 'POST',
      headers,
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la candidature')
    }
    
    return await response.json()
  },

  async withdrawApplication(candidatureId: number): Promise<void> {
    const response = await apiService.delete(`/api/candidatures/${candidatureId}`)
    
    if (!response.ok) {
      throw new Error('Erreur lors du retrait de la candidature')
    }
  },

  async updateApplication(candidatureId: number, etudiantId: number, offreStageId: number, lettreMotivation: string, cv?: File): Promise<void> {
    const token = localStorage.getItem("token")
    const headers: Record<string, string> = {}
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const formData = new FormData()
    formData.append("idEtudiant", etudiantId.toString())
    formData.append("idOffre", offreStageId.toString())
    formData.append("lettreMotivation", lettreMotivation)
    if (cv) {
      formData.append("cv", cv)
    }

    const response = await fetch(`http://localhost:9001/api/candidatures/${candidatureId}`, {
      method: 'PUT',
      headers,
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('Erreur lors de la modification de la candidature')
    }
  },

  async getCompanyApplications(entrepriseId: number): Promise<Candidature[]> {
    const response = await apiService.get(`/api/candidatures/entreprise/${entrepriseId}`)
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des candidatures')
    }
    
    return await response.json()
  },

  async updateApplicationStatus(candidatureId: number, statut: string, message?: string): Promise<void> {
    const params = new URLSearchParams()
    params.append('statut', statut)
    if (message) {
      params.append('message', message)
    }

    const response = await apiService.put(`/api/candidatures/${candidatureId}/statut?${params}`, {})
    
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du statut')
    }
  }
}