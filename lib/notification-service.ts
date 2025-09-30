import { apiService } from './api'

export interface Notification {
  id: number
  titre: string
  message: string
  dateEnvoi: string
  lu: boolean
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
  utilisateurId: number
}

export const notificationService = {
  async getUserNotifications(userId: number): Promise<Notification[]> {
    const response = await apiService.get(`/api/notifications/utilisateur/${userId}`)
    const data = await response.json()
    return data
  },

  async markAsRead(notificationId: number): Promise<void> {
    const response = await apiService.put(`/api/notifications/${notificationId}/lire`, {})
    if (!response.ok) {
      throw new Error('Erreur lors du marquage comme lu')
    }
  },

  async markAllAsRead(userId: number): Promise<void> {
    const response = await apiService.put(`/api/notifications/utilisateur/${userId}/lire-tout`, {})
    if (!response.ok) {
      throw new Error('Erreur lors du marquage de toutes les notifications')
    }
  },

  async getUnreadCount(userId: number): Promise<number> {
    const response = await apiService.get(`/api/notifications/utilisateur/${userId}/non-lues/count`)
    const data = await response.json()
    return data
  }
}