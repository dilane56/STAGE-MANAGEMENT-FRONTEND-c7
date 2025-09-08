import { apiService } from './api'

export interface Message {
  id: number
  content: string
  dateEnvoi: string
  expediteurId: number
  destinataireId: number
  expediteurFullName: string
  destinataireFullName: string
  lu: boolean
  status: string
}

export interface Conversation {
  id: number
  participant1Email: string
  participant2Email: string
  nom: string
  dateCreation: string
  dateDernierMessage: string
  dernierMessage?: Message
}

export const chatService = {
  async getUserConversations(userId: number): Promise<Conversation[]> {
    const response = await apiService.get(`/api/messages/conversations/${userId}`)
    const data = await response.json()
    return data
  },

  async getConversation(user1Id: number, user2Id: number): Promise<Message[]> {
    const response = await apiService.get(`/api/messages/conversation/${user1Id}/${user2Id}`)
    const data = await response.json()
    return data
  },

  async markMessagesAsRead(senderId: number, recipientId: number): Promise<void> {
    const response = await apiService.post(`/api/messages/mark-as-read/${senderId}/${recipientId}`, {})
    if (!response.ok) {
      throw new Error('Erreur lors du marquage des messages')
    }
  }
}