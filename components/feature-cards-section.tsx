"use client"

import { motion } from "framer-motion"
import { ChevronRight, Plus, Wallet, Bitcoin, Shield } from "lucide-react"
import Link from "next/link"

const featureCards = [
  {
    title: "Carteira PIX",
    icon: Wallet,
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg p-4">
        <div className="w-full max-w-[240px] bg-zinc-800/50 rounded-xl border border-zinc-700/50 p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-zinc-300 text-xs font-medium">Carteira PIX</span>
          </div>
          <div className="space-y-2">
            <div className="bg-zinc-700/50 rounded-lg p-2">
              <p className="text-zinc-500 text-[10px] mb-1">Saldo disponível</p>
              <p className="text-emerald-400 text-lg font-semibold">R$ 5.847,32</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Carteira Crypto",
    icon: Bitcoin,
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4">
        <div className="w-full max-w-[240px] bg-zinc-800/50 rounded-xl border border-zinc-700/50 p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Bitcoin className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <span className="text-zinc-300 text-xs font-medium">Carteira Crypto</span>
          </div>
          <div className="space-y-2">
            <div className="bg-zinc-700/50 rounded-lg p-2">
              <p className="text-zinc-500 text-[10px] mb-1">Saldo em USDT</p>
              <p className="text-orange-400 text-lg font-semibold">$1,250.00</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Segurança total",
    icon: Shield,
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-4">
        <div className="space-y-2 w-full max-w-[220px]">
          {[
            { label: "PIN de 6 dígitos", status: "Ativo" },
            { label: "Autenticação 2FA", status: "Ativo" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-2 rounded-lg border bg-emerald-500/10 border-emerald-500/30">
              <span className="text-white text-xs">{item.label}</span>
              <span className="text-emerald-400 text-xs font-medium">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]

export function FeatureCardsSection() {
  return (
    <div id="recursos" className="relative z-20 py-20 md:py-40" style={{ backgroundColor: "#09090B" }}>
      <div className="absolute top-0 left-0 right-0 h-1/5 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      <div className="w-full flex justify-center px-4">
        <div className="w-full max-w-5xl">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl sm:text-3xl md:text-4xl text-white max-w-md">
              Duas carteiras, uma plataforma
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-md">
              <p className="text-zinc-400 text-sm md:text-base">Gerencie PIX e criptomoedas em um só lugar. Taxas transparentes.</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {featureCards.map((card, index) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group relative flex flex-col justify-end rounded-2xl h-[280px] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[70%] flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">{card.illustration}</div>
                <div className="relative z-10 flex items-center justify-between w-full px-4 pb-6">
                  <h3 className="text-white font-medium text-base md:text-lg">{card.title}</h3>
                  <div className="w-7 h-7 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 group-hover:border-emerald-500 group-hover:text-emerald-400 transition-colors"><Plus className="w-3.5 h-3.5" /></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
