"use client"

import { motion } from "framer-motion"
import { Smartphone, Monitor, Download, CheckCircle, Bell, Zap, Shield, WifiOff } from "lucide-react"
import { usePWA } from "@/lib/pwa-context"

export function DownloadAppSection() {
  const { isInstallable, isInstalled, installApp } = usePWA()

  const features = [
    { icon: Zap, title: "Acesso rápido", description: "Abra direto da tela inicial" },
    { icon: Bell, title: "Notificações", description: "Receba alertas de transações" },
    { icon: WifiOff, title: "Funciona offline", description: "Consulte saldo sem internet" },
    { icon: Shield, title: "Mais seguro", description: "Proteção adicional do sistema" },
  ]

  return (
    <section id="download" className="relative py-16 md:py-32 px-4 md:px-6" style={{ backgroundColor: "#09090B" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.05) 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">Baixar Aplicativo</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl text-white mb-6">fluxpay no seu <span className="text-emerald-400">dispositivo</span></h2>
            <p className="text-zinc-400 text-sm md:text-lg mb-8 max-w-lg">Instale como aplicativo. Acesso rápido e notificações em tempo real.</p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center flex-shrink-0"><f.icon className="w-5 h-5 text-emerald-400" /></div>
                  <div><p className="text-white font-medium text-sm">{f.title}</p><p className="text-zinc-500 text-xs">{f.description}</p></div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              {isInstalled ? (
                <div className="flex items-center gap-3 px-6 py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  <p className="text-white font-medium">App instalado</p>
                </div>
              ) : (
                <button type="button" onClick={async () => {
                  if (isInstallable && installApp) {
                    await installApp();
                  } else {
                    const prompt = (window as any).deferredInstallPrompt;
                    if (prompt) {
                      prompt.prompt();
                      await prompt.userChoice;
                      (window as any).deferredInstallPrompt = null;
                    } else {
                      alert("Clique em 'Instalar essa página como aplicativo' no menu do navegador.")
                    }
                  }
                }} className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                  <Download className="w-5 h-5" /> Baixar fluxpay
                </button>
              )}
            </div>
          </motion.div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full blur-3xl opacity-30 bg-emerald-500/30" />
            <div className="relative flex items-end gap-6 justify-center">
              <div className="w-48 h-96 bg-zinc-900 rounded-3xl border-4 border-zinc-800 shadow-2xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center"><span className="text-zinc-900 font-bold text-xs">P</span></div>
                  <span className="text-white text-sm font-medium">fluxpay</span>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-4 mb-3">
                  <p className="text-zinc-500 text-xs mb-1">Saldo</p>
                  <p className="text-emerald-400 text-xl font-bold">R$ 5.847,32</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
