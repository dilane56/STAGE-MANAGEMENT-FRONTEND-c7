"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, MessageCircle, User } from "lucide-react"
import { chatService, type Conversation, type Message } from "@/lib/chat-service"
import { candidatureService, type Candidature } from "@/lib/candidature-service"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { Client, IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

let stompClient: Client | null = null

export function ChatInterface() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [selectedUserName, setSelectedUserName] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [applications, setApplications] = useState<Candidature[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isConnected, setIsConnected] = useState(false)

  const loadConversations = async () => {
    if (!user) return
    try {
      const data = await chatService.getUserConversations(user.id)
      setConversations(data)
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error)
    }
  }

  const loadApplications = async () => {
    if (!user) return
    try {
      const data = await candidatureService.getCompanyApplications(user.id)
      setApplications(data.filter(app => app.statutCandidature === 'ACCEPTE'))
    } catch (error) {
      console.error('Erreur lors du chargement des candidatures:', error)
    }
  }

  const loadMessages = async (otherUserId: number, otherUserName: string) => {
    if (!user) return
    setIsLoading(true)
    try {
      const data = await chatService.getConversation(user.id, otherUserId)
      setMessages(data)
      setSelectedUserId(otherUserId)
      setSelectedUserName(otherUserName)
      await chatService.markMessagesAsRead(otherUserId, user.id)
      loadConversations()
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = () => {
    if (!stompClient || !stompClient.connected) {
      toast.error('Socket non connecté, impossible d\'envoyer le message')
      return
    }

    if (!newMessage.trim() || !selectedUserId || !user) return

    const messageData = {
      expediteurId: user.id,
      destinataireId: selectedUserId,
      contenu: newMessage.trim()
    }

    try {
      stompClient.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(messageData)
      })

      // optimistiquement afficher localement
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          content: messageData.contenu,
          dateEnvoi: new Date().toISOString(),
          expediteurId: user.id,
          destinataireId: selectedUserId,
          expediteurFullName: user.fullName || user.email || 'Vous',
          destinataireFullName: selectedUserName,
          lu: true,
          status: 'SENT'
        } as Message
      ])

      setNewMessage('')
    } catch (e) {
      console.error('Erreur en envoyant le message:', e)
      toast.error('Erreur lors de l\'envoi du message')
    }
  }

  const startConversation = (candidature: Candidature) => {
    loadMessages(candidature.etudiantId, candidature.etudiantUsername)
  }

  const onMessageReceived = (payload: IMessage) => {
    try {
      const message = JSON.parse(payload.body) as Message
      setMessages(prev => [...prev, message])
      loadConversations()
    } catch (e) {
      console.error('Erreur de parsing du message reçu:', e)
    }
  }

  const onErrorReceived = (payload: IMessage) => {
    console.error('Erreur reçue:', payload.body)
    toast.error('Une erreur est survenue dans le chat')
  }

  useEffect(() => {
    if (user?.id) {
      loadConversations()
      loadApplications()

      // cleanup previous client if any
      if (stompClient) {
        try { stompClient.deactivate() } catch(e) { /* ignore */ }
        stompClient = null
      }

      const socket = new SockJS('http://localhost:9001/ws-chat')
      stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log('STOMP Debug:', str),
        onConnect: () => {
          console.log('✅ Connecté au WebSocket!')
          setIsConnected(true)

          stompClient?.subscribe(`/user/${user.id}/queue/messages`, onMessageReceived)
          stompClient?.subscribe(`/user/${user.id}/queue/errors`, onErrorReceived)

          stompClient?.publish({
            destination: '/app/chat.join',
            body: user.id.toString()
          })
        },
        onStompError: (frame) => {
          console.error('Erreur STOMP:', frame)
          setIsConnected(false)
        },
        onDisconnect: () => {
          console.log('Déconnecté du WebSocket')
          setIsConnected(false)
        }
      })

      stompClient.activate()

      return () => {
        if (stompClient) {
          try { stompClient.deactivate() } catch(e) { /* ignore */ }
          stompClient = null
        }
        setIsConnected(false)
      }
    }
  }, [user?.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getAvatarInitials = (nameOrEmail?: string) => {
    if (!nameOrEmail) return ''
    const parts = nameOrEmail.split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return nameOrEmail.slice(0,2).toUpperCase()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Liste des conversations */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Conversations
            <div className="ml-auto">
              {isConnected ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  Connecté
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                  Déconnecté
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[500px] overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4">
                <p className="text-sm text-muted-foreground mb-4">Aucune conversation</p>
                <div className="space-y-2">
                  <p className="text-xs font-medium">Cliquez sur un candidat pour démarrer:</p>
                  {applications.map((app) => (
                    <div 
                      key={app.id} 
                      className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                      onClick={() => startConversation(app)}
                    >
                      <p className="text-sm font-medium">{app.etudiantUsername}</p>
                      <p className="text-xs text-muted-foreground">{app.offreStage?.intitule}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    setSelectedConversation(conv)
                    const otherUserEmail = user?.email === conv.participant1Email ? conv.participant2Email : conv.participant1Email
                    // Trouver l'ID de l'utilisateur depuis les candidatures
                    const candidature = applications.find(app => app.etudiantUsername === otherUserEmail || (otherUserEmail && app.etudiantUsername.includes(otherUserEmail.split('@')[0])))
                    const otherUserId = candidature?.etudiantId
                    if (!otherUserId) {
                      toast.error('Impossible de trouver l\'ID du destinataire pour cette conversation')
                      return
                    }
                    loadMessages(otherUserId, otherUserEmail)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {getAvatarInitials(conv.nom || (user?.email === conv.participant1Email ? conv.participant2Email : conv.participant1Email))}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                          {conv.nom || (user?.email === conv.participant1Email ? conv.participant2Email : conv.participant1Email)}
                        </p>
                      </div>
                      {conv.dernierMessage && (
                        <p className="text-xs text-muted-foreground truncate">
                          {conv.dernierMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Zone de chat */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            {selectedUserId 
              ? `Chat avec ${selectedUserName}`
              : 'Sélectionnez une conversation'
            }
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[500px]">
          {selectedUserId ? (
            <>
              <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                {isLoading ? (
                  <div className="text-center py-4">Chargement...</div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.expediteurId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                          message.expediteurId === user?.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.dateEnvoi).toLocaleTimeString("fr-FR", {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={!isConnected}
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim() || !isConnected}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Sélectionnez une conversation pour commencer à chatter
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}