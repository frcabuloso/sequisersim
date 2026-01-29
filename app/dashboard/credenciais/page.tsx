"use client"

import {
  Key,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Code,
  Terminal,
  FileText,
  Shield,
  Plus,
  Clock,
  Activity,
  X,
  Globe,
  Loader2,
} from "lucide-react"
import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"
import Link from "next/link"

interface ApiKey { id: string; secret: string; created: string; lastUsed: string | null; requestsToday: number; status: "active" | "revoked"; }
interface Webhook { id: string; url: string; events: string[]; status: "active" | "inactive"; lastDelivery: string | null; successRate: number; }
interface ApiKeyResponse { id: string; prefixo: string; requisicoes_hoje: number; ultimo_uso: string | null; status: string; criado_em: string; }
interface ApiKeyCreateResponse { id: string; chave: string; prefixo: string; criado_em: string; }
interface WebhookResponse { id: string; url: string; eventos: string[]; status: string; ultima_entrega: string | null; taxa_sucesso: number; criado_em: string; }

const availableEvents = [
  { id: "pagamento.pendente", label: "Pagamento Pendente", description: "QR Code PIX ou Endereço Cripto gerado" },
  { id: "pagamento.concluido", label: "Pagamento Concluído", description: "Depósito PIX ou Cripto confirmado" },
  { id: "transferencia.interna", label: "Transferência Interna", description: "Envio ou recebimento de saldo entre contas" },
  { id: "seguranca.alerta", label: "Alerta de Segurança", description: "Atividade suspeita detectada" }
]

