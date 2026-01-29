"use client"

import { motion } from "framer-motion"
import { ChevronRight, Shield, Lock, Globe, Clock, Wallet, ArrowLeftRight } from "lucide-react"

const securityFeatures = [
  { icon: Shield, label: "Criptografia AES-256" },
  { icon: Lock, label: "Proteção de dados" },
  { icon: Globe, label: "Infraestrutura global" },
  { icon: Clock, label: "99.99% Uptime" },
]

export function AISection() {
  return (
    <div className="relative z-20 py-20 md:py-40" style={{ backgroundColor: "#09090B" }}>
      <div className="absolute top-0 left-0 right-0 h-1/5 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      <div className="w-full flex justify-center px-4 md:px-6">
        <div className="w-full max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-zinc-400 text-sm">Segurança e Confiança</span>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-2xl sm:text-3xl md:text-4xl text-white max-w-3xl mb-6">
            Plataforma segura e confiável
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-zinc-400 max-w-md mb-10">
            Seus dados e transações estão protegidos com a mais alta tecnologia.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-wrap gap-3 mb-16">
            {securityFeatures.map((feature) => (
              <div key={feature.label} className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-full">
                <feature.icon className="w-4 h-4 text-emerald-400" />
                <span className="text-zinc-300 text-xs sm:text-sm">{feature.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-center mb-16">
            <div className="w-full max-w-4xl bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  <span className="text-white font-medium">Sua Carteira</span>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                <div className="bg-zinc-800/30 rounded-xl p-4">
                  <p className="text-zinc-500 text-xs mb-1">Saldo disponível</p>
                  <p className="text-lg md:text-2xl font-semibold text-white">R$ 8.472,50</p>
                </div>
                <div className="bg-zinc-800/30 rounded-xl p-4">
                  <p className="text-zinc-500 text-xs mb-1">Em processamento</p>
                  <p className="text-lg md:text-2xl font-semibold text-white">R$ 1.250,00</p>
                </div>
                <div className="bg-zinc-800/30 rounded-xl p-4">
                  <p className="text-zinc-500 text-xs mb-1">Entradas (30d)</p>
                  <p className="text-lg md:text-2xl font-semibold text-white">R$ 15.840,00</p>
                </div>
                <div className="bg-zinc-800/30 rounded-xl p-4">
                  <p className="text-zinc-500 text-xs mb-1">Saídas (30d)</p>
                  <p className="text-lg md:text-2xl font-semibold text-white">R$ 12.340,00</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
