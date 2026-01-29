"use client"

import Link from "next/link"
import { Wallet, Download, CheckCircle } from "lucide-react"
import { usePWA } from "@/lib/pwa-context"

export function Footer() {
  const { isInstallable, isInstalled, installApp } = usePWA()

  return (
    <footer className="border-t border-zinc-800 py-10 md:py-16 px-4 md:px-6" style={{ backgroundColor: "#09090B" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 md:mb-12 p-4 md:p-6 bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-xl md:rounded-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Download className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-medium text-sm md:text-base">Baixe o aplicativo fluxpay</p>
                <p className="text-zinc-500 text-xs md:text-sm">Disponível para Android, iOS e Desktop</p>
              </div>
            </div>
            {isInstalled ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xs md:text-sm font-medium">App instalado</span>
              </div>
            ) : isInstallable ? (
              <button
                type="button"
                onClick={installApp}
                className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-medium rounded-lg md:rounded-xl transition-colors text-xs md:text-sm"
              >
                <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Instalar agora
              </button>
            ) : (
              <Link
                href="#download"
                className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg md:rounded-xl border border-zinc-700 transition-colors text-xs md:text-sm"
              >
                <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Saiba mais
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3 md:mb-4">
              <span className="text-white font-semibold text-sm md:text-base">fluxpay</span>
            </Link>
            <p className="text-zinc-500 text-xs md:text-sm leading-relaxed">Sua carteira digital para PIX e criptomoedas.</p>
          </div>

          <div>
            <h3 className="text-white font-medium text-xs md:text-sm mb-3 md:mb-4">Recursos</h3>
            <ul className="space-y-2 md:space-y-3">
              <li><Link href="/changelog" className="text-zinc-500 text-xs md:text-sm">Novidades</Link></li>
              <li><Link href="/termos" className="text-zinc-500 text-xs md:text-sm">Termos</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 md:mt-16 pt-6 md:pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 text-[10px] md:text-sm">© {new Date().getFullYear()} fluxpay. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
