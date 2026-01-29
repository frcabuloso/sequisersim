"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Sparkles, ChevronRight, Calendar, Tag, Loader2, AlertCircle } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import useSWR from "swr"

interface ChangelogEntry {
  id: string
  versao: string
  data: string
  titulo: string
  descricao: string
  mudancas: string[]
}

const fetcher = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1'
    const res = await fetch(`${apiUrl}/config/changelogs`, { cache: 'no-store' })
    if (!res.ok) return []
    const contentType = res.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) return []
    return await res.json()
  } catch (error) {
    return []
  }
}

function ChangelogCard({ entry, index, currentVersion }: { entry: ChangelogEntry; index: number; currentVersion: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isLatest = entry.versao === currentVersion

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className="relative">
      <div className="absolute left-[19px] top-12 bottom-0 w-px bg-zinc-800 hidden lg:block" />
      <div className="flex gap-4 lg:gap-6">
        <div className={`hidden lg:flex flex-shrink-0 w-10 h-10 rounded-full ${isLatest ? "bg-emerald-500/30 border-emerald-500/50" : "bg-emerald-500/20 border-emerald-500/30"} border items-center justify-center`}><div className={`w-3 h-3 rounded-full ${isLatest ? "bg-emerald-400" : "bg-emerald-500"}`} /></div>
        <div className="flex-1 mb-4 sm:mb-6 lg:mb-8">
          <div className={`bg-zinc-900/50 border rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 ${isExpanded ? "border-emerald-500/30" : isLatest ? "border-emerald-500/20" : "border-zinc-800 hover:border-zinc-700"}`}>
            <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="w-full p-4 sm:p-6 text-left">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className={`px-2.5 sm:px-3 py-1 rounded-full ${isLatest ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-500/10 text-emerald-400"} text-xs sm:text-sm font-medium flex items-center gap-1`}><Tag className="w-3 h-3" /> v{entry.versao}{isLatest && <span className="ml-1 text-xs">(atual)</span>}</span>
                <span className="text-zinc-500 text-xs sm:text-sm flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(entry.data).toLocaleDateString("pt-BR")}</span>
              </div>
              <h3 className="text-white font-medium text-lg sm:text-xl mb-1.5 sm:mb-2">{entry.titulo}</h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">{entry.descricao}</p>
              <div className="flex items-center gap-2 mt-3 sm:mt-4 text-emerald-400 text-xs sm:text-sm"><span>{isExpanded ? "Ver menos" : `Ver ${entry.mudancas.length} mudanças`}</span><ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} /></div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[1500px]" : "max-h-0"}`}>
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-zinc-800 pt-4 sm:pt-6">
                <ul className="space-y-3 sm:space-y-4">
                  {entry.mudancas.map((change, i) => (
                    <li key={i} className="flex gap-3 sm:gap-4"><div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center"><Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /></div><div className="min-w-0 flex-1 flex items-center"><p className="text-zinc-400 text-sm sm:text-base break-words">{change}</p></div></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ChangelogPage() {
  const { data: changelogs, error, isLoading } = useSWR<ChangelogEntry[]>("/config/changelogs", fetcher, { revalidateOnFocus: false, shouldRetryOnError: false, fallbackData: [] })
  const actualChangelogs = Array.isArray(changelogs) ? changelogs : []
  const currentVersion = actualChangelogs[0]?.versao || "1.2.0"

  return (
    <main className="min-h-screen bg-[#09090B] overflow-x-hidden">
      <Navbar />
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 sm:mb-6"><Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /><span className="text-emerald-400 text-xs sm:text-sm font-medium">Novidades</span></div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 sm:mb-6">Novidades do<br /><span className="text-emerald-400">fluxpay</span></h1>
            <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-2">Acompanhe todas as atualizações e melhorias que estamos trazendo.</p>
            {currentVersion && <p className="text-zinc-600 text-xs sm:text-sm mt-3 sm:mt-4">Versão atual: <span className="text-emerald-400 font-medium">v{currentVersion}</span></p>}
          </motion.div>
        </div>
      </section>
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20"><Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 animate-spin mb-3 sm:mb-4" /><p className="text-zinc-500 text-sm">Carregando...</p></div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20"><AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 mb-3 sm:mb-4" /><p className="text-zinc-400 text-sm mb-2">Falha no carregamento</p></div>
          ) : actualChangelogs.length > 0 ? (
            actualChangelogs.map((entry, index) => (<ChangelogCard key={entry.id} entry={entry} index={index} currentVersion={currentVersion} />))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20"><Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-600 mb-3 sm:mb-4" /><p className="text-zinc-400 text-sm">Não tem nenhuma atualização anunciada</p></div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
