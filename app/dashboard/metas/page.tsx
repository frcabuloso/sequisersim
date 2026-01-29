"use client"

import {
  Target,
  Plus,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  ArrowRight,
  Sparkles,
  X,
  Trash2,
  Edit3,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api-client"

interface Meta {
  id: string
  title: string
  description: string
  current: number
  goal: number
  deadline: string
  status: "em_progresso" | "concluido"
  category: string
  isPercentage?: boolean
  isMeses?: boolean
}

export default function MetasPage() {
  const [metas, setMetas] = useState<Meta[]>([])
  const [carregando, setCarregando] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showMenuId, setShowMenuId] = useState<string | null>(null)
  const [selectedMeta, setSelectedMeta] = useState<Meta | null>(null)
  const [filter, setFilter] = useState<"todas" | "em_progresso" | "concluido">("todas")
  
  // Form states
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formGoal, setFormGoal] = useState("")
  const [formDeadline, setFormDeadline] = useState("")
  const [formType, setFormType] = useState<"valor" | "porcentagem" | "meses">("valor")
  const [updateValue, setUpdateValue] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const buscarMetas = async () => {
      setCarregando(true)
      try {
        const res = await apiClient.get('/metas')
        if (res.success) {
          const metasFormatadas = (res.data || []).map((m: any) => ({
            id: m.id,
            title: m.titulo,
            description: m.descricao || '',
            current: parseFloat(m.valor_atual || 0),
            goal: parseFloat(m.valor_meta || 0),
            deadline: m.prazo,
            status: m.status || 'em_progresso',
            category: m.categoria || 'geral',
            isPercentage: m.tipo === 'porcentagem',
            isMeses: m.tipo === 'meses'
          }))
          setMetas(metasFormatadas)
        }
      } catch (e) {
        console.error("Erro ao buscar metas", e)
      } finally {
        setCarregando(false)
      }
    }
    buscarMetas()
  }, [])

  const filteredMetas = metas.filter((meta) => {
    if (filter === "todas") return true
    return meta.status === filter
  })

  const metasConcluidas = metas.filter((m) => m.status === "concluido").length
  const metasEmProgresso = metas.filter((m) => m.status === "em_progresso").length

  const formatValue = (meta: Meta) => {
    if (meta.isPercentage) return `${meta.current}%`
    if (meta.isMeses) return `${meta.current} meses`
    return `R$ ${meta.current.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
  }

  const formatGoal = (meta: Meta) => {
    if (meta.isPercentage) return `${meta.goal}%`
    if (meta.isMeses) return `${meta.goal} meses`
    return `R$ ${meta.goal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
  }

  const handleCreateMeta = async () => {
    if (!formTitle.trim() || !formGoal || !formDeadline) return
    
    setIsCreating(true)
    
    try {
      const res = await apiClient.post('/metas', {
        titulo: formTitle,
        descricao: formDescription,
        valor_meta: Number(formGoal),
        prazo: formDeadline,
        tipo: formType,
        categoria: 'geral'
      })

      if (res.success) {
        const novaMeta: Meta = {
          id: res.data.id,
          title: res.data.titulo,
          description: res.data.descricao || '',
          current: parseFloat(res.data.valor_atual || 0),
          goal: parseFloat(res.data.valor_meta || 0),
          deadline: res.data.prazo,
          status: res.data.status || 'em_progresso',
          category: res.data.categoria || 'geral',
          isPercentage: res.data.tipo === 'porcentagem',
          isMeses: res.data.tipo === 'meses'
        }
        setMetas(prev => [...prev, novaMeta])
        resetForm()
        setShowModal(false)
      }
    } catch (e: any) {
      alert(e.message || "Erro ao criar meta")
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateProgress = async () => {
    if (!selectedMeta || !updateValue) return
    
    const newValue = Number(updateValue)
    setIsCreating(true)
    
    try {
      const res = await apiClient.put(`/metas/${selectedMeta.id}`, { valor_atual: newValue })
      if (res.success) {
        setMetas(prev => prev.map(m => {
          if (m.id === selectedMeta.id) {
            return {
              ...m,
              current: parseFloat(res.data.valor_atual || 0),
              status: res.data.status || m.status
            }
          }
          return m
        }))
        setShowUpdateModal(false)
        setSelectedMeta(null)
        setUpdateValue("")
      }
    } catch (e: any) {
      alert(e.message || "Erro ao atualizar meta")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteMeta = async () => {
    if (!selectedMeta) return
    
    setIsCreating(true)
    
    try {
      const res = await apiClient.delete(`/metas/${selectedMeta.id}`)
      if (res.success) {
        setMetas(prev => prev.filter(m => m.id !== selectedMeta.id))
        setShowDeleteModal(false)
        setSelectedMeta(null)
      }
    } catch (e: any) {
      alert(e.message || "Erro ao excluir meta")
    } finally {
      setIsCreating(false)
    }
  }

  const handleMarkComplete = async (meta: Meta) => {
    try {
      const res = await apiClient.put(`/metas/${meta.id}`, { valor_atual: meta.goal })
      if (res.success) {
        setMetas(prev => prev.map(m => 
          m.id === meta.id ? { ...m, current: meta.goal, status: "concluido" } : m
        ))
        setShowMenuId(null)
      }
    } catch (e: any) {
      alert(e.message || "Erro ao marcar como concluída")
    }
  }

  const resetForm = () => {
    setFormTitle("")
    setFormDescription("")
    setFormGoal("")
    setFormDeadline("")
    setFormType("valor")
  }

  const openUpdateModal = (meta: Meta) => {
    setSelectedMeta(meta)
    setUpdateValue(meta.current.toString())
    setShowUpdateModal(true)
    setShowMenuId(null)
  }

  const openDeleteModal = (meta: Meta) => {
    setSelectedMeta(meta)
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
          <h1 className="text-xl sm:text-2xl font-bold text-white">Metas</h1>
          <p className="text-zinc-400 text-sm mt-1">Acompanhe seus objetivos financeiros</p>
        </div>
        <button
          type="button"
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-medium rounded-xl transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Nova meta
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
              <Target className="w-4 sm:w-5 h-4 sm:h-5 text-zinc-400" />
            </div>
            <span className="text-zinc-400 text-sm">Total de metas</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{metas.length}</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-amber-400" />
            </div>
            <span className="text-zinc-400 text-sm">Em progresso</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-amber-400">{metasEmProgresso}</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-2 sm:mb-3">
            <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-400" />
            </div>
            <span className="text-zinc-400 text-sm">Concluidas</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400">{metasConcluidas}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(["todas", "em_progresso", "concluido"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              filter === f
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : "bg-zinc-800/50 text-zinc-400 border border-zinc-700 hover:text-white"
            }`}
          >
            {f === "todas" ? "Todas" : f === "em_progresso" ? "Em progresso" : "Concluidas"}
          </button>
        ))}
      </div>

      {/* Metas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredMetas.map((meta) => {
          const progress = (meta.current / meta.goal) * 100
          const isComplete = meta.status === "concluido"

          return (
            <div
              key={meta.id}
              className={`bg-zinc-900/50 border rounded-xl p-4 sm:p-5 transition-colors ${
                isComplete ? "border-emerald-500/30" : "border-zinc-800"
              }`}
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isComplete ? "bg-emerald-500/10" : "bg-zinc-800"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-400" />
                    ) : (
                      <Target className="w-5 sm:w-6 h-5 sm:h-6 text-zinc-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold truncate">{meta.title}</h3>
                    <p className="text-zinc-500 text-sm truncate">{meta.description}</p>
                  </div>
                </div>
                <div className="relative">
                  <button 
                    type="button" 
                    onClick={() => setShowMenuId(showMenuId === meta.id ? null : meta.id)}
                    className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  
                  {showMenuId === meta.id && (
                    <div className="absolute right-0 top-8 w-40 bg-zinc-800 border border-zinc-700 rounded-xl shadow-lg z-10 overflow-hidden">
                      {!isComplete && (
                        <>
                          <button
                            type="button"
                            onClick={() => openUpdateModal(meta)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                            Atualizar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMarkComplete(meta)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-emerald-400 hover:bg-zinc-700 transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Marcar concluida
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => openDeleteModal(meta)}
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
                    <p className={`text-lg sm:text-xl font-bold ${isComplete ? "text-emerald-400" : "text-white"}`}>
                      {formatValue(meta)}
                    </p>
                    <p className="text-zinc-500 text-sm">de {formatGoal(meta)}</p>
                  </div>
                  <span className={`text-sm font-medium ${isComplete ? "text-emerald-400" : "text-zinc-400"}`}>
                    {Math.round(progress)}%
                  </span>
                </div>

                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isComplete ? "bg-emerald-500" : "bg-emerald-500/50"
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-zinc-500 text-xs sm:text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {isComplete ? "Concluida" : "Prazo:"}{" "}
                      {new Date(meta.deadline).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  {!isComplete && (
                    <button
                      type="button"
                      onClick={() => openUpdateModal(meta)}
                      className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                    >
                      Atualizar <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* Add new card */}
        <button
          type="button"
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex flex-col items-center justify-center gap-3 p-6 sm:p-8 border-2 border-dashed border-zinc-800 rounded-xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors group min-h-[180px] sm:min-h-[200px]"
        >
          <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl bg-zinc-800 group-hover:bg-emerald-500/10 flex items-center justify-center transition-colors">
            <Plus className="w-5 sm:w-6 h-5 sm:h-6 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium group-hover:text-emerald-400 transition-colors">Criar nova meta</p>
            <p className="text-zinc-500 text-sm mt-1">Defina um novo objetivo</p>
          </div>
        </button>
      </div>

      {/* Tip */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-600/5 to-transparent border border-emerald-500/20 rounded-xl p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Dica do fluxpay</h3>
            <p className="text-zinc-400 text-sm">
              Metas SMART (Especificas, Mensuraveis, Atingiveis, Relevantes e Temporais) tem 76% mais chances de serem alcancadas.
            </p>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-white">Nova meta</h2>
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
                <label className="block text-sm font-medium text-zinc-300 mb-2">Titulo da meta</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ex: Economizar R$ 10.000"
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Descricao</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Descreva sua meta..."
                  rows={2}
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Tipo da meta</label>
                <div className="flex gap-2">
                  {(["valor", "porcentagem", "meses"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormType(t)}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        formType === t
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-white"
                      }`}
                    >
                      {t === "valor" ? "R$" : t === "porcentagem" ? "%" : "Meses"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    {formType === "valor" ? "Valor (R$)" : formType === "porcentagem" ? "Porcentagem" : "Meses"}
                  </label>
                  <input
                    type="number"
                    value={formGoal}
                    onChange={(e) => setFormGoal(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Prazo</label>
                  <input
                    type="date"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
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
                onClick={handleCreateMeta}
                disabled={isCreating || !formTitle.trim() || !formGoal || !formDeadline}
                className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                {isCreating ? "Criando..." : "Criar meta"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && selectedMeta && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800">
              <h2 className="text-lg font-semibold text-white">Atualizar progresso</h2>
              <button
                type="button"
                onClick={() => setShowUpdateModal(false)}
                className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-5 space-y-4">
              <div>
                <p className="text-zinc-400 text-sm mb-1">{selectedMeta.title}</p>
                <p className="text-zinc-500 text-xs">Meta: {formatGoal(selectedMeta)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Progresso atual {selectedMeta.isPercentage ? "(%)" : selectedMeta.isMeses ? "(meses)" : "(R$)"}
                </label>
                <input
                  type="number"
                  value={updateValue}
                  onChange={(e) => setUpdateValue(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-3 p-4 sm:p-5 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowUpdateModal(false)}
                className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl border border-zinc-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleUpdateProgress}
                disabled={isCreating || !updateValue}
                className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCreating ? <Loader2 className="animate-spin w-4 h-4" /> : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedMeta && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Excluir meta?</h3>
            </div>
            <p className="text-zinc-400 text-sm mb-6">
              A meta "{selectedMeta.title}" sera excluida permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteMeta}
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
