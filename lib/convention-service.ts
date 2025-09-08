import { apiService } from './api'

export interface Convention {
  idConvention: number
  enseignantName: string
  administratorName: string
  statutConvention: string
  dateCreation: string
  candidature: {
    id: number
    etudiantUsername: string
    offreStage: {
      intitule: string
      secteur: string
    }
  }
}

export interface ConventionRequest {
  idCandidature: number
}

export const conventionService = {
  async getConventionsByCompany(entrepriseId: number): Promise<Convention[]> {
    const response = await apiService.get(`/api/conventions/entreprise/${entrepriseId}`)
    const data = await response.json()
    return data
  },

  async createConvention(candidatureId: number): Promise<Convention> {
    const response = await apiService.post('/api/conventions', {
      idCandidature: candidatureId
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erreur ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    return data
  },

  async updateConvention(idConvention: number, candidatureId: number): Promise<Convention> {
    if (!idConvention || idConvention === undefined) {
      throw new Error('ID de convention manquant')
    }
    
    const response = await apiService.put(`/api/conventions/${idConvention}`, {
      idCandidature: candidatureId
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erreur ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    return data
  },

  async deleteConvention(idConvention: number): Promise<string> {
    const response = await apiService.delete(`/api/conventions/${idConvention}`)
    const data = await response.json()
    return data
  },

  async downloadConvention(idConvention: number): Promise<void> {
    const response = await apiService.get(`/api/conventions/${idConvention}/generate-pdf`)
    const blob = await response.blob()
    
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `convention_${idConvention}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },

  async getAllConventions(): Promise<Convention[]> {
    const response = await apiService.get('/api/conventions')
    const data = await response.json()
    return data
  },

  async approveConventionByAdmin(conventionId: number, adminId: number): Promise<Convention> {
    const response = await apiService.put(`/api/conventions/${conventionId}/approuver-administrateur/${adminId}`, {})
    const data = await response.json()
    return data
  },

  async getConventionsByTeacher(enseignantId: number): Promise<Convention[]> {
    const response = await apiService.get(`/api/conventions/enseignant/${enseignantId}`)
    const data = await response.json()
    return data
  },

  async validateConventionByTeacher(conventionId: number, enseignantId: number): Promise<Convention> {
    const response = await apiService.put(`/api/conventions/${conventionId}/valider-enseignant/${enseignantId}`, {})
    const data = await response.json()
    return data
  }
}