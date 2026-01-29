"use client"

import { useEffect, useCallback, useState } from "react"
import { Loader2 } from "lucide-react"

declare global {
  interface Window {
    google?: {
      accounts: { id: { initialize: (c: any) => void; renderButton: (e: HTMLElement, o: any) => void; prompt: () => void; } }
    }
  }
}

export function GoogleSignIn({ onSuccess, onError }: { onSuccess: (d: any) => void; onError?: (e: string) => void }) {
  const [loading, setLoading] = useState(true)
  const handleRes = useCallback(async (res: any) => {
    try {
      const p = JSON.parse(atob(res.credential.split(".")[1].replace(/-/g, '+').replace(/_/g, '/')))
      onSuccess({ googleId: p.sub, email: p.email, name: p.name, picture: p.picture })
    } catch (e) { onError?.("Falha no processamento") }
  }, [onSuccess, onError])

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'
        const res = await fetch(`${base}/config/google-id`, { cache: 'no-store' })
        if (!res.ok) throw new Error()
        const data = await res.json()
        if (!active || !data.clientId) return
        const script = document.createElement("script")
        script.id = "google-gsi-client"; script.src = "https://accounts.google.com/gsi/client"; script.async = true; script.defer = true
        script.onload = () => {
          if (!active || !window.google) return
          window.google.accounts.id.initialize({ client_id: data.clientId, callback: handleRes, auto_select: false })
          const el = document.getElementById("google-btn")
          if (el) { window.google.accounts.id.renderButton(el, { theme: "outline", size: "large", width: 320, text: "continue_with", shape: "pill" }); setLoading(false) }
        }
        document.body.appendChild(script)
      } catch (e) { if (active) onError?.("Erro de conexão") }
    }
    load()
    return () => { active = false }
  }, [handleRes, onError])

  return (
    <div className="w-full flex flex-col items-center">
      <div id="google-btn" className="w-full min-h-[50px] flex justify-center" />
      {loading && <div className="flex items-center gap-2 text-zinc-500 text-sm mt-2"><Loader2 className="animate-spin" size={16} />Conectando...</div>}
    </div>
  )
}
