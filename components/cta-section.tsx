"use client"

import { Wallet, ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6" style={{ backgroundColor: "#09090B" }}>
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl md:rounded-3xl p-6 md:p-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-emerald-500/15 blur-3xl pointer-events-none rounded-full" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-zinc-900" />
                </div>
                <span className="text-emerald-400 font-medium text-sm">fluxpay</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-white tracking-tight mb-3">
                Comece a usar sua carteira digital hoje
              </h2>
              <p className="text-zinc-400 text-sm md:text-lg max-w-md mx-auto md:mx-0">
                Crie sua conta em minutos e faça seu primeiro depósito.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <Link href="/login?registrar=true" className="w-full sm:w-auto text-center px-5 py-2.5 bg-emerald-500 text-zinc-900 font-medium rounded-xl hover:bg-emerald-400 flex items-center justify-center gap-2">
                Criar conta grátis
                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
