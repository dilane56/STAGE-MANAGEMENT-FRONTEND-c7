import { apiService } from './api'

export interface AdminStats {
  totalUsers: number
  totalCompanies: number
  totalInternships: number
  totalConventions: number
  activeInternships: number
  pendingConventions: number
}

export interface MonthlyStats {
  month: string
  internships: number
  applications: number
}

export interface SectorStats {
  name: string
  value: number
  color: string
}

export const statsService = {
  async getDashboardStats(): Promise<AdminStats> {
    const response = await apiService.get('/api/stats/dashboard')
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des statistiques')
    }
    
    const data = await response.json()
    return data.data
  },

  async getMonthlyEvolution(): Promise<MonthlyStats[]> {
    const response = await apiService.get('/api/stats/monthly-evolution')
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des statistiques mensuelles')
    }
    
    const data = await response.json()
    return data.data
  },

  async getInternshipsBySector(): Promise<SectorStats[]> {
    const response = await apiService.get('/api/stats/internships-by-sector')
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des statistiques par secteur')
    }
    
    const data = await response.json()
    return data.data
  }
}