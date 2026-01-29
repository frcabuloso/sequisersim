"use client"

import { useState, useRef, useEffect } from "react"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodigoVerificacaoProps {
  email: string
  onComplete: (codigo: string) => void
  onResend?: () => Promise<void>
  isLoading?: boolean
  error?: string
  className?: string
}

export function CodigoVerificacao({
  email,
  onComplete,
  onResend,
  isLoading = false,
  error,
  className
}: CodigoVerificacaoProps) {
  const [codigo, setCodigo] = useState("")
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleChange = (value: string) => {
    setCodigo(value)
    if (value.length === 6) {
      onComplete(value)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0 || resending || !onResend) return
    
    setResending(true)
    try {
      await onResend()
      setCooldown(60)
      setCodigo("")
    } catch (error) {
      console.error("Erro ao reenviar código:", error)
    } finally {
      setResending(false)
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Verifique seu login</h2>
        <p className="text-zinc-400 text-sm">
          Digite o código de verificação enviado para: <span className="text-white font-medium">{email}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-300">Código de verificação</label>
          {onResend && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              className="text-zinc-400 hover:text-white h-auto p-0"
            >
              {resending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {cooldown > 0 ? `Reenviar em ${cooldown}s` : "Reenviar código"}
            </Button>
          )}
        </div>

        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={codigo}
            onChange={handleChange}
            disabled={isLoading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <p className="text-xs text-zinc-500 text-center">
          Não recebeu o código? Verifique sua caixa de spam ou{" "}
          {onResend && (
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0}
              className="text-emerald-400 hover:text-emerald-300 underline disabled:opacity-50"
            >
              reenvie
            </button>
          )}
        </p>
      </div>
    </div>
  )
}
