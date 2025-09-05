import { apiService } from './api'

export interface AdminStats {
  totalUsers: number
  totalCompanies: number
  totalInternships: number
  totalConventions: number
  activeInternships: number
  pendingConventions: number
}

export const statsService = {
  async getDashboardStats(): Promise<AdminStats> {
    const response = await apiService.get('/api/stats/dashboard')
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des statistiques')
    }
    
    const data = await response.json()
    return data.data
  }
}