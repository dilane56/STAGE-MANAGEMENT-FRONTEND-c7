import { apiService } from './api'

export interface Secteur {
  id: number
  nomSecteur: string
}

export interface SecteurRequest {
  nomSecteur: string
}

export const secteurService = {
  async getAllSecteurs(): Promise<Secteur[]> {
    const response = await apiService.get('/api/v1/secteurs')
    return response.json()
  },

  async getSecteurById(id: number): Promise<Secteur> {
    const response = await apiService.get(`/api/v1/secteurs/${id}`)
    return response.json()
  },

  async createSecteur(data: SecteurRequest): Promise<Secteur> {
    const response = await apiService.post('/api/v1/secteurs', data)
    return response.json()
  },

  async updateSecteur(id: number, data: SecteurRequest): Promise<Secteur> {
    const response = await apiService.put(`/api/v1/secteurs/${id}`, data)
    return response.json()
  },

  async deleteSecteur(id: number): Promise<string> {
    const response = await apiService.delete(`/api/v1/secteurs/${id}`)
    return response.json()
  }
}