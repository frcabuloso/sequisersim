"use client"

import { motion } from "framer-motion"

const companies = [
  { name: "s", icon: "Y" },
  { name: "sS", icon: "T" },
  { name: "Ss", icon: "R" },
  { name: "sDAW", icon: "B" },
  { name: "sf", icon: "D" },
  { name: "stw", icon: "Z" },
]

export function LogoCloud() {
  return (
    <div className="relative z-20 pb-16 md:pb-24 pt-6 md:pt-8" style={{ backgroundColor: "#09090B" }}>
      <div className="w-full flex justify-center px-4 md:px-6">
        <div className="w-full max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-sm md:text-lg text-zinc-300 mb-1 md:mb-2"
          >
            Usado por milhares de pessoas e empresas.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm md:text-lg text-zinc-500 mb-10 md:mb-16"
          >
            De vendedores digitais a grandes plataformas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group cursor-pointer"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 md:gap-x-16 gap-y-6 md:gap-y-10 items-center justify-items-center transition-all duration-300 group-hover:blur-[2.5px] group-hover:opacity-50">
              {companies.map((company) => (
                <div key={company.name} className="text-white font-semibold text-sm md:text-xl flex items-center gap-1.5 md:gap-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg bg-zinc-800 flex items-center justify-center text-emerald-400 font-bold text-[10px] md:text-sm">
                    {company.icon}
                  </div>
                  <span className="hidden sm:inline">{company.name}</span>
                  <span className="sm:hidden text-xs">{company.name}</span>
                </div>
              ))}
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="px-4 md:px-5 py-2 md:py-2.5 bg-zinc-800/80 backdrop-blur-sm border border-zinc-700 rounded-full text-xs md:text-sm text-zinc-300 flex items-center gap-2">
                Conheca nossos clientes
                <span aria-hidden="true">→</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
