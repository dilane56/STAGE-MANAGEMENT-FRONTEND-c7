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

  async createConvention(candidatureId: number, file: File): Promise<Convention> {
    const formData = new FormData()
    formData.append('candidature-id', candidatureId.toString())
    formData.append('pdf', file)

    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:9001/api/conventions/ajouter', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erreur ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    return data
  },

  async updateConvention(idConvention: number, candidatureId: number, file: File): Promise<Convention> {
    if (!idConvention || idConvention === undefined) {
      throw new Error('ID de convention manquant')
    }
    
    const formData = new FormData()
    formData.append('candidature-id', candidatureId.toString())
    formData.append('pdf', file)

    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:9001/api/conventions/${idConvention}/modifier`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
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
    const response = await apiService.get(`/api/conventions/${idConvention}/download`)
    const blob = await response.blob()
    
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `convention_${idConvention}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }
}