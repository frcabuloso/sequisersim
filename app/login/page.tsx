"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Wallet, ArrowLeft, Loader2, User, Smartphone, CreditCard, Calendar, Lock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api-client"
import { GoogleSignIn } from "@/components/google-sign-in"

type Etapa = "login" | "completar-perfil"

export default function PaginaLogin() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  const [etapa, setEtapa] = useState<Etapa>("login")
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState("")
  const [dadosGoogle, setDadosGoogle] = useState<any>(null)
  const [formRegistro, setFormRegistro] = useState({ nome: "", cpf: "", telefone: "", nascimento: "", pin: "" })
  const [pinLogin, setPinLogin] = useState("")
  const [codigo2FA, setCodigo2FA] = useState("")
  const [requerPin, setRequerPin] = useState(false)
  const [requer2FA, setRequer2FA] = useState(false)

  useEffect(() => { if (!authLoading && isAuthenticated) router.push("/dashboard") }, [authLoading, isAuthenticated, router])

  const sucessoGoogle = async (u: any) => {
    const user = u || dadosGoogle
    if (!dadosGoogle && u) setDadosGoogle(u)
    setCarregando(true); setErro("")
    try {
      const res = await apiClient.post<any>('/auth/google', { email: user.email, googleId: user.googleId, pin: pinLogin || undefined, codigo2FA: codigo2FA || undefined }, { requireAuth: false })
      if (res.success && res.data.existe) {
        login({ id: res.data.usuario.id, email: res.data.usuario.email, name: res.data.usuario.nome, picture: res.data.usuario.foto, cpf: res.data.usuario.cpf, telefone: res.data.usuario.telefone }, res.data.accessToken)
        router.push("/dashboard")
      } else {
        setFormRegistro(p => ({ ...p, nome: user.name }))
        setEtapa("completar-perfil")
      }
    } catch (e: any) {
      if (e.status === 400 && e.response?.requerPin) { setRequerPin(true); setErro("") }
      else if (e.status === 400 && e.response?.requer2FA) { setRequer2FA(true); setErro("") }
      else setErro(e.response?.erro || "Falha na autenticação")
    } finally { setCarregando(false) }
  }

  const finalizarRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)
    try {
      if (!formRegistro.pin || formRegistro.pin.length !== 6) { setErro("PIN inválido"); setCarregando(false); return }
      const res = await apiClient.post<any>('/google/registrar', { ...formRegistro, email: dadosGoogle.email, googleId: dadosGoogle.googleId, foto: dadosGoogle.picture }, { requireAuth: false })
      if (res.success) {
        login({ id: res.data.usuario.id, email: res.data.usuario.email, name: res.data.usuario.nome, picture: res.data.usuario.foto, cpf: res.data.usuario.cpf, telefone: res.data.usuario.telefone }, res.data.accessToken)
        router.push("/dashboard")
      }
    } catch (e: any) { setErro(e.response?.erro || "Falha no registro") } finally { setCarregando(false) }
  }

  const formatarCPF = (v: string) => v.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").substring(0, 14)
  const formatarTelefone = (v: string) => v.replace(/\D/g, "").replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3").substring(0, 15)
  const formatarData = (v: string) => v.replace(/\D/g, "").replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3").substring(0, 10)

  if (authLoading) return null

  return (
    <main className="min-h-screen bg-[#09090B] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-12"><Link href="/"><div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20"><Wallet className="w-8 h-8 text-black" /></div></Link></div>
        <AnimatePresence mode="wait">
          {etapa === "login" ? (
            <motion.div key="login" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="text-center">
              <h1 className="text-3xl font-bold text-white mb-3">fluxpay</h1>
              <p className="text-zinc-500 mb-10">Sua carteira digital inteligente</p>
              <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm shadow-2xl">
                {!requerPin && !requer2FA ? <GoogleSignIn onSuccess={sucessoGoogle} onError={setErro} /> : requerPin ? (
                  <div className="space-y-4">
                    <p className="text-white text-sm mb-4">Insira seu PIN</p>
                    <input type="password" placeholder="000000" maxLength={6} className="w-full bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl text-white text-center text-xl tracking-[0.5em] font-mono outline-none focus:border-emerald-500" value={pinLogin} onChange={e => setPinLogin(e.target.value.replace(/\D/g, "").slice(0, 6))} />
                    <button onClick={() => sucessoGoogle(dadosGoogle)} disabled={pinLogin.length !== 6 || carregando} className="w-full p-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl disabled:opacity-50">{carregando ? <Loader2 className="animate-spin" /> : "Continuar"}</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-white text-sm mb-4">Código 2FA</p>
                    <input type="text" placeholder="000000" maxLength={6} className="w-full bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl text-white text-center text-xl tracking-[0.5em] font-mono outline-none focus:border-emerald-500" value={codigo2FA} onChange={e => setCodigo2FA(e.target.value.replace(/\D/g, "").slice(0, 6))} />
                    <button onClick={() => sucessoGoogle(dadosGoogle)} disabled={codigo2FA.length !== 6 || carregando} className="w-full p-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl disabled:opacity-50">{carregando ? <Loader2 className="animate-spin" /> : "Verificar"}</button>
                  </div>
                )}
                {erro && <p className="text-red-500 text-sm mt-4">{erro}</p>}
              </div>
            </motion.div>
          ) : (
            <motion.div key="registro" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
              <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl backdrop-blur-sm shadow-2xl">
                <button onClick={() => setEtapa("login")} className="text-zinc-500 hover:text-white flex items-center gap-2 mb-6"><ArrowLeft size={16} /> Voltar</button>
                <h2 className="text-2xl font-bold text-white mb-2">Completar Perfil</h2>
                <form onSubmit={finalizarRegistro} className="space-y-4">
                  <div className="space-y-2"><label className="text-xs text-zinc-500 uppercase font-bold ml-1">Nome</label><input type="text" className="w-full bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl text-white outline-none focus:border-emerald-500" value={formRegistro.nome} onChange={e => setFormRegistro({...formRegistro, nome: e.target.value})} required /></div>
                  <div className="space-y-2"><label className="text-xs text-zinc-500 uppercase font-bold ml-1">CPF</label><input type="text" placeholder="000.000.000-00" className="w-full bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl text-white outline-none focus:border-emerald-500" value={formRegistro.cpf} onChange={e => setFormRegistro({...formRegistro, cpf: formatarCPF(e.target.value)})} required /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><label className="text-xs text-zinc-500 uppercase font-bold ml-1">Telefone</label><input type="text" placeholder="(00) 00000-0000" className="w-full bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl text-white text-sm outline-none focus:border-emerald-500" value={formRegistro.telefone} onChange={e => setFormRegistro({...formRegistro, telefone: formatarTelefone(e.target.value)})} required /></div>
                    <div className="space-y-2"><label className="text-xs text-zinc-500 uppercase font-bold ml-1">Nascimento</label><input type="text" placeholder="DD/MM/AAAA" className="w-full bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl text-white text-sm outline-none focus:border-emerald-500" value={formRegistro.nascimento} onChange={e => setFormRegistro({...formRegistro, nascimento: formatarData(e.target.value)})} required /></div>
                  </div>
                  <div className="space-y-2"><label className="text-xs text-zinc-500 uppercase font-bold ml-1">PIN (6 dígitos)</label><input type="password" placeholder="000000" maxLength={6} className="w-full bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl text-white text-center text-xl tracking-[0.5em] font-mono outline-none focus:border-emerald-500" value={formRegistro.pin} onChange={e => setFormRegistro({...formRegistro, pin: e.target.value.replace(/\D/g, "").slice(0, 6)})} required /></div>
                  {erro && <p className="text-red-500 text-sm">{erro}</p>}
                  <button disabled={carregando} className="w-full p-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all mt-4 flex items-center justify-center gap-2">{carregando ? <Loader2 className="animate-spin" /> : "Finalizar"}</button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