export default function CredenciaisPage() {
  const [apiKey, setApiKey] = useState<ApiKey | null>(null)
  const [showSecret, setShowSecret] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"keys" | "webhooks">("keys")
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [newKeyGenerated, setNewKeyGenerated] = useState<string | null>(null)
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [carregando, setCarregando] = useState(true)
  const [showWebhookModal, setShowWebhookModal] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState("")
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [webhookError, setWebhookError] = useState("")
  const [isCreatingWebhook, setIsCreatingWebhook] = useState(false)
  const [webhookToDelete, setWebhookToDelete] = useState<string | null>(null)
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null)
  const [carregandoKeys, setCarregandoKeys] = useState(false)
  const [carregandoWebhooks, setCarregandoWebhooks] = useState(false)

  useEffect(() => { buscarDados() }, [])

  const buscarDados = async () => {
    setCarregando(true)
    try { await Promise.all([buscarApiKeys(), buscarWebhooks()]) } catch (e) {} finally { setCarregando(false) }
  }

  const buscarApiKeys = async () => {
    setCarregandoKeys(true)
    try {
      const res = await apiClient.get<ApiKeyResponse[]>('/credenciais/keys')
      if (res.success && res.data && res.data.length > 0) {
        const k = res.data[0]
        setApiKey({ id: k.id, secret: k.prefixo + '...', created: k.criado_em, lastUsed: k.ultimo_uso, requestsToday: k.requisicoes_hoje || 0, status: k.status === 'ativo' ? 'active' : 'revoked' })
      } else setApiKey(null)
    } catch (e) { setApiKey(null) } finally { setCarregandoKeys(false) }
  }

  const buscarWebhooks = async () => {
    setCarregandoWebhooks(true)
    try {
      const res = await apiClient.get<WebhookResponse[]>('/credenciais/webhooks')
      if (res.success && res.data) {
        setWebhooks(res.data.map((wh): Webhook => ({ id: wh.id, url: wh.url, events: wh.eventos || [], status: wh.status === 'ativo' ? 'active' : 'inactive', lastDelivery: wh.ultima_entrega, successRate: wh.taxa_sucesso || 100 })))
      } else setWebhooks([])
    } catch (e) { setWebhooks([]) } finally { setCarregandoWebhooks(false) }
  }

  const handleCopy = (t: string, id: string) => { navigator.clipboard.writeText(t); setCopied(id); setTimeout(() => setCopied(null), 2000) }

  const handleGenerateKey = async () => {
    setCarregandoKeys(true)
    try {
      const res = await apiClient.post<ApiKeyCreateResponse>('/credenciais/keys', {})
      if (res.success && res.data) {
        setNewKeyGenerated(res.data.chave)
        setApiKey({ id: res.data.id, secret: res.data.prefixo + '...', created: res.data.criado_em, lastUsed: null, requestsToday: 0, status: 'active' })
      }
    } catch (e) {} finally { setCarregandoKeys(false) }
  }

  const handleRegenerateKey = async () => {
    if (!apiKey) return
    setIsRegenerating(true)
    try {
      await apiClient.delete(`/credenciais/keys/${apiKey.id}`)
      const res = await apiClient.post<ApiKeyCreateResponse>('/credenciais/keys', {})
      if (res.success && res.data) {
        setNewKeyGenerated(res.data.chave)
        setApiKey({ id: res.data.id, secret: res.data.prefixo + '...', created: res.data.criado_em, lastUsed: null, requestsToday: 0, status: 'active' })
      }
    } catch (e) {} finally { setIsRegenerating(false); setShowRegenerateConfirm(false) }
  }

  const handleDeleteKey = async () => {
    if (!apiKey) return
    setCarregandoKeys(true)
    try { await apiClient.delete(`/credenciais/keys/${apiKey.id}`); setApiKey(null); setNewKeyGenerated(null) } catch (e) {} finally { setCarregandoKeys(false); setShowDeleteConfirm(false) }
  }

  const toggleEvent = (id: string) => setSelectedEvents(p => p.includes(id) ? p.filter(e => e !== id) : [...p, id])

  const handleCreateWebhook = async () => {
    setWebhookError("")
    if (!webhookUrl.trim() || selectedEvents.length === 0) return setWebhookError("Dados incompletos")
    if (!webhookUrl.startsWith("https://")) return setWebhookError("Use HTTPS")
    setIsCreatingWebhook(true)
    try {
      const res = await apiClient.post<WebhookResponse>('/credenciais/webhooks', { url: webhookUrl, eventos: selectedEvents })
      if (res.success && res.data) {
        setWebhooks(p => [...p, { id: res.data!.id, url: res.data!.url, events: res.data!.eventos || [], status: res.data!.status === 'ativo' ? 'active' : 'inactive', lastDelivery: res.data!.ultima_entrega, successRate: res.data!.taxa_sucesso || 100 }])
        setShowWebhookModal(false); setWebhookUrl(""); setSelectedEvents([])
      }
    } catch (e) { setWebhookError("Falha ao criar") } finally { setIsCreatingWebhook(false) }
  }

  const handleDeleteWebhook = async (id: string) => {
    setCarregandoWebhooks(true)
    try { await apiClient.delete(`/credenciais/webhooks/${id}`); setWebhooks(p => p.filter(w => w.id !== id)) } catch (e) {} finally { setCarregandoWebhooks(false); setWebhookToDelete(null) }
  }

  const handleTestWebhook = async (id: string) => { setTestingWebhook(id); try { await buscarWebhooks() } catch (e) {} finally { setTestingWebhook(null) } }

  const openWebhookModal = () => { setWebhookUrl(""); setSelectedEvents([]); setWebhookError(""); setShowWebhookModal(true) }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div><h1 className="text-xl sm:text-2xl font-bold text-white">Credenciais</h1><p className="text-zinc-400 text-sm">Gerencie sua API Key e webhooks</p></div>
        <Link href="/changelog" className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl border border-zinc-700 text-sm"><FileText className="w-4 h-4" />Ver documentação</Link>
      </div>

      <div className="flex gap-2 border-b border-zinc-800 overflow-x-auto">
        <button onClick={() => setActiveTab("keys")} className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${activeTab === "keys" ? "text-emerald-400" : "text-zinc-400"}`}>{activeTab === "keys" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />}API Key</button>
        <button onClick={() => setActiveTab("webhooks")} className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${activeTab === "webhooks" ? "text-emerald-400" : "text-zinc-400"}`}>{activeTab === "webhooks" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />}Webhooks</button>
      </div>

      {activeTab === "keys" && (
        <div className="space-y-6">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex gap-3"><AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" /><p className="text-amber-400/70 text-sm">Sua API Key é exibida apenas uma vez no momento da criação.</p></div>
          {newKeyGenerated && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-medium"><CheckCircle2 className="w-5 h-5" />API Key gerada!</div>
              <div className="flex gap-2"><code className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white break-all text-xs">{newKeyGenerated}</code><button onClick={() => handleCopy(newKeyGenerated, "new")} className="p-3 bg-emerald-500 rounded-lg">{copied === "new" ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button></div>
              <button onClick={() => setNewKeyGenerated(null)} className="text-sm text-emerald-400">Entendido</button>
            </div>
          )}
          {carregandoKeys ? <div className="p-8 text-center"><Loader2 className="animate-spin text-emerald-400 mx-auto" /></div> : !apiKey ? (
            <div className="p-8 text-center bg-zinc-900/50 border border-zinc-800 rounded-xl">
              <Key className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <button onClick={handleGenerateKey} className="px-6 py-2.5 bg-emerald-500 text-zinc-900 font-bold rounded-xl">Gerar API Key</button>
            </div>
          ) : (
            <div className="bg-zinc-900/50 border border-emerald-500/30 rounded-xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Key className="text-emerald-400" /></div><div><div className="flex items-center gap-2"><h3 className="text-white font-semibold">API Key</h3><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full">Ativa</span></div><p className="text-zinc-500 text-xs">Criada em {new Date(apiKey.created).toLocaleDateString("pt-BR")}</p></div></div>
                <div className="flex gap-2"><button onClick={() => setShowRegenerateConfirm(true)} className="p-2 text-zinc-400 hover:text-white"><RefreshCw className="w-4 h-4" /></button><button onClick={() => setShowDeleteConfirm(true)} className="p-2 text-zinc-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-zinc-800/30 border border-zinc-700 rounded-xl text-center"><p className="text-zinc-500 text-xs mb-1">Requisições hoje</p><p className="text-xl font-bold text-white">{apiKey.requestsToday}</p></div>
                <div className="p-4 bg-zinc-800/30 border border-zinc-700 rounded-xl text-center"><p className="text-zinc-500 text-xs mb-1">Rate limit</p><p className="text-xl font-bold text-white">1000/min</p></div>
                <div className="p-4 bg-zinc-800/30 border border-zinc-700 rounded-xl text-center"><p className="text-zinc-500 text-xs mb-1">Status</p><p className="text-xl font-bold text-emerald-400">OK</p></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg font-mono text-zinc-400">{showSecret ? apiKey.secret.replace("...", "XXXXXXXXXX") : apiKey.secret}</div>
                <button onClick={() => setShowSecret(!showSecret)} className="p-3 bg-zinc-800 rounded-lg">{showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
            </div>
          )}
          <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-4">
            <h3 className="text-white font-semibold">Exemplo de uso</h3>
            <pre className="p-4 bg-zinc-950 rounded-lg text-zinc-300 text-xs font-mono overflow-x-auto"><code>{`const res = await fetch('https://api.fluxpay.com/v1/transacoes/deposito/pix', {
  headers: { 'x-api-key': 'SUA_CHAVE', 'Content-Type': 'application/json' },
  method: 'POST',
  body: JSON.stringify({ valor: 100.00 })
});`}</code></pre>
          </div>
        </div>
      )}

      {activeTab === "webhooks" && (
        <div className="space-y-6">
          <div className="flex justify-end"><button onClick={openWebhookModal} className="px-4 py-2 bg-emerald-500 text-zinc-900 font-bold rounded-xl text-sm">+ Novo</button></div>
          {carregandoWebhooks ? <Loader2 className="animate-spin text-emerald-400 mx-auto" /> : webhooks.length === 0 ? <div className="p-12 text-center text-zinc-500">Nenhum webhook</div> : (
            <div className="space-y-4">
              {webhooks.map(w => (
                <div key={w.id} className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3"><Code className="text-emerald-400" /><span className="text-white font-mono text-sm">{w.url}</span></div>
                    <div className="flex gap-2"><button onClick={() => handleTestWebhook(w.id)} className="text-xs text-zinc-400">{testingWebhook === w.id ? "..." : "Testar"}</button><button onClick={() => setWebhookToDelete(w.id)} className="text-zinc-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button></div>
                  </div>
                  <div className="flex flex-wrap gap-2">{w.events.map(e => <span key={e} className="px-2 py-1 bg-zinc-800 text-zinc-400 text-[10px] rounded-lg">{e}</span>)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showRegenerateConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full text-center space-y-6">
            <h3 className="text-white font-bold text-lg">Regenerar API Key?</h3>
            <div className="flex gap-3"><button onClick={() => setShowRegenerateConfirm(false)} className="flex-1 py-3 bg-zinc-800 text-white rounded-xl">Não</button><button onClick={handleRegenerateKey} className="flex-1 py-3 bg-emerald-500 text-zinc-900 font-bold rounded-xl">Sim</button></div>
          </div>
        </div>
      )}

      {showWebhookModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-5 border-b border-zinc-800 flex justify-between items-center"><h2 className="text-white font-bold">Novo webhook</h2><button onClick={() => setShowWebhookModal(false)}><X className="text-zinc-500" /></button></div>
            <div className="p-5 space-y-5 overflow-y-auto max-h-[70vh]">
              <input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white outline-none focus:border-emerald-500" />
              <div className="space-y-2">{availableEvents.map(e => <button key={e.id} onClick={() => toggleEvent(e.id)} className={`w-full p-3 rounded-xl border text-left transition-all ${selectedEvents.includes(e.id) ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-zinc-700 text-zinc-400"}`}>{e.label}</button>)}</div>
              {webhookError && <p className="text-red-400 text-center text-sm">{webhookError}</p>}
            </div>
            <div className="p-5 border-t border-zinc-800"><button onClick={handleCreateWebhook} disabled={isCreatingWebhook} className="w-full py-3 bg-emerald-500 text-zinc-900 font-bold rounded-xl disabled:opacity-50">{isCreatingWebhook ? "..." : "Criar"}</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
