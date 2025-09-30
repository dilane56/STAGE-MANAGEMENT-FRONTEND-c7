"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, MessageCircle, User } from "lucide-react"
import { chatService, type Conversation } from "@/lib/chat-service"
import { candidatureService, type Candidature } from "@/lib/candidature-service"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"
import { Client, IMessage } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

// Interfaces pour correspondre aux données du backend
interface Contact {
  id: number;
  email: string;
  nom?: string;
  prenom?: string;
  role: string;
  status?: 'EN_LIGNE' | 'HORS_LIGNE' | 'ABSENT' | 'OCCUPE';
  derniereConnexion?: string | null;
}

interface ChatMessage {
  id?: number;
  expediteurId: number;
  expediteurNom?: string;
  expediteurPrenom?: string;
  destinataireId: number;
  destinataireNom?: string;
  destinatairePrenom?: string;
  contenu: string;
  dateEnvoi: string;
  lu?: boolean;
  status?: 'SENT' | 'DELIVERED' | 'READ';
}

let stompClient: Client | null = null

export function ChatInterface() {
  const { user, isLoading: isUserLoading } = useAuth()

  // conversations (from backend) and applications used to start chats
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [applications, setApplications] = useState<Candidature[]>([])

  // contacts and selected contact (single source of truth for recipient)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  // messages and input
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [message, setMessage] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  // keep track of active stomp subscriptions so we can unsubscribe cleanly
  const subscriptionsRef = useRef<any[]>([])
  // in-memory dedupe cache for recently received messages (to avoid showing duplicates)
  const recentMessagesRef = useRef<Set<string>>(new Set())
  const [token, setToken] = useState<string | null>(null)
  const API_BASE_URL = "http://localhost:9001/api"

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"))
    }
  }, [])

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

  const loadMessages = async (otherUserId: number) => {
    if (!user) return
    setIsLoading(true)
    try {
      const data = await chatService.getConversation(user.id, otherUserId)
      // normalize backend message keys to our ChatMessage shape if needed
      const normalized: ChatMessage[] = Array.isArray(data)
        ? data.map((m: any) => ({
            id: m.id,
            expediteurId: m.expediteurId ?? m.senderId ?? m.fromId,
            destinataireId: m.destinataireId ?? m.recipientId ?? m.toId,
            contenu: m.content ?? m.contenu,
            dateEnvoi: m.dateEnvoi ?? m.sentAt ?? m.date,
            lu: m.lu ?? m.read ?? false,
            status: m.status ?? 'DELIVERED'
          }))
        : []

      setMessages(normalized)
      // populate dedupe cache from loaded messages
      try {
        const set = new Set<string>()
        for (const m of normalized) {
          const key = `${m.expediteurId}-${m.destinataireId}-${(m.contenu || '').trim()}-${m.dateEnvoi}`
          set.add(key)
        }
        recentMessagesRef.current = set
      } catch (e) {
        // ignore cache population errors
      }
      await chatService.markMessagesAsRead(otherUserId, user.id)
      loadConversations()
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error)
      setMessages([])
    } finally {
      setIsLoading(false)
    }
  }

  // WebSocket handlers
  const onMessageReceived = (payload: IMessage) => {
    try {
      const m = JSON.parse(payload.body) as any
      const messageObj: ChatMessage = {
        id: m.id,
        expediteurId: m.expediteurId ?? m.senderId,
        destinataireId: m.destinataireId ?? m.recipientId,
        contenu: m.content ?? m.contenu,
        dateEnvoi: m.dateEnvoi ?? new Date().toISOString(),
        lu: m.lu ?? false,
        status: m.status ?? 'DELIVERED'
      }

      // build a dedupe key; fallback to timestamp/content when id is not present
      const key = `${messageObj.expediteurId}-${messageObj.destinataireId}-${(messageObj.contenu || '').trim()}-${messageObj.dateEnvoi}`
      const recent = recentMessagesRef.current
      if (recent.has(key)) {
        // already processed this message recently -> ignore duplicate
        return
      }

      // add to cache and keep bounded
      recent.add(key)
      if (recent.size > 200) {
        const arr = Array.from(recent)
        recentMessagesRef.current = new Set(arr.slice(-100))
      }

      setMessages(prev => {
        // if server provides stable ids, avoid duplicates by id
        if (messageObj.id != null && prev.some(pm => pm.id === messageObj.id)) return prev
        // otherwise avoid exact key duplicates
        if (prev.some(pm => `${pm.expediteurId}-${pm.destinataireId}-${(pm.contenu||'').trim()}-${pm.dateEnvoi}` === key)) return prev
        return [...prev, messageObj]
      })

      loadConversations()
    } catch (e) {
      console.error('Erreur de parsing du message reçu:', e)
    }
  }

  const onErrorReceived = (payload: IMessage) => {
    console.error('Erreur reçue:', payload.body)
    toast.error('Une erreur est survenue dans le chat')
  }

  const onStatusChange = (payload: IMessage) => {
    try {
      const statusData = JSON.parse(payload.body)
      setContacts(prev => prev.map(c => c.id === statusData.userId ? { ...c, status: statusData.status, derniereConnexion: statusData.lastSeen || c.derniereConnexion } : c))
      setSelectedContact(prev => prev && prev.id === statusData.userId ? { ...prev, status: statusData.status, derniereConnexion: statusData.lastSeen || prev.derniereConnexion } : prev)
    } catch (e) {
      console.error('Erreur de parsing du changement de statut:', e)
    }
  }

  // setup websocket
  useEffect(() => {
    if (!user?.id) return

    // cleanup previous client
    if (stompClient) {
      try { stompClient.deactivate() } catch (e) { }
      stompClient = null
    }

    const socket = new SockJS("http://localhost:9001/ws-chat")
    stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('✅ Connecté au WebSocket!')
        setIsConnected(true)

        try {
          const subMsg = stompClient?.subscribe(`/user/${user.id}/queue/messages`, onMessageReceived)
          const subErr = stompClient?.subscribe(`/user/${user.id}/queue/errors`, onErrorReceived)
          const subStatus = stompClient?.subscribe('/topic/status', onStatusChange)

          if (subMsg) subscriptionsRef.current.push(subMsg)
          if (subErr) subscriptionsRef.current.push(subErr)
          if (subStatus) subscriptionsRef.current.push(subStatus)

          stompClient?.publish({ destination: '/app/chat.join', body: user.id.toString() })
        } catch (e) {
          console.error("Erreur lors de l'abonnement STOMP:", e)
        }
      },
      onStompError: frame => {
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
      try {
        if (subscriptionsRef.current.length > 0) {
          subscriptionsRef.current.forEach(s => { try { s.unsubscribe?.() } catch (e) { /* ignore */ } })
          subscriptionsRef.current = []
        }
        stompClient?.deactivate()
      } catch (e) { /* ignore deactivation errors */ }
      stompClient = null
      setIsConnected(false)
    }
  }, [user?.id, token])

  // Fetch contacts based on role (and dedupe)
  useEffect(() => {
    const fetchChatData = async () => {
      if (!token || !user) return
      try {
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        let fetchedContacts: Contact[] = []

        switch (user.role) {
          case 'entreprise': {
            const res = await fetch(`${API_BASE_URL}/utilisateurs/contacts/entreprise/${user.id}`, { headers })
            if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`)
            fetchedContacts = await res.json()
            break
          }
          case 'etudiant': {
            const res = await fetch(`${API_BASE_URL}/utilisateurs/contacts/candidat/${user.id}`, { headers })
            if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`)
            fetchedContacts = await res.json()
            break
          }
          case 'enseignant': {
            const res = await fetch(`${API_BASE_URL}/utilisateurs/contacts/enseignant/${user.id}`, { headers })
            if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`)
            fetchedContacts = await res.json()
            break
          }
          case 'admin': {
            const res = await fetch(`${API_BASE_URL}/utilisateurs/contacts`, { headers })
            if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`)
            fetchedContacts = await res.json()
            break
          }
          default: fetchedContacts = []
        }

        // dedupe by id
        const map = new Map<number, Contact>()
        for (const c of fetchedContacts) map.set(c.id, c)
        const unique = Array.from(map.values())

        setContacts(unique)
        if (unique.length > 0) setSelectedContact(prev => prev ?? unique[0])

        // also load conversations and applications if relevant
        loadConversations()
        loadApplications()
      } catch (error: any) {
        console.error('Erreur de chargement des données de chat:', error)
        toast.error(error.message || 'Impossible de charger les contacts')
      }
    }

    fetchChatData()
  }, [token, user?.role, user?.id])

  // load messages when selectedContact changes
  useEffect(() => {
    if (!selectedContact || !user?.id) return
    loadMessages(selectedContact.id)
  }, [selectedContact, user?.id])

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSendMessage = () => {
    if (!stompClient || !stompClient.connected || !message.trim() || !selectedContact || !user?.id) return

    const payload = { expediteurId: user.id, destinataireId: selectedContact.id, contenu: message.trim() }

    try {
      // Do not push the message locally (optimistic) to prevent duplicates when server echoes it back
      stompClient.publish({ destination: '/app/chat.send', body: JSON.stringify(payload) })
    } catch (e) {
      console.error('Erreur en envoyant via STOMP', e)
      toast.error('Erreur lors de l\'envoi du message')
    }

    setMessage('')
  }

  const startConversation = (candidature: Candidature) => {
    // prefer to find contact by etudiantId
    const contact = contacts.find(c => c.id === candidature.etudiantId)
    if (contact) setSelectedContact(contact)
    else {
      // fallback create minimal contact
      const fallback: Contact = { id: candidature.etudiantId, email: candidature.etudiantUsername, role: 'etudiant' }
      setContacts(prev => [fallback, ...prev])
      setSelectedContact(fallback)
    }
  }

  const getStatutColor = (status?: string) => {
    switch (status) {
      case 'EN_LIGNE': return 'bg-green-500'
      case 'ABSENT': return 'bg-gray-400'
      case 'OCCUPE': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatutText = (status?: string) => {
    switch (status) {
      case 'EN_LIGNE': return 'En ligne'
      case 'ABSENT': return 'Absent'
      case 'OCCUPE': return 'Occupé'
      default: return 'Hors ligne'
    }
  }

  if (isUserLoading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Contacts / conversations list */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Contacts
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
           

            {/* Contacts list */}
            <div className="p-4">
              <p className="text-xs font-medium">Contacts</p>
              <div className="space-y-2 mt-2">
                {contacts.map(c => (
                  <div key={c.id} className={`flex items-center gap-3 p-2 rounded cursor-pointer ${selectedContact?.id === c.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`} onClick={() => setSelectedContact(c)}>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{(c.prenom ? c.prenom[0] : (c.email || '').slice(0,1) ).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{c.prenom ? `${c.prenom} ${c.nom || ''}` : c.email}</p>
                      <p className="text-xs text-muted-foreground">{getStatutText(c.status)}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${getStatutColor(c.status)}`} />
                  </div>
                ))}
                {contacts.length === 0 && <p className="text-xs text-muted-foreground">Aucun contact disponible</p>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zone de chat */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{selectedContact ? `Chat avec ${selectedContact.prenom || selectedContact.email}` : 'Sélectionnez un contact'}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[500px]">
          {selectedContact ? (
            <>
              <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                {isLoading ? (
                  <div className="text-center py-4">Chargement...</div>
                ) : (
                  messages.map(m => (
                    <div key={m.id ?? Math.random()} className={`flex ${m.expediteurId === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${m.expediteurId === user?.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                        <p className="text-sm">{m.contenu}</p>
                        <p className="text-xs opacity-70 mt-1">{new Date(m.dateEnvoi).toLocaleTimeString('fr-FR',{ hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex gap-2">
                <Input value={message} onChange={e => setMessage(e.target.value)} placeholder="Tapez votre message..." onKeyDown={e => e.key === 'Enter' && handleSendMessage()} disabled={!isConnected} />
                <Button onClick={handleSendMessage} disabled={!message.trim() || !isConnected}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">Sélectionnez un contact pour commencer à chatter</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}