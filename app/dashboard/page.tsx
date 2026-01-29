"use client"

import { 
  ArrowDownToLine, 
  ArrowLeftRight, 
  Wallet,
  Clock,
  ChevronRight,
  Plus,
  Shield,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"

export default function PaginaDashboard() {
  const { user } = useAuth()
  const [carregando, setCarregando] = useState(true)
  const [dados, setDados] = useState<any>(null)

  useEffect(() => {
    const buscar = async () => {
      try {
        const res = await apiClient.get('/dashboard')
        if (res.success) setDados(res.data)
      } catch (e) {} finally { setCarregando(false) }
    }
    buscar()
  }, [])

  if (carregando) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-emerald-500" /></div>
  if (!dados) return <div className="text-white p-12 text-center">Falha no carregamento.</div>

  const stats = [
    { title: "Disponível", value: `R$ ${dados.saldo.toLocaleString('pt-BR')}`, icon: Wallet, color: "emerald" },
    { title: "Pendente", value: `R$ ${dados.emProcessamento.toLocaleString('pt-BR')}`, icon: Clock, color: "amber" },
    { title: "Entradas", value: `R$ ${dados.totalEntradas.toLocaleString('pt-BR')}`, icon: ArrowDownToLine, color: "blue" },
    { title: "Saídas", value: `R$ ${dados.totalSaidas.toLocaleString('pt-BR')}`, icon: ArrowLeftRight, color: "zinc" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-white">Dashboard</h1><p className="text-zinc-500">Olá, {user?.name}</p></div>
        <Link href="/dashboard/depositos" className="bg-emerald-500 px-4 py-2 rounded-lg font-bold text-zinc-900 flex items-center gap-2"><Plus size={18} /> Depositar</Link>
      </div>

      {!dados.twoFactorEnabled && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center gap-4">
          <Shield className="text-amber-500" /><div className="flex-1"><p className="text-white font-bold">Segurança</p><p className="text-zinc-400 text-sm">Ative o 2FA.</p></div>
          <Link href="/dashboard/configuracoes" className="text-amber-500 font-bold">Ativar</Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${s.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : s.color === 'amber' ? 'bg-amber-500/10 text-amber-500' : s.color === 'blue' ? 'bg-blue-500/10 text-blue-500' : 'bg-zinc-800 text-zinc-400'}`}><s.icon size={20} /></div>
            <p className="text-zinc-500 text-sm">{s.title}</p><p className="text-white text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center"><h2 className="text-white font-bold">Recentes</h2><Link href="/dashboard/carteira" className="text-emerald-500 text-sm">Ver todas</Link></div>
        <div className="divide-y divide-zinc-800">
          {dados.recentTransactions?.length > 0 ? dados.recentTransactions.map((t: any) => (
            <div key={t.id} className="p-4 flex justify-between items-center hover:bg-zinc-800/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">{t.type === 'deposito' ? <Plus className="text-emerald-500" /> : <ArrowLeftRight className="text-zinc-400" />}</div>
                <div><p className="text-white text-sm font-medium">{t.description}</p><p className="text-zinc-500 text-xs">{t.date}</p></div>
              </div>
              <div className="text-right"><p className={`font-bold ${t.amount.startsWith('+') ? 'text-emerald-400' : 'text-white'}`}>{t.amount}</p></div>
            </div>
          )) : <div className="p-8 text-center text-zinc-500">Vazio</div>}
        </div>
      </div>
    </div>
  )
}
