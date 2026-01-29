"use client"

import {
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  ArrowRight,
  Smartphone,
  Bitcoin,
  FileText,
  Download,
  Search,
  Loader2,
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Suspense } from "react"
import { apiClient } from "@/lib/api-client"

type WalletType = "pix" | "crypto"
type TabType = "resumo" | "extrato"

export default function CarteiraPage() {
  const [activeWallet, setActiveWallet] = useState<WalletType>("pix")
  const [activeTab, setActiveTab] = useState<TabType>("resumo")
  const [showBalance, setShowBalance] = useState(true)
  const [filterType, setFilterType] = useState<"todos" | "entrada" | "saida">("todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [saldo, setSaldo] = useState({ disponivel: 0, pendente: 0 })
  const [saldosCrypto, setSaldosCrypto] = useState<Record<string, { disponivel: number; pendente: number }>>({})
  const [transacoes, setTransacoes] = useState<any[]>([])
  const [statusSeguranca, setStatusSeguranca] = useState({ pinConfigurado: false, twoFactorEnabled: false })

  useEffect(() => {
    const buscarDados = async () => {
      setCarregando(true)
      try {
        const [saldoRes, historicoRes, segurancaRes] = await Promise.all([
          apiClient.get('/carteira/saldo').catch(() => ({ success: false })),
          apiClient.get('/carteira/historico').catch(() => ({ success: false })),
          apiClient.get('/usuario/seguranca/status').catch(() => ({ success: false }))
        ])
        if (saldoRes.success) {
          setSaldo({ disponivel: parseFloat(saldoRes.data.saldo_disponivel || 0), pendente: parseFloat(saldoRes.data.saldo_pendente || 0) })
          if (saldoRes.data.crypto) {
            const map: any = {};
            saldoRes.data.crypto.forEach((c: any) => { map[c.moeda] = { disponivel: parseFloat(c.saldo_disponivel || 0), pendente: parseFloat(c.saldo_pendente || 0) } });
            setSaldosCrypto(map);
          }
        }
        if (historicoRes.success) setTransacoes(historicoRes.data || []);
        if (segurancaRes.success) setStatusSeguranca(segurancaRes.data);
      } catch (e) {
      } finally {
        setCarregando(false)
      }
    }
    buscarDados()
  }, [])

  const moedaCryptoAtiva = "USDT"
  const currentBalance = activeWallet === "pix" ? saldo.disponivel : (saldosCrypto[moedaCryptoAtiva]?.disponivel || 0)
  const currentPendente = activeWallet === "pix" ? saldo.pendente : (saldosCrypto[moedaCryptoAtiva]?.pendente || 0)
  const currentTransactions = transacoes.filter(t => t.metodo === activeWallet)

  const formatarTransacao = (tx: any) => ({
    id: tx.id,
    type: tx.tipo === 'deposito' ? 'entrada' : 'saida',
    description: tx.detalhes?.descricao || 'Transação',
    amount: parseFloat(tx.valor_liquido || tx.valor || 0),
    date: new Date(tx.criado_em).toLocaleDateString('pt-BR'),
    status: tx.status
  })

  if (carregando) return <div className="flex justify-center items-center min-h-[400px]"><Loader2 className="animate-spin text-emerald-500 w-8 h-8" /></div>

  return (
    <Suspense fallback={null}>
      <div className="space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Carteira</h1>
        <div className="flex gap-2 p-1.5 bg-zinc-900/50 rounded-xl w-fit">
          <button onClick={() => setActiveWallet("pix")} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeWallet === "pix" ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-400"}`}>PIX</button>
          <button onClick={() => setActiveWallet("crypto")} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeWallet === "crypto" ? "bg-orange-500/20 text-orange-400" : "text-zinc-400"}`}>CRYPTO</button>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-zinc-400 text-sm">Saldo disponível</span>
            <button onClick={() => setShowBalance(!showBalance)}>{showBalance ? <Eye className="w-5 h-5 text-zinc-400" /> : <EyeOff className="w-5 h-5 text-zinc-400" />}</button>
          </div>
          <p className="text-3xl font-bold text-white">{showBalance ? (activeWallet === "pix" ? `R$ ${currentBalance.toLocaleString("pt-BR")}` : `${moedaCryptoAtiva} ${currentBalance}`) : "••••"}</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl">
          <div className="p-5 border-b border-zinc-800 font-semibold text-white">Transações recentes</div>
          <div className="divide-y divide-zinc-800">
            {currentTransactions.length > 0 ? currentTransactions.slice(0, 5).map(tx => {
              const f = formatarTransacao(tx)
              return (
                <div key={tx.id} className="p-4 flex justify-between">
                  <div><p className="text-white text-sm font-medium">{f.description}</p><p className="text-zinc-500 text-xs">{f.date}</p></div>
                  <p className={`text-sm font-bold ${f.type === 'entrada' ? 'text-emerald-400' : 'text-red-400'}`}>{f.type === 'entrada' ? '+' : '-'} {f.amount.toLocaleString("pt-BR")}</p>
                </div>
              )
            }) : <div className="p-10 text-center text-zinc-500">Nenhuma transação</div>}
          </div>
        </div>
      </div>
    </Suspense>
  )
}
