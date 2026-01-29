"use client"

import {
  Percent,
  ArrowRight,
  Info,
  TrendingUp,
  Calculator,
  CheckCircle2,
  ArrowDownToLine,
  ArrowLeftRight,
  Bitcoin,
  QrCode,
} from "lucide-react"
import { useState } from "react"

const taxasDeposito = [
  { metodo: "Pix", icon: QrCode, taxa: "0,5%", tempo: "Instantaneo", color: "emerald" },
  { metodo: "Criptomoedas (USDT, BTC, ETH, LTC)", icon: Bitcoin, taxa: "1,0%", tempo: "10-30 min", color: "amber" },
]

const taxasTransferencia = [
  { range: "Ate R$ 100", taxa: "1,0%", valor: "R$ 1,00" },
  { range: "R$ 100,01 a R$ 500", taxa: "0,9%", valor: "R$ 0,90 a R$ 4,50" },
  { range: "R$ 500,01 a R$ 1.000", taxa: "0,8%", valor: "R$ 4,00 a R$ 8,00" },
  { range: "R$ 1.000,01 a R$ 5.000", taxa: "0,7%", valor: "R$ 7,00 a R$ 35,00" },
  { range: "R$ 5.000,01 a R$ 10.000", taxa: "0,6%", valor: "R$ 30,00 a R$ 60,00" },
  { range: "Acima de R$ 10.000", taxa: "0,5%", valor: "A partir de R$ 50,00" },
]

export default function TaxasPage() {
  const [calcValue, setCalcValue] = useState("")
  const [calcType, setCalcType] = useState<"transferencia" | "deposito_pix" | "deposito_crypto">("transferencia")
  const [calcResult, setCalcResult] = useState<{ taxa: number; liquido: number } | null>(null)

  const calcularTaxa = () => {
    const valor = parseFloat(calcValue.replace(/[^\d,]/g, "").replace(",", "."))
    if (isNaN(valor) || valor <= 0) return

    let taxaPercent = 0
    
    if (calcType === "deposito_pix") {
      taxaPercent = 0.005 // 0.5%
    } else if (calcType === "deposito_crypto") {
      taxaPercent = 0.01 // 1.0%
    } else {
      // Transferencia progressiva
      if (valor <= 100) taxaPercent = 0.01
      else if (valor <= 500) taxaPercent = 0.009
      else if (valor <= 1000) taxaPercent = 0.008
      else if (valor <= 5000) taxaPercent = 0.007
      else if (valor <= 10000) taxaPercent = 0.006
      else taxaPercent = 0.005
    }

    const valorTaxa = valor * taxaPercent
    setCalcResult({ taxa: valorTaxa, liquido: valor - valorTaxa })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Taxas</h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-1">Conheca nossas taxas transparentes e competitivas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Tabela de Transferencias */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <div className="p-4 sm:p-5 border-b border-zinc-800">
              <h2 className="text-sm sm:text-lg font-semibold text-white">Taxas de Transferencia</h2>
              <p className="text-zinc-500 text-xs sm:text-sm mt-1">
                Quanto maior o valor, menor a taxa.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left text-xs sm:text-sm font-medium text-zinc-400 px-3 sm:px-5 py-3 sm:py-4">Valor</th>
                    <th className="text-left text-xs sm:text-sm font-medium text-zinc-400 px-3 sm:px-5 py-3 sm:py-4">Taxa</th>
                    <th className="text-left text-xs sm:text-sm font-medium text-zinc-400 px-3 sm:px-5 py-3 sm:py-4 hidden sm:table-cell">Valor taxa</th>
                  </tr>
                </thead>
                <tbody>
                  {taxasTransferencia.map((row, index) => (
                    <tr key={row.range} className={`border-b border-zinc-800/50 ${index === 5 ? "bg-emerald-500/5" : ""}`}>
                      <td className="px-3 sm:px-5 py-3 sm:py-4">
                        <span className="text-white font-medium text-xs sm:text-sm">{row.range}</span>
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4">
                        <span className={`font-semibold text-xs sm:text-sm ${index === 5 ? "text-emerald-400" : "text-zinc-300"}`}>
                          {row.taxa}
                        </span>
                        {index === 5 && (
                          <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full hidden sm:inline">
                            Melhor
                          </span>
                        )}
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4 hidden sm:table-cell">
                        <span className="text-zinc-400 text-sm">{row.valor}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Integracoes de Pagamento</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Utilizamos as melhores integracoes do mercado para garantir seguranca e agilidade:
                  <strong className="text-white"> Efibank</strong> para Pix,
                  <strong className="text-white"> Stripe</strong> para cartoes e
                  <strong className="text-white"> OxaPay</strong> para criptomoedas.
                  Todas as transacoes sao processadas de forma segura e criptografada.
                </p>
              </div>
            </div>
          </div>

          {/* Vantagens */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-5">
            <h3 className="text-sm sm:text-lg font-semibold text-white mb-3 sm:mb-4">Vantagens do fluxpay</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Sem mensalidade",
                "Sem taxa de manutencao",
                "Transferencias instantaneas",
                "Suporte 24/7",
                "Taxas transparentes",
                "Seguranca de ponta",
                "PIN de seguranca",
                "Autenticacao 2FA",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-zinc-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calculadora */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-sm sm:text-lg font-semibold text-white">Calculadora de taxas</h3>
            </div>
            <p className="text-zinc-500 text-sm mb-4">
              Simule quanto voce pagara de taxa
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Tipo de operacao
                </label>
                <select
                  value={calcType}
                  onChange={(e) => setCalcType(e.target.value as typeof calcType)}
                  className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                >
                  <option value="transferencia">Transferencia</option>
                  <option value="deposito_pix">Transferencia via Pix (0,5%)</option>
                  <option value="deposito_crypto">Transferencia via Crypto (1,0%)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Valor
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">R$</span>
                  <input
                    type="text"
                    value={calcValue}
                    onChange={(e) => setCalcValue(e.target.value)}
                    placeholder="0,00"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={calcularTaxa}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-medium rounded-xl transition-colors"
              >
                Calcular
                <ArrowRight className="w-4 h-4" />
              </button>
              {calcResult && (
                <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-sm">Taxa cobrada</span>
                    <span className="text-red-400 font-medium">
                      - R$ {calcResult.taxa.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-700">
                    <span className="text-zinc-400 text-sm">Valor liquido</span>
                    <span className="text-emerald-400 font-semibold text-lg">
                      R$ {calcResult.liquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-5">
            <h3 className="text-sm sm:text-lg font-semibold text-white mb-3 sm:mb-4">Duvidas sobre taxas?</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Nossa equipe esta pronta para esclarecer qualquer duvida sobre nossas taxas.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium"
            >
              Falar com suporte <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
