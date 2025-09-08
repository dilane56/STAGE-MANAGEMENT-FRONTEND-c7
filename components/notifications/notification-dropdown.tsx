"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Check, CheckCheck, X } from "lucide-react"
import { notificationService, type Notification } from "@/lib/notification-service"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

export function NotificationDropdown() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const loadNotifications = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const data = await notificationService.getUserNotifications(user.id)
      setNotifications(data)
      loadUnreadCount()
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId)
      loadNotifications()
      loadUnreadCount()
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du marquage')
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!user) return
    try {
      await notificationService.markAllAsRead(user.id)
      loadNotifications()
      loadUnreadCount()
      toast.success('Toutes les notifications marquées comme lues')
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du marquage')
    }
  }

  const loadUnreadCount = async () => {
    if (!user) return
    try {
      const count = await notificationService.getUnreadCount(user.id)
      setUnreadCount(count)
    } catch (error) {
      console.error('Erreur lors du chargement du compteur:', error)
    }
  }

  useEffect(() => {
    if (user) {
      loadUnreadCount()
    }
  }, [user])

  useEffect(() => {
    if (user && isOpen) {
      loadNotifications()
    }
  }, [user, isOpen])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return '✅'
      case 'WARNING':
        return '⚠️'
      case 'ERROR':
        return '❌'
      default:
        return 'ℹ️'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return 'border-l-green-500'
      case 'WARNING':
        return 'border-l-yellow-500'
      case 'ERROR':
        return 'border-l-red-500'
      default:
        return 'border-l-blue-500'
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden z-50 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Notifications</CardTitle>
                <div className="flex gap-1">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                      className="h-6 px-2 text-xs"
                    >
                      <CheckCheck className="h-3 w-3 mr-1" />
                      Tout lire
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Chargement...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Aucune notification
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-l-4 ${getNotificationColor(notification.type)} ${
                        !notification.lu ? 'bg-blue-50' : 'bg-white'
                      } hover:bg-gray-50 cursor-pointer`}
                      onClick={() => !notification.lu && handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">
                              {notification.titre}
                            </p>
                            {!notification.lu && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMarkAsRead(notification.id)
                                }}
                                className="h-4 w-4 ml-1"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.dateCreation).toLocaleDateString("fr-FR", {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}