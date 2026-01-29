"use client"

import {
  PiggyBank,
  Plus,
  MoreHorizontal,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Gift,
  Car,
  Home,
  Plane,
  GraduationCap,
  X,
  Trash2,
  Edit3,
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { useState, useEffect } from "react"
import type { LucideIcon } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface Caixinha {
  id: string
  name: string
  iconIndex: number
  color: string
  current: number
  goal: number
  monthlyDeposit: number
  createdAt: string
}

const iconOptions: { icon: LucideIcon; label: string }[] = [
  { icon: PiggyBank, label: "Cofrinho" },
  { icon: Plane, label: "Viagem" },
  { icon: Car, label: "Carro" },
  { icon: Home, label: "Casa" },
  { icon: Gift, label: "Presente" },
  { icon: GraduationCap, label: "Estudo" },
]

const colorOptions = [
  { value: "emerald", label: "Verde" },
  { value: "blue", label: "Azul" },
  { value: "amber", label: "Amarelo" },
  { value: "purple", label: "Roxo" },
  { value: "rose", label: "Rosa" },
]

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string; border: string; light: string }> = {
    emerald: { bg: "bg-emerald-500", text: "text-emerald-400", border: "border-emerald-500/30", light: "bg-emerald-500/10" },
    blue: { bg: "bg-blue-500", text: "text-blue-400", border: "border-blue-500/30", light: "bg-blue-500/10" },
    amber: { bg: "bg-amber-500", text: "text-amber-400", border: "border-amber-500/30", light: "bg-amber-500/10" },
    purple: { bg: "bg-purple-500", text: "text-purple-400", border: "border-purple-500/30", light: "bg-purple-500/10" },
    rose: { bg: "bg-rose-500", text: "text-rose-400", border: "border-rose-500/30", light: "bg-rose-500/10" },
  }
  return colors[color] || colors.emerald
}

