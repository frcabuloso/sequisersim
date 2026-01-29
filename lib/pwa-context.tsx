"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface PWAContextType {
  isInstallable: boolean
  isInstalled: boolean
  isOnline: boolean
  notificationsEnabled: boolean
  installApp: () => Promise<void>
  enableNotifications: () => Promise<boolean>
  disableNotifications: () => void
}

const PWAContext = createContext<PWAContextType | undefined>(undefined)

export function PWAProvider({ children }: { children: ReactNode }) {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
        setIsInstalled(true)
      }
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      (window as any).deferredInstallPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (typeof window !== 'undefined' && (window as any).deferredInstallPrompt) {
      setDeferredPrompt((window as any).deferredInstallPrompt);
      setIsInstallable(true);
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted')
    }

    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
      const handleOnline = () => setIsOnline(true)
      const handleOffline = () => setIsOnline(false)
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)

      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.removeEventListener('appinstalled', handleAppInstalled)
      }
    }
  }, [])

  const installApp = async () => {
    if (!deferredPrompt) return
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') setIsInstalled(true)
      setDeferredPrompt(null)
      setIsInstallable(false)
    } catch (error) {}
  }

  const enableNotifications = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) return false
    const permission = await Notification.requestPermission()
    const enabled = permission === 'granted'
    setNotificationsEnabled(enabled)
    if (enabled && 'serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.ready
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (vapidKey) await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: vapidKey })
      } catch (error) {}
    }
    return enabled
  }

  const disableNotifications = () => setNotificationsEnabled(false)

  return <PWAContext.Provider value={{ isInstallable, isInstalled, isOnline, notificationsEnabled, installApp, enableNotifications, disableNotifications }}>{children}</PWAContext.Provider>
}

export function usePWA() {
  const context = useContext(PWAContext)
  if (context === undefined) throw new Error('PWAProvider não encontrado')
  return context
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
