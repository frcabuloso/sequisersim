"use client"

import { toast } from "sonner"
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2 } from "lucide-react"

export const notificarSucesso = (m: string) => {
  toast.success(m, { icon: <CheckCircle2 className="text-emerald-400" />, style: { background: "#18181b", borderColor: "rgba(16, 185, 129, 0.3)", color: "#fff" } })
}

export const notificarErro = (m: string) => {
  toast.error(m, { icon: <XCircle className="text-red-400" />, style: { background: "#18181b", borderColor: "rgba(239, 68, 68, 0.3)", color: "#fff" }, duration: 5000 })
}

export const notificarAviso = (m: string) => {
  toast.warning(m, { icon: <AlertTriangle className="text-amber-400" />, style: { background: "#18181b", borderColor: "rgba(245, 158, 11, 0.3)", color: "#fff" } })
}

export const notificarInfo = (m: string) => {
  toast.info(m, { icon: <Info className="text-blue-400" />, style: { background: "#18181b", borderColor: "rgba(59, 130, 246, 0.3)", color: "#fff" } })
}

export const notificarCarregando = (m: string) => {
  return toast.loading(m, { icon: <Loader2 className="text-zinc-400 animate-spin" />, style: { background: "#18181b", borderColor: "#3f3f46", color: "#fff" } })
}
