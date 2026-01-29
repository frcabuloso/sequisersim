"use client"

import Link from "next/link"
import { Wallet, Menu, X, ChevronDown, Settings, LogOut, LayoutDashboard } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <nav className="fixed top-3 md:top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] md:w-[calc(100%-2rem)] max-w-5xl">
      <div className="flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 bg-zinc-900/70 backdrop-blur-xl border border-zinc-800/80 rounded-xl md:rounded-2xl shadow-2xl shadow-black/20">
        <Link href="/" className="flex items-center gap-1.5 md:gap-2">
          <span className="text-white font-semibold text-base md:text-lg">FluxPay</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link href="/#recursos" className="text-sm text-zinc-400 hover:text-white transition-colors">Recursos</Link>
          <Link href="/como-funciona" className="text-sm text-zinc-400 hover:text-white transition-colors">Como funciona</Link>
          <Link href="/changelog" className="text-sm text-zinc-400 hover:text-white transition-colors">Novidades</Link>
          <Link href="/termos" className="text-sm text-zinc-400 hover:text-white transition-colors">Termos</Link>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {isLoading ? (
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-zinc-800 animate-pulse" />
          ) : isAuthenticated && user ? (
            <div className="relative" ref={userMenuRef}>
              <button type="button" onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-1.5 md:gap-2 px-1.5 md:px-2 py-1 md:py-1.5 rounded-lg md:rounded-xl hover:bg-zinc-800/50 transition-colors">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border-2 border-emerald-500/50">
                  <span className="text-emerald-400 font-semibold text-[10px] md:text-xs">{getInitials(user.name)}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 md:w-64 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
                  <div className="p-3 md:p-4 border-b border-zinc-800">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-500/20 flex items-center justify-center"><span className="text-emerald-400 font-bold text-xs md:text-sm">{getInitials(user.name)}</span></div>
                      <div className="flex-1 min-w-0"><p className="text-white text-xs md:text-sm truncate font-medium">{user.name}</p></div>
                    </div>
                  </div>
                  <div className="p-1.5 md:p-2">
                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 md:gap-3 px-2.5 md:px-3 py-2 text-zinc-300 hover:bg-zinc-800/50 rounded-lg"><LayoutDashboard className="w-4 h-4" /><span className="text-xs md:text-sm">Dashboard</span></Link>
                    <Link href="/dashboard/configuracoes" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 md:gap-3 px-2.5 md:px-3 py-2 text-zinc-300 hover:bg-zinc-800/50 rounded-lg"><Settings className="w-4 h-4" /><span className="text-xs md:text-sm">Configurações</span></Link>
                  </div>
                  <div className="p-1.5 md:p-2 border-t border-zinc-800">
                    <button type="button" onClick={() => {setUserMenuOpen(false); logout();}} className="flex items-center gap-2 md:gap-3 w-full px-2.5 md:px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><LogOut className="w-4 h-4" /><span className="text-xs md:text-sm">Sair</span></button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-xs md:text-sm text-zinc-400 hover:text-white hidden sm:block">Entrar</Link>
              <Link href="/login?registrar=true" className="text-xs md:text-sm font-medium text-zinc-900 bg-emerald-500 hover:bg-emerald-400 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl">Criar conta</Link>
            </>
          )}
          <button type="button" className="md:hidden text-zinc-400 p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden mt-2 px-3 md:px-4 py-3 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800/80 rounded-xl">
          <div className="flex flex-col gap-3">
            <Link href="/#recursos" className="text-sm text-zinc-400" onClick={() => setMobileMenuOpen(false)}>Recursos</Link>
            <Link href="/como-funciona" className="text-sm text-zinc-400" onClick={() => setMobileMenuOpen(false)}>Como funciona</Link>
            <Link href="/changelog" className="text-sm text-zinc-400" onClick={() => setMobileMenuOpen(false)}>Novidades</Link>
            <Link href="/termos" className="text-sm text-zinc-400" onClick={() => setMobileMenuOpen(false)}>Termos</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
