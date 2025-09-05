import { apiService } from './api'

export interface InternshipOffer {
  id: number
  intitule: string
  description: string
  dureeStage: number
  nomEntreprise: string
  localisation: string
  competences: string[]
  secteurName?: string
  datePublication: string
  dateLimiteCandidature: string
  dateDebutStage: string
  nombrePlaces: number
  candidatures?: any[]
}

export interface CreateInternshipData {
  intitule: string
  description: string
  duree: number
  entrepriseId: number
  localisation: string
  secteurId?: number | null
  competences: string[]
  dateDebutStage: string
  dateLimiteCandidature: string
  nombrePlaces: number
}

export const internshipService = {
  async getAllInternships(): Promise<InternshipOffer[]> {
    const response = await apiService.get('/api/offres-stage')
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des offres de stage')
    }
    
    return await response.json()
  },

  async getInternshipsByCompany(entrepriseId: number): Promise<InternshipOffer[]> {
    const response = await apiService.get(`/api/offres-stage/entreprise/${entrepriseId}`)
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des offres de l\'entreprise')
    }
    
    return await response.json()
  },

  async getInternshipById(id: number): Promise<InternshipOffer> {
    const response = await apiService.get(`/api/offres-stage/${id}`)
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de l\'offre de stage')
    }
    
    return await response.json()
  },

  async createInternship(data: CreateInternshipData): Promise<InternshipOffer> {
    const response = await apiService.post('/api/offres-stage', data)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la création de l\'offre de stage')
    }
    
    return await response.json()
  },

  async updateInternship(id: number, data: CreateInternshipData): Promise<InternshipOffer> {
    const response = await apiService.put(`/api/offres-stage/${id}`, data)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la mise à jour de l\'offre de stage')
    }
    
    return await response.json()
  },

  async deleteInternship(id: number): Promise<void> {
    const response = await apiService.delete(`/api/offres-stage/${id}`)
    
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de l\'offre de stage')
    }
  },

  async filterInternships(localisation?: string, duree?: number): Promise<InternshipOffer[]> {
    const params = new URLSearchParams()
    if (localisation) params.append('localisation', localisation)
    if (duree) params.append('duree', duree.toString())
    
    const response = await apiService.get(`/api/offres-stage/filtrer?${params}`)
    
    if (!response.ok) {
      throw new Error('Erreur lors du filtrage des offres de stage')
    }
    
    return await response.json()
  },

  async getInternshipsByEntreprise(entrepriseId: number): Promise<InternshipOffer[]> {
    const response = await apiService.get(`/api/offres-stage/entreprise/${entrepriseId}`)

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des offres de stage pour l\'entreprise')
    }

    return await response.json()
  }
}