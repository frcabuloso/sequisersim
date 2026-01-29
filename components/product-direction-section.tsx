"use client"

import { ChevronRight, Wallet, ArrowDownToLine, ArrowLeftRight, History, ArrowUpRight, ArrowDownRight, Percent, FileText } from "lucide-react"

export function ProductDirectionSection() {
  return (
    <section className="relative py-20 md:py-40 px-4 md:px-6 lg:px-12">
      {/* Gradient overlay at top */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: "20%",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.05), transparent 100%)",
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-2 mb-4 md:mb-6">
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-emerald-500" />
          <span className="text-zinc-400 text-xs md:text-sm">Painel Completo</span>
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-zinc-500" />
        </div>

        {/* Section heading */}
        <h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-4 md:mb-8 max-w-3xl"
          style={{
            letterSpacing: "-0.0325em",
            fontVariationSettings: '"opsz" 28',
            fontWeight: 538,
            lineHeight: 1.1,
          }}
        >
          Controle total da sua carteira
        </h2>

        {/* Description */}
        <p className="text-zinc-400 text-sm md:text-lg max-w-md mb-10 md:mb-16">
          <span className="text-white font-medium">Gerencie tudo em um so lugar.</span> Dashboard intuitivo com saldo,
          depositos, transferencias e historico completo.
        </p>

        {/* Dashboard Preview */}
        <div className="relative w-full mb-10 md:mb-16 bg-zinc-900/50 border border-zinc-800 rounded-xl md:rounded-2xl overflow-hidden">
          {/* Dashboard header */}
          <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-zinc-800 overflow-x-auto">
            <div className="flex items-center gap-2 md:gap-4 min-w-max">
              <button className="text-white font-medium text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 bg-zinc-800 rounded-lg whitespace-nowrap">Carteira</button>
              <button className="text-zinc-500 text-xs md:text-sm hover:text-zinc-300 transition-colors whitespace-nowrap">Depositos</button>
              <button className="text-zinc-500 text-xs md:text-sm hover:text-zinc-300 transition-colors whitespace-nowrap">Transferencias</button>
              <button className="text-zinc-500 text-xs md:text-sm hover:text-zinc-300 transition-colors whitespace-nowrap hidden sm:block">Extrato</button>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-zinc-500">
              Ultimos 30 dias
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Main stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 p-4 md:p-6">
            <div className="bg-zinc-800/30 rounded-lg md:rounded-xl p-3 md:p-4">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <Wallet className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                <span className="flex items-center text-emerald-400 text-[10px] md:text-xs">
                  <ArrowUpRight className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  Ativo
                </span>
              </div>
              <p className="text-zinc-500 text-[10px] md:text-sm mb-1">Saldo Disponivel</p>
              <p className="text-lg md:text-2xl font-semibold text-white">R$ 12.847,50</p>
            </div>
            <div className="bg-zinc-800/30 rounded-lg md:rounded-xl p-3 md:p-4">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <ArrowDownToLine className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                <span className="flex items-center text-emerald-400 text-[10px] md:text-xs">
                  <ArrowUpRight className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  +23.5%
                </span>
              </div>
              <p className="text-zinc-500 text-[10px] md:text-sm mb-1">Entradas (30d)</p>
              <p className="text-lg md:text-2xl font-semibold text-white">R$ 24.320,00</p>
            </div>
            <div className="bg-zinc-800/30 rounded-lg md:rounded-xl p-3 md:p-4">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <ArrowLeftRight className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                <span className="flex items-center text-zinc-400 text-[10px] md:text-xs">
                  <ArrowDownRight className="w-2.5 h-2.5 md:w-3 md:h-3" />
                  -8.2%
                </span>
              </div>
              <p className="text-zinc-500 text-[10px] md:text-sm mb-1">Saidas (30d)</p>
              <p className="text-lg md:text-2xl font-semibold text-white">R$ 18.450,00</p>
            </div>
            <div className="bg-zinc-800/30 rounded-lg md:rounded-xl p-3 md:p-4">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <History className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
              </div>
              <p className="text-zinc-500 text-[10px] md:text-sm mb-1">Transacoes</p>
              <p className="text-lg md:text-2xl font-semibold text-white">147</p>
            </div>
          </div>

          {/* Activity area */}
          <div className="px-4 md:px-6 pb-4 md:pb-6">
            <div className="bg-zinc-800/20 rounded-lg md:rounded-xl p-3 md:p-4">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <span className="text-zinc-300 text-xs md:text-sm font-medium">Movimentacoes recentes</span>
                <button className="text-emerald-400 text-[10px] md:text-xs hover:text-emerald-300">Ver todas</button>
              </div>
              <div className="space-y-2 md:space-y-3">
                {[
                  { type: "in", desc: "Deposito via Pix", user: "Voce", amount: "+R$ 2.500,00", time: "Hoje, 14:32" },
                  { type: "out", desc: "Transferencia enviada", user: "@mariasantos", amount: "-R$ 450,00", time: "Hoje, 11:15" },
                  { type: "in", desc: "Transferencia recebida", user: "@joaosilva", amount: "+R$ 1.200,00", time: "Ontem" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
                        item.type === "in" ? "bg-emerald-500/20" : "bg-zinc-700/50"
                      }`}>
                        {item.type === "in" ? (
                          <ArrowDownToLine className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
                        ) : (
                          <ArrowLeftRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-zinc-300 text-xs md:text-sm">{item.desc}</p>
                        <p className="text-zinc-600 text-[10px] md:text-xs">{item.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs md:text-sm font-medium ${item.type === "in" ? "text-emerald-400" : "text-zinc-300"}`}>
                        {item.amount}
                      </p>
                      <p className="text-zinc-600 text-[10px] md:text-xs">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom two-column section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0">
          {/* Left column - Taxas */}
          <div className="border-t md:border-r border-b border-zinc-800 pt-8 md:pt-10 md:pr-8 lg:pr-10 pb-8 md:pb-16">
            <h3 className="text-lg md:text-xl font-medium text-zinc-200 mb-3">Taxas claras e justas</h3>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed mb-6 md:mb-8">
              Taxas progressivas que diminuem conforme o valor. Quanto mais voce movimenta, menos paga.
            </p>

            <div className="rounded-lg md:rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 md:p-5">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5">
                <Percent className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                <span className="text-zinc-200 font-medium text-sm md:text-base">Tabela de taxas</span>
              </div>

              <div className="space-y-2 md:space-y-3">
                {[
                  { range: "Ate R$ 100", deposit: "1.5%", transfer: "1.0%" },
                  { range: "R$ 100 - R$ 1.000", deposit: "1.0%", transfer: "0.7%" },
                  { range: "R$ 1.000 - R$ 10.000", deposit: "0.7%", transfer: "0.5%" },
                  { range: "Acima de R$ 10.000", deposit: "0.5%", transfer: "0.3%" },
                ].map((tier) => (
                  <div
                    key={tier.range}
                    className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0"
                  >
                    <span className="text-zinc-400 text-xs md:text-sm">{tier.range}</span>
                    <div className="flex items-center gap-3 md:gap-4">
                      <span className="text-emerald-400 text-xs md:text-sm">{tier.deposit}</span>
                      <span className="text-blue-400 text-xs md:text-sm">{tier.transfer}</span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-end gap-3 md:gap-4 pt-2 text-[10px] md:text-xs text-zinc-600">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500" />
                    Deposito
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500" />
                    Transferencia
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Comprovantes */}
          <div className="border-t border-b border-zinc-800 pt-8 md:pt-10 md:pl-8 lg:pl-10 pb-8 md:pb-16">
            <h3 className="text-lg md:text-xl font-medium text-zinc-200 mb-3">Comprovantes automaticos</h3>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed mb-6 md:mb-8">
              Baixe recibos de todas as transacoes. Tudo documentado para sua seguranca.
            </p>

            <div className="relative h-48 md:h-56">
              {/* Stacked cards effect */}
              <div
                className="absolute rounded-lg bg-zinc-800/30 border border-zinc-700/30 px-3 md:px-4 py-2 md:py-3"
                style={{ top: 0, left: "5%", width: "90%", height: "40px" }}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-600" />
                  <span className="text-zinc-500 text-xs md:text-sm">#TRF-12845</span>
                </div>
              </div>

              <div
                className="absolute rounded-lg bg-zinc-800/50 border border-zinc-700/40 px-3 md:px-4 py-2 md:py-3"
                style={{ top: "24px", left: "2.5%", width: "95%", height: "40px" }}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 md:w-4 md:h-4 text-zinc-500" />
                  <span className="text-zinc-400 text-xs md:text-sm">#DEP-12846</span>
                </div>
              </div>

              <div
                className="absolute rounded-lg md:rounded-xl bg-zinc-800/90 border border-zinc-700/50 p-4 md:p-5"
                style={{ top: "48px", left: 0, width: "100%" }}
              >
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <FileText className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm md:text-base">#TRF-12847</p>
                      <p className="text-zinc-500 text-[10px] md:text-xs">Transferencia enviada</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] md:text-xs font-medium">
                    Concluida
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                  <div>
                    <p className="text-zinc-600 text-[10px] md:text-xs mb-1">Destinatario</p>
                    <p className="text-zinc-300">@mariasantos</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 text-[10px] md:text-xs mb-1">Valor</p>
                    <p className="text-zinc-300">R$ 450,00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 pt-10 md:pt-16 border-b border-zinc-800 pb-10 md:pb-16">
          {[
            { icon: ArrowDownToLine, label: "Depositos rapidos", desc: "Via Pix ou Crypto" },
            { icon: ArrowLeftRight, label: "Transferencias P2P", desc: "Instantaneo" },
            { icon: Wallet, label: "Carteira segura", desc: "Criptografia" },
            { icon: History, label: "Historico completo", desc: "Todas movimentacoes" },
          ].map((feature) => (
            <div key={feature.label}>
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <feature.icon className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                <span className="text-zinc-200 font-medium text-xs md:text-sm">{feature.label}</span>
              </div>
              <p className="text-zinc-500 text-[10px] md:text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
