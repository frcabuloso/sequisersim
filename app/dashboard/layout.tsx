"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Suspense } from "react"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"
import {
  Wallet,
  LayoutDashboard,
  ArrowDownToLine,
  ArrowLeftRight,
  PiggyBank,
  Target,
  Settings,
  Percent,
  Code,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Search,
  Loader2,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Command,
} from "lucide-react"

type MenuSection = "financeiro" | "perfil" | "desenvolvimento" | null

interface Notification {
  id: string
  type: "deposit" | "transfer" | "security"
  title: string
  description: string
  amount?: string
  time: string
  read: boolean
}

interface SearchResult {
  id: string
  type: "transaction" | "user" | "action"
  title: string
  description: string
  icon: React.ElementType
  href?: string
  action?: () => void
}

const menuItems = {
  inicio: {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
  },
  carteira: {
    icon: Wallet,
    label: "Carteira",
    href: "/dashboard/carteira",
  },
  financeiro: {
    icon: ArrowLeftRight,
    label: "Financeiro",
    items: [
      { icon: ArrowLeftRight, label: "Transferir", href: "/dashboard/transferencias" },
      { icon: ArrowDownToLine, label: "Depositar", href: "/dashboard/depositos" },
      { icon: PiggyBank, label: "Caixinhas", href: "/dashboard/caixinhas" },
      { icon: Target, label: "Metas", href: "/dashboard/metas" },
    ],
  },
  perfil: {
    icon: Settings,
    label: "Perfil",
    items: [
      { icon: Settings, label: "Configurações", href: "/dashboard/configuracoes" },
      { icon: Percent, label: "Taxas", href: "/dashboard/taxas" },
    ],
  },
  desenvolvimento: {
    icon: Code,
    label: "Desenvolvimento",
    items: [
      { icon: Code, label: "Credenciais", href: "/dashboard/credenciais" },
      { icon: FileText, label: "Novidades", href: "/changelog" },
    ],
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<MenuSection>(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const notificationsRef = useRef<HTMLDivElement>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated || !user) return
      try {
        const res = await apiClient.get<any>('/notificacoes')
        if (res.success && res.data) {
          setNotifications(res.data.lista || [])
        }
      } catch (error) {}
    }
    fetchNotifications()
  }, [isAuthenticated, user])
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
        setTimeout(() => searchInputRef.current?.focus(), 100)
      }
      if (e.key === "Escape") {
        setSearchOpen(false)
        setNotificationsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    const q = query.toLowerCase()
    const results: SearchResult[] = []
    try {
      const transacoesRes = await apiClient.get('/carteira/historico')
      if (transacoesRes.success && transacoesRes.data) {
        const transacoes = (transacoesRes.data as any[]).filter((t: any) => {
          const desc = (t.detalhes?.descricao || t.tipo || "").toLowerCase()
          const valor = (t.valor_liquido || t.valor || 0).toString()
          return desc.includes(q) || valor.includes(q)
        }).slice(0, 3)
        transacoes.forEach((t: any) => {
          results.push({
            id: t.id,
            type: "transaction",
            title: `${t.tipo === 'deposito' ? 'Depósito' : 'Transferência'} #${t.id.substring(0, 8)}`,
            description: `R$ ${parseFloat(t.valor_liquido || t.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            icon: t.tipo === 'deposito' ? ArrowDownRight : ArrowUpRight,
            href: "/dashboard/carteira",
          })
        })
      }
    } catch (e) {}
    const actions = [
      { id: "a1", title: "Fazer depósito", description: "Adicionar saldo", icon: ArrowDownToLine, href: "/dashboard/depositos" },
      { id: "a2", title: "Nova transferência", description: "Enviar saldo", icon: ArrowLeftRight, href: "/dashboard/transferencias" },
      { id: "a3", title: "Ver carteira", description: "Histórico", icon: Wallet, href: "/dashboard/carteira" },
    ].filter(a => a.title.toLowerCase().includes(q))
    actions.forEach(a => {
      results.push({ id: a.id, type: "action", title: a.title, description: a.description, icon: a.icon, href: a.href })
    })
    setSearchResults(results)
    setSelectedSearchIndex(0)
  }, [])

  useEffect(() => {
    performSearch(searchQuery)
  }, [searchQuery, performSearch])

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedSearchIndex(prev => Math.min(prev + 1, searchResults.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedSearchIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === "Enter" && searchResults[selectedSearchIndex]) {
      e.preventDefault()
      const result = searchResults[selectedSearchIndex]
      if (result.href) {
        router.push(result.href)
        setSearchOpen(false)
        setSearchQuery("")
      }
    }
  }

  const markAllNotificationsRead = () => setNotifications([])
  const unreadCount = notifications.filter(n => !n.read).length
  const toggleMenu = (menu: MenuSection) => setExpandedMenu(expandedMenu === menu ? null : menu)
  const isItemActive = (href: string) => pathname === href
  const isMenuActive = (items: { href: string }[]) => items.some((item) => pathname === item.href)
  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  const handleLogout = () => logout()

  const renderMenuItem = (icon: React.ElementType, label: string, href: string, external?: boolean) => {
    const Icon = icon
    const isActive = isItemActive(href)
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-400 hover:text-white"}`}>
          <Icon className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && <span className="text-sm font-medium">{label}</span>}
        </a>
      )
    }
    return (
      <Link href={href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-400 hover:text-white"}`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        {!sidebarCollapsed && <span className="text-sm font-medium">{label}</span>}
      </Link>
    )
  }

  const renderExpandableMenu = (key: MenuSection, icon: React.ElementType, label: string, items: { icon: React.ElementType; label: string; href: string; external?: boolean }[]) => {
    const Icon = icon
    const isExpanded = expandedMenu === key
    const hasActiveItem = isMenuActive(items)
    return (
      <div>
        <button type="button" onClick={() => toggleMenu(key)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${hasActiveItem ? "text-emerald-400" : "text-zinc-400 hover:text-white"}`}>
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm font-medium">{label}</span>}
          </div>
          {!sidebarCollapsed && <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />}
        </button>
        {!sidebarCollapsed && (
          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="pl-4 mt-1 space-y-1 border-l border-zinc-800 ml-5">
              {items.map((item) => (
                <div key={item.href}>
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white">
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{item.label}</span>
                    </a>
                  ) : (
                    <Link href={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white ${isItemActive(item.href) ? "text-emerald-400 bg-emerald-500/5" : ""}`}>
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated || !user) return null

  return (
    <div className="min-h-screen bg-[#09090B]">
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed top-0 left-0 z-50 h-full bg-zinc-900/95 border-r border-zinc-800 transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} ${sidebarCollapsed ? "w-20" : "w-64"}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              {!sidebarCollapsed && <span className="text-white font-semibold text-lg">fluxpay</span>}
            </Link>
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:block text-zinc-400 hover:text-white"><Menu className="w-5 h-5" /></button>
          </div>
          <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
            {renderMenuItem(menuItems.inicio.icon, menuItems.inicio.label, menuItems.inicio.href)}
            {renderMenuItem(menuItems.carteira.icon, menuItems.carteira.label, menuItems.carteira.href)}
            {renderExpandableMenu("financeiro", menuItems.financeiro.icon, menuItems.financeiro.label, menuItems.financeiro.items)}
            {renderExpandableMenu("perfil", menuItems.perfil.icon, menuItems.perfil.label, menuItems.perfil.items)}
            {renderExpandableMenu("desenvolvimento", menuItems.desenvolvimento.icon, menuItems.desenvolvimento.label, menuItems.desenvolvimento.items)}
          </nav>
          <div className="p-4 border-t border-zinc-800">
            <div className={`flex items-center gap-3 mb-4 ${sidebarCollapsed ? "justify-center" : ""}`}>
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-400 font-bold text-sm">{getInitials(user.name)}</span>
              </div>
              {!sidebarCollapsed && <div className="flex-1 min-w-0"><p className="text-white text-sm truncate">{user.name}</p></div>}
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-zinc-400 hover:text-red-400 w-full"><LogOut className="w-4 h-4" />{!sidebarCollapsed && <span className="text-sm">Sair</span>}</button>
          </div>
        </div>
      </aside>

      <div className={`transition-all duration-300 ${sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"}`}>
        <header className="sticky top-0 z-30 bg-[#09090B]/80 backdrop-blur-xl border-b border-zinc-800">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-zinc-400 hover:text-white"><Menu className="w-6 h-6" /></button>
            <div className="relative" ref={searchRef}>
              <button onClick={() => {setSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 100)}} className="hidden sm:flex items-center gap-2 px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-500"><Search className="w-4 h-4" /><span>Buscar...</span></button>
              {searchOpen && (
                <div className="fixed sm:absolute inset-x-4 sm:inset-x-auto sm:left-0 top-16 sm:top-0 sm:w-96 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
                    <input ref={searchInputRef} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearchKeyDown} placeholder="Buscar..." className="flex-1 bg-transparent text-white text-sm focus:outline-none" />
                    <button onClick={() => {setSearchOpen(false); setSearchQuery("")}}><X className="w-4 h-4 text-zinc-500" /></button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {searchResults.map((result, i) => (
                      <button key={result.id} onClick={() => {router.push(result.href!); setSearchOpen(false)}} className={`w-full flex items-center gap-3 px-3 py-2 ${i === selectedSearchIndex ? "bg-emerald-500/10 text-white" : "text-zinc-400"}`}>
                        <result.icon className="w-4 h-4" />
                        <div className="text-left"><p className="text-sm font-medium">{result.title}</p><p className="text-xs text-zinc-500">{result.description}</p></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative" ref={notificationsRef}>
                <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative p-2 text-zinc-400 hover:text-white"><Bell className="w-5 h-5" />{unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 rounded-full text-[10px] text-white flex items-center justify-center">{unreadCount}</span>}</button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50">
                    <div className="p-4 border-b border-zinc-800 flex justify-between items-center"><h3 className="text-white font-medium">Notificações</h3><button onClick={markAllNotificationsRead} className="text-emerald-400 text-xs">Limpar</button></div>
                    <div className="max-h-64 overflow-y-auto p-4 text-center text-zinc-500 text-sm">{notifications.length > 0 ? "Novas notificações" : "Nenhuma notificação"}</div>
                  </div>
                )}
              </div>
              <Link href="/dashboard/depositos" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500 text-zinc-900 text-sm font-medium rounded-lg">Depositar</Link>
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-6">
          <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}>{children}</Suspense>
        </main>
      </div>
    </div>
  )
}
