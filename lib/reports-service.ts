import { apiService } from './api'

export interface StagesByFiliere {
  filiere: string
  totalStages: number
  stagesEnCours: number
  stagesTermines: number
  stagesEnAttente: number
}

export interface ActiveUser {
  id: number
  fullName: string
  email: string
  role: string
  derniereConnexion: string
  status: string
}

export interface CompanyPartner {
  id: number
  fullName: string
  email: string
  domaineActivite: string
  siteWeb: string
  totalOffres: number
  totalCandidatures: number
}



class ReportsService {
  // Export Excel des stages par filière
  async exportStagesByFiliere(): Promise<Blob> {
    const response = await apiService.get('/api/reports/stages-by-filiere/export')
    return response.blob()
  }

  // Obtenir les données des stages par filière
  async getStagesByFiliere(): Promise<StagesByFiliere[]> {
    const response = await apiService.get('/api/reports/stages-by-filiere')
    return response.json()
  }

  // Export des utilisateurs actifs
  async exportActiveUsers(): Promise<Blob> {
    const response = await apiService.get('/api/reports/active-users/export')
    return response.blob()
  }

  // Obtenir la liste des utilisateurs actifs
  async getActiveUsers(): Promise<ActiveUser[]> {
    const response = await apiService.get('/api/reports/active-users')
    return response.json()
  }

  // Export des partenaires entreprises
  async exportCompanyPartners(): Promise<Blob> {
    const response = await apiService.get('/api/reports/company-partners/export')
    return response.blob()
  }

  // Obtenir les partenaires entreprises
  async getCompanyPartners(): Promise<CompanyPartner[]> {
    const response = await apiService.get('/api/reports/company-partners')
    return response.json()
  }

  // Export des stages pour une année donnée
  async exportStagesByYear(year: number): Promise<Blob> {
    const response = await apiService.get(`/api/reports/stages/${year}-01-01/export`)
    return response.blob()
  }

  // Export des conventions signées
  async exportSignedConventions(): Promise<Blob> {
    const response = await apiService.get('/api/reports/conventions/signed/export')
    return response.blob()
  }

  // Export de tous les utilisateurs
  async exportAllUsers(): Promise<Blob> {
    const response = await apiService.get('/api/reports/users/export')
    return response.blob()
  }

  // Export complet de toutes les données
  async exportAllData(): Promise<Blob> {
    const response = await apiService.get('/api/reports/export-all')
    return response.blob()
  }

  // Utilitaire pour télécharger un fichier blob
  downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
}

export const reportsService = new ReportsService()