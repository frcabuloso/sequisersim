"use client"

import { Wallet, WifiOff, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload()
  }

  return (
    <main className="min-h-screen bg-[#09090B] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-zinc-800/50 border border-zinc-700 flex items-center justify-center mx-auto mb-8">
          <WifiOff className="w-10 h-10 text-zinc-500" />
        </div>
        
        <h1 className="text-2xl font-semibold text-white mb-4">
          Voce esta offline
        </h1>
        
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Parece que voce perdeu a conexao com a internet. Verifique sua conexao e tente novamente.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-medium rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </button>
          
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl border border-zinc-700 transition-colors"
          >
            <Wallet className="w-4 h-4" />
            Voltar ao inicio
          </Link>
        </div>

        <p className="text-zinc-600 text-sm mt-12">
          Algumas funcionalidades podem estar disponiveis offline. Suas transacoes pendentes serao sincronizadas automaticamente quando a conexao for restabelecida.
        </p>
      </div>
    </main>
  )
}
