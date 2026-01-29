"use client"

import {
  User,
  Bell,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  Camera,
  Mail,
  Phone,
  Calendar,
  FileText,
  Lock,
  Loader2,
  Copy,
  ChevronRight
} from "lucide-react"
import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import { notificarErro, notificarSucesso, notificarAviso } from "@/components/notificacao"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"

const tabs = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "pin", label: "PIN", icon: Lock },
  { id: "2fa", label: "2FA", icon: Key },
  { id: "notificacoes", label: "Notificações", icon: Bell },
]

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState("perfil")
  const [showCurrentPin, setShowCurrentPin] = useState(false)
  const [showNewPin, setShowNewPin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [carregandoPerfil, setCarregandoPerfil] = useState(true)
  const [perfil, setPerfil] = useState<any>(null)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [show2FASetup, setShow2FASetup] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [qrCode2FA, setQrCode2FA] = useState("")
  const [secret2FA, setSecret2FA] = useState("")
  const [codigoEmailPIN, setCodigoEmailPIN] = useState("")
  const [solicitandoCodigoPIN, setSolicitandoCodigoPIN] = useState(false)
  const [pinStep, setPinStep] = useState(1)
  const [revealedFields, setRevealedFields] = useState<Set<string>>(new Set())
  const [showPinModal, setShowPinModal] = useState(false)
  const [fieldToReveal, setFieldToReveal] = useState<string | null>(null)
  const [tempPin, setTempPin] = useState("")
  const [verifyingPin, setVerifyingPin] = useState(false)
  const [notifications, setNotifications] = useState({ email: true, push: true, discord: false, marketing: false, transacoes: true, seguranca: true })
  const [discordWebhook, setDiscordWebhook] = useState("")
  const [savedWebhook, setSavedWebhook] = useState("")
  const [webhookTesting, setWebhookTesting] = useState(false)
  const [webhookSaving, setWebhookSaving] = useState(false)
  const [testCooldown, setTestCooldown] = useState(0)
  const [pinForm, setPinForm] = useState({ currentPin: "", newPin: "", confirmPin: "" })

  useEffect(() => {
    const buscarPerfil = async () => {
      setCarregandoPerfil(true)
      try {
        const res = await apiClient.get('/usuario/perfil')
        if (res.success) { setPerfil(res.data); setTwoFactorEnabled(res.data.twoFactorEnabled || false); }
      } catch (e) {} finally { setCarregandoPerfil(false) }
    }
    buscarPerfil()
    const verificar2FA = async () => { try { const res = await apiClient.get('/seguranca/2fa/status'); if (res.success) setTwoFactorEnabled(res.data.ativo || false); } catch (e) {} }
    verificar2FA()
  }, [])

  useEffect(() => {
    if (activeTab === "notificacoes") {
      const buscar = async () => { try { const res = await apiClient.get('/notificacoes'); if (res.success && res.data) { setNotifications({ email: res.data.email ?? true, push: res.data.push ?? true, discord: res.data.discord ?? false, marketing: res.data.marketing ?? false, transacoes: res.data.transacoes ?? true, seguranca: res.data.seguranca ?? true }); if (res.data.webhook_discord) { setDiscordWebhook(res.data.webhook_discord); setSavedWebhook(res.data.webhook_discord); } } } catch (e) {} }
      buscar()
    }
  }, [activeTab])

  const getInitials = (n: string) => n.split(" ").map(x => x[0]).join("").toUpperCase().slice(0, 2)
  const formatarData = (d: string) => { try { return new Date(d).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) } catch { return "" } }
  const handlePinChange = (f: string, v: string) => setPinForm(p => ({ ...p, [f]: v.replace(/\D/g, "").slice(0, 6) }))

  const solicitarCodigoEmailPIN = async () => {
    setSolicitandoCodigoPIN(true)
    try {
      const res = await apiClient.post('/seguranca/pin/solicitar-codigo')
      if (res.success) notificarSucesso("Código enviado")
      else notificarErro("Falha no envio")
    } catch (e) { notificarErro("Erro de solicitação") } finally { setSolicitandoCodigoPIN(false) }
  }

  const handlePinSubmit = async () => {
    if (!pinForm.currentPin || pinForm.newPin !== pinForm.confirmPin || pinForm.newPin.length !== 6 || !codigoEmailPIN) return notificarAviso("Verifique os campos")
    setIsLoading(true)
    try {
      const res = await apiClient.post('/seguranca/pin/definir', { pin: pinForm.newPin, pinAtual: pinForm.currentPin, codigoEmail: codigoEmailPIN })
      if (res.success) { setPinForm({ currentPin: "", newPin: "", confirmPin: "" }); setCodigoEmailPIN(""); setPinStep(1); notificarSucesso(" PIN atualizado"); }
      else notificarErro("Erro ao atualizar")
    } catch (e) { notificarErro("Falha na atualização") } finally { setIsLoading(false) }
  }

  const handleVerifyPinToReveal = async () => {
    if (tempPin.length !== 6) return
    setVerifyingPin(true)
    try {
      const res = await apiClient.post('/seguranca/pin/verificar', { pin: tempPin })
      if (res.success && fieldToReveal) { setRevealedFields(p => new Set(p).add(fieldToReveal)); setShowPinModal(false); setTempPin(""); notificarSucesso("Confirmado"); }
    } catch (e) { notificarErro("PIN incorreto"); setTempPin(""); } finally { setVerifyingPin(false) }
  }

  const maskValue = (v: string, f: string) => v && revealedFields.has(f) ? v : "••••••••"

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Configurações</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <nav className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-2 flex lg:block gap-1 overflow-x-auto">
          {tabs.map(t => (<button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === t.id ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-400 hover:text-white"}`}><t.icon size={18} /><span>{t.label}</span></button>))}
        </nav>

        <div className="flex-1">
          {activeTab === "perfil" && (
            <div className="space-y-6">
              {carregandoPerfil ? <Loader2 className="animate-spin text-emerald-500 mx-auto" /> : perfil ? (
                <>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400 font-bold text-xl">{getInitials(perfil.nome)}</div>
                    <div><p className="text-white font-medium">{perfil.nome}</p><p className="text-zinc-500 text-sm">Desde {formatarData(perfil.criado_em)}</p></div>
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {["nome", "cpf", "email", "telefone", "nascimento"].map(f => (
                      <div key={f}>
                        <label className="text-zinc-400 text-sm block mb-2 capitalize">{f}</label>
                        <div className="relative"><input disabled value={maskValue(perfil[f === 'nascimento' ? 'data_nascimento' : f], f)} className="w-full px-4 py-3 bg-zinc-800/30 border border-zinc-700/50 rounded-xl text-zinc-500" /><button onClick={() => { setFieldToReveal(f); setShowPinModal(true); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"><Eye size={18} /></button></div>
                      </div>
                    ))}
                  </div>
                </>
              ) : <p className="text-zinc-500 text-center">Falha ao carregar</p>}
            </div>
          )}

          {activeTab === "pin" && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 max-w-md mx-auto space-y-6">
              <h2 className="text-xl font-bold text-white">PIN de Segurança</h2>
              {pinStep === 1 ? (
                <div className="space-y-6">
                  <button onClick={solicitarCodigoEmailPIN} disabled={solicitandoCodigoPIN} className="w-full py-3 bg-zinc-800 text-white rounded-xl">Solicitar código</button>
                  <div className="flex justify-center"><InputOTP value={codigoEmailPIN} onChange={setCodigoEmailPIN} maxLength={6}><InputOTPGroup><InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} /></InputOTPGroup><InputOTPSeparator /><InputOTPGroup><InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} /></InputOTPGroup></InputOTP></div>
                  <button onClick={() => codigoEmailPIN.length === 6 && setPinStep(2)} className="w-full py-3 bg-emerald-500 text-zinc-900 font-bold rounded-xl">Prosseguir</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {["currentPin", "newPin", "confirmPin"].map(f => (<div key={f}><label className="text-zinc-400 text-sm block mb-2 capitalize">{f}</label><input type="password" value={pinForm[f as keyof typeof pinForm]} onChange={e => handlePinChange(f, e.target.value)} maxLength={6} className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-center text-white font-mono text-xl" /></div>))}
                  <div className="flex gap-3"><button onClick={() => setPinStep(1)} className="flex-1 py-3 bg-zinc-800 text-white rounded-xl">Voltar</button><button onClick={handlePinSubmit} disabled={isLoading} className="flex-[2] py-3 bg-emerald-500 text-zinc-900 font-bold rounded-xl">Confirmar</button></div>
                </div>
              )}
            </div>
          )}

          {activeTab === "2fa" && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6"><div><h2 className="text-lg font-bold text-white">2FA</h2><p className="text-zinc-500 text-sm">Google Authenticator</p></div>{twoFactorEnabled && <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">Ativo</span>}</div>
              {twoFactorEnabled ? <button onClick={async () => { if (confirm("Desativar?")) { await apiClient.post('/seguranca/2fa/desativar'); setTwoFactorEnabled(false); notificarSucesso("Desativado"); } }} className="px-4 py-2 text-red-400 border border-red-500/30 rounded-xl">Desativar 2FA</button> : !show2FASetup ? <button onClick={async () => { const res = await apiClient.get('/seguranca/2fa/gerar'); if (res.success) { setSecret2FA(res.data.secret); setQrCode2FA(res.data.otpauth); setShow2FASetup(true); } }} className="px-6 py-2.5 bg-emerald-500 text-zinc-900 font-bold rounded-xl">Configurar</button> : <div className="space-y-6 text-center">{qrCode2FA && <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCode2FA)}`} className="mx-auto rounded-xl" />}<input value={verificationCode} onChange={e => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" className="w-48 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-center text-white font-mono text-xl" /><div className="flex gap-3"><button onClick={() => setShow2FASetup(false)} className="flex-1 py-2 bg-zinc-800 text-white rounded-lg">Cancelar</button><button onClick={async () => { const res = await apiClient.post('/seguranca/2fa/ativar', { codigo: verificationCode }); if (res.success) { setTwoFactorEnabled(true); setShow2FASetup(false); notificarSucesso("Ativo"); } }} className="flex-1 py-2 bg-emerald-500 text-zinc-900 font-bold rounded-lg">Ativar</button></div></div>}
            </div>
          )}

          {activeTab === "notificacoes" && (
            <div className="space-y-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">Canais</h3>
                {["email", "push"].map(k => (<div key={k} className="flex justify-between items-center py-3 border-b border-zinc-800 last:border-0"><span className="text-zinc-300 capitalize">{k}</span><button onClick={async () => { const nVal = !notifications[k as keyof typeof notifications]; setNotifications({ ...notifications, [k]: nVal }); try { await apiClient.put('/notificacoes', { ...notifications, [k]: nVal }); } catch { setNotifications({ ...notifications, [k]: !nVal }); } }} className={`w-12 h-6 rounded-full relative transition-colors ${notifications[k as keyof typeof notifications] ? "bg-emerald-500" : "bg-zinc-700"}`}><span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications[k as keyof typeof notifications] ? "left-7" : "left-1"}`} /></button></div>))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showPinModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-sm w-full text-center space-y-6">
            <h3 className="text-white font-bold text-xl">Confirmar PIN</h3>
            <InputOTP value={tempPin} onChange={setTempPin} maxLength={6}><InputOTPGroup><InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} /></InputOTPGroup><InputOTPSeparator /><InputOTPGroup><InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} /></InputOTPGroup></InputOTP>
            <div className="flex gap-3"><button onClick={() => { setShowPinModal(false); setTempPin(""); }} className="flex-1 py-3 bg-zinc-800 text-white rounded-xl">Cancelar</button><button onClick={handleVerifyPinToReveal} disabled={tempPin.length !== 6 || verifyingPin} className="flex-1 py-3 bg-emerald-500 text-zinc-900 font-bold rounded-xl">{verifyingPin ? "..." : "Confirmar"}</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