export default function CaixinhasPage() {
  const [caixinhas, setCaixinhas] = useState<Caixinha[]>([])
  const [carregando, setCarregando] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showMenuId, setShowMenuId] = useState<string | null>(null)
  const [selectedCaixinha, setSelectedCaixinha] = useState<Caixinha | null>(null)
  
  // Form states
  const [formName, setFormName] = useState("")
  const [formGoal, setFormGoal] = useState("")
  const [formMonthlyDeposit, setFormMonthlyDeposit] = useState("")
  const [selectedIcon, setSelectedIcon] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const buscarCaixinhas = async () => {
      setCarregando(true)
      try {
        const res = await apiClient.get('/caixinhas')
        if (res.success) {
          const caixinhasFormatadas = (res.data || []).map((c: any) => ({
            id: c.id,
            name: c.nome,
            iconIndex: c.icone_index || 0,
            color: c.cor || 'emerald',
            current: parseFloat(c.saldo_atual || 0),
            goal: parseFloat(c.meta || 0),
            monthlyDeposit: parseFloat(c.deposito_mensal || 0),
            createdAt: c.criado_em
          }))
          setCaixinhas(caixinhasFormatadas)
        }
      } catch (e) {
        console.error("Erro ao buscar caixinhas", e)
      } finally {
        setCarregando(false)
      }
    }
    buscarCaixinhas()
  }, [])

  const totalSaved = caixinhas.reduce((acc, c) => acc + c.current, 0)
  const totalGoals = caixinhas.reduce((acc, c) => acc + c.goal, 0)

  const handleCreateCaixinha = async () => {
    if (!formName.trim() || !formGoal) return
    
    setIsCreating(true)
    
    try {
      const res = await apiClient.post('/caixinhas', {
        nome: formName,
        icone_index: selectedIcon,
        cor: colorOptions[selectedColor].value,
        meta: Number(formGoal),
        deposito_mensal: Number(formMonthlyDeposit) || 0
      })

      if (res.success) {
        const novaCaixinha: Caixinha = {
          id: res.data.id,
          name: res.data.nome,
          iconIndex: res.data.icone_index || 0,
          color: res.data.cor || 'emerald',
          current: parseFloat(res.data.saldo_atual || 0),
          goal: parseFloat(res.data.meta || 0),
          monthlyDeposit: parseFloat(res.data.deposito_mensal || 0),
          createdAt: res.data.criado_em
        }
        setCaixinhas(prev => [...prev, novaCaixinha])
        resetForm()
        setShowModal(false)
      }
    } catch (e: any) {
      alert(e.message || "Erro ao criar caixinha")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeposit = async () => {
    if (!selectedCaixinha || !depositAmount) return
    
    const amount = Number(depositAmount)
    setIsCreating(true)
    
    try {
      const res = await apiClient.post(`/caixinhas/${selectedCaixinha.id}/depositar`, { valor: amount })
      if (res.success) {
        setCaixinhas(prev => prev.map(c => 
          c.id === selectedCaixinha.id 
            ? { ...c, current: parseFloat(res.data.saldo_atual || 0) }
            : c
        ))
        setShowDepositModal(false)
        setSelectedCaixinha(null)
        setDepositAmount("")
      }
    } catch (e: any) {
      alert(e.message || "Erro ao depositar")
    } finally {
      setIsCreating(false)
    }
  }

  const handleWithdraw = async () => {
    if (!selectedCaixinha || !withdrawAmount) return
    
    const amount = Number(withdrawAmount)
    
    if (amount > selectedCaixinha.current) return
    
    setIsCreating(true)
    
    try {
      const res = await apiClient.post(`/caixinhas/${selectedCaixinha.id}/retirar`, { valor: amount })
      if (res.success) {
        setCaixinhas(prev => prev.map(c => 
          c.id === selectedCaixinha.id 
            ? { ...c, current: parseFloat(res.data.saldo_atual || 0) }
            : c
        ))
        setShowWithdrawModal(false)
        setSelectedCaixinha(null)
        setWithdrawAmount("")
      }
    } catch (e: any) {
      alert(e.message || "Erro ao retirar")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteCaixinha = async () => {
    if (!selectedCaixinha) return
    
    setIsCreating(true)
    
    try {
      const res = await apiClient.delete(`/caixinhas/${selectedCaixinha.id}`)
      if (res.success) {
        setCaixinhas(prev => prev.filter(c => c.id !== selectedCaixinha.id))
        setShowDeleteModal(false)
        setSelectedCaixinha(null)
      }
    } catch (e: any) {
      alert(e.message || "Erro ao excluir")
    } finally {
      setIsCreating(false)
    }
  }

  const resetForm = () => {
    setFormName("")
    setFormGoal("")
    setFormMonthlyDeposit("")
    setSelectedIcon(0)
    setSelectedColor(0)
  }

  const openDepositModal = (caixinha: Caixinha) => {
    setSelectedCaixinha(caixinha)
    setDepositAmount("")
    setShowDepositModal(true)
    setShowMenuId(null)
  }

  const openWithdrawModal = (caixinha: Caixinha) => {
    setSelectedCaixinha(caixinha)
    setWithdrawAmount("")
    setShowWithdrawModal(true)
    setShowMenuId(null)
  }

  const openDeleteModal = (caixinha: Caixinha) => {
    setSelectedCaixinha(caixinha)
    setShowDeleteModal(true)
    setShowMenuId(null)
  }

  if (carregando) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Caixinhas</h1>
          <p className="text-zinc-400 text-sm mt-1">Organize seu dinheiro em objetivos</p>
        </div>
        <button
          type="button"
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-medium rounded-xl transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Nova caixinha
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-emerald-500/20 via-emerald-600/10 to-zinc-900 border border-emerald-500/20 rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400" />
            </div>
            <span className="text-zinc-400 text-sm">Total guardado</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">
            R$ {totalSaved.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-zinc-500 text-sm mt-1">
            de R$ {totalGoals.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} em metas
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <PiggyBank className="w-4 sm:w-5 h-4 sm:h-5 text-zinc-400" />
            </div>
            <span className="text-zinc-400 text-sm">Total de caixinhas</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{caixinhas.length}</p>
          <p className="text-zinc-500 text-sm mt-1">caixinhas ativas</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-5 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-zinc-400" />
            </div>
            <span className="text-zinc-400 text-sm">Progresso medio</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">
            {totalGoals > 0 ? Math.round((totalSaved / totalGoals) * 100) : 0}%
          </p>
          <p className="text-zinc-500 text-sm mt-1">das suas metas</p>
        </div>
      </div>

      {/* Caixinhas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {caixinhas.map((caixinha) => {
          const colors = getColorClasses(caixinha.color)
          const progress = (caixinha.current / caixinha.goal) * 100
          const Icon = iconOptions[caixinha.iconIndex]?.icon || PiggyBank

          return (
            <div
              key={caixinha.id}
              className={`bg-zinc-900/50 border ${colors.border} rounded-xl p-4 sm:p-5 hover:border-opacity-60 transition-colors`}
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl ${colors.light} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 sm:w-6 h-5 sm:h-6 ${colors.text}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold truncate">{caixinha.name}</h3>
                    <p className="text-zinc-500 text-sm">
                      {caixinha.monthlyDeposit > 0 
                        ? `R$ ${caixinha.monthlyDeposit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mes`
                        : "Sem deposito mensal"
                      }
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button 
                    type="button" 
                    onClick={() => setShowMenuId(showMenuId === caixinha.id ? null : caixinha.id)}
                    className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  
                  {showMenuId === caixinha.id && (
                    <div className="absolute right-0 top-8 w-36 bg-zinc-800 border border-zinc-700 rounded-xl shadow-lg z-10 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => openWithdrawModal(caixinha)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                        Retirar
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(caixinha)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-end justify-between">
                  <div>
                    <p className={`text-xl sm:text-2xl font-bold ${colors.text}`}>
                      R$ {caixinha.current.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-zinc-500 text-sm">
                      de R$ {caixinha.goal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <span className={`text-sm font-medium ${colors.text}`}>{Math.round(progress)}%</span>
                </div>

                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colors.bg} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => openDepositModal(caixinha)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 ${colors.light} ${colors.text} text-sm font-medium rounded-lg hover:opacity-80 transition-opacity`}
                  >
                    <Plus className="w-4 h-4" />
                    Depositar
                  </button>
                  <button
                    type="button"
                    onClick={() => openWithdrawModal(caixinha)}
                    className="flex items-center justify-center px-3 py-2 bg-zinc-800 text-zinc-400 hover:text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {/* Add new card */}
        <button
          type="button"
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex flex-col items-center justify-center gap-3 p-6 sm:p-8 border-2 border-dashed border-zinc-800 rounded-xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors group min-h-[240px] sm:min-h-[280px]"
        >
          <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-zinc-800 group-hover:bg-emerald-500/10 flex items-center justify-center transition-colors">
            <Plus className="w-5 sm:w-6 h-5 sm:h-6 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium group-hover:text-emerald-400 transition-colors">Criar nova caixinha</p>
            <p className="text-zinc-500 text-sm mt-1">Comece a guardar para um objetivo</p>
          </div>
        </button>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-white">Nova caixinha</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Nome da caixinha</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Viagem para Europa"
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Icone</label>
                <div className="flex gap-2 flex-wrap">
                  {iconOptions.map((option, index) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setSelectedIcon(index)}
                      className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl flex items-center justify-center transition-colors ${
                        selectedIcon === index
                          ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400"
                          : "bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <option.icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Cor</label>
                <div className="flex gap-2">
                  {colorOptions.map((option, index) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedColor(index)}
                      className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full transition-transform ${
                        getColorClasses(option.value).bg
                      } ${
                        selectedColor === index ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Meta (R$)</label>
                <input
                  type="number"
                  value={formGoal}
                  onChange={(e) => setFormGoal(e.target.value)}
                  placeholder="0,00"
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Deposito mensal (R$) - Opcional</label>
                <input
                  type="number"
                  value={formMonthlyDeposit}
                  onChange={(e) => setFormMonthlyDeposit(e.target.value)}
                  placeholder="0,00"
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-3 p-4 sm:p-5 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl border border-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateCaixinha}
                disabled={isCreating || !formName.trim() || !formGoal}
                className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                {isCreating ? "Criando..." : "Criar caixinha"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && selectedCaixinha && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-white">Depositar</h2>
              <button
                type="button"
                onClick={() => setShowDepositModal(false)}
                className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
                {(() => {
                  const Icon = iconOptions[selectedCaixinha.iconIndex]?.icon || PiggyBank
                  const colors = getColorClasses(selectedCaixinha.color)
                  return (
                    <div className={`w-10 h-10 rounded-xl ${colors.light} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                  )
                })()}
                <div>
                  <p className="text-white font-medium">{selectedCaixinha.name}</p>
                  <p className="text-zinc-500 text-sm">
                    Saldo atual: R$ {selectedCaixinha.current.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Valor do deposito (R$)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0,00"
                  autoFocus
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors text-xl font-semibold"
                />
              </div>
            </div>
            <div className="flex gap-3 p-4 sm:p-5 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowDepositModal(false)}
                className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl border border-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeposit}
                disabled={isCreating || !depositAmount || Number(depositAmount) <= 0}
                className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCreating ? <Loader2 className="animate-spin w-4 h-4" /> : "Depositar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && selectedCaixinha && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-white">Retirar</h2>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
                {(() => {
                  const Icon = iconOptions[selectedCaixinha.iconIndex]?.icon || PiggyBank
                  const colors = getColorClasses(selectedCaixinha.color)
                  return (
                    <div className={`w-10 h-10 rounded-xl ${colors.light} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                  )
                })()}
                <div>
                  <p className="text-white font-medium">{selectedCaixinha.name}</p>
                  <p className="text-zinc-500 text-sm">
                    Saldo disponivel: R$ {selectedCaixinha.current.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Valor da retirada (R$)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0,00"
                  max={selectedCaixinha.current}
                  autoFocus
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors text-xl font-semibold"
                />
                {Number(withdrawAmount) > selectedCaixinha.current && (
                  <p className="text-red-400 text-sm mt-2">Valor maior que o saldo disponivel</p>
                )}
              </div>
            </div>
            <div className="flex gap-3 p-4 sm:p-5 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl border border-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleWithdraw}
                disabled={isCreating || !withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > selectedCaixinha.current}
                className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCreating ? <Loader2 className="animate-spin w-4 h-4" /> : "Retirar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedCaixinha && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Excluir caixinha?</h3>
            </div>
            <p className="text-zinc-400 text-sm mb-2">
              A caixinha "{selectedCaixinha.name}" sera excluida permanentemente.
            </p>
            {selectedCaixinha.current > 0 && (
              <p className="text-amber-400 text-sm mb-4">
                O saldo de R$ {selectedCaixinha.current.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} sera transferido para sua carteira principal.
              </p>
            )}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteCaixinha}
                disabled={isCreating}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-400 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCreating ? <Loader2 className="animate-spin w-4 h-4" /> : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenuId && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenuId(null)}
        />
      )}
    </div>
  )
}
