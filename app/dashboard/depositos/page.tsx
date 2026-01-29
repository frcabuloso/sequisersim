"use client"

import React, { useState, useEffect } from "react"
import { 
  Plus, 
  Smartphone, 
  Bitcoin, 
  Loader2, 
  ChevronRight, 
  CheckCircle2, 
  Copy, 
  Check 
} from "lucide-react"
import { apiClient } from "@/lib/api-client"

export default function PaginaDepositos() {
  const [etapa, setEtapa] = useState<"metodo" | "valor" | "moeda" | "processando" | "sucesso">("metodo")
  const [metodo, setMetodo] = useState<"pix" | "crypto" | null>(null)
  const [moeda, setMoeda] = useState<"USDT" | "BTC" | "ETH" | "LTC" | null>(null)
  const [valor, setValor] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [resultado, setResultado] = useState<any>(null)
  const [copiado, setCopiado] = useState(false)

  const moedasDisponiveis = [
    { codigo: "USDT", nome: "Tether (USDT)", icone: "💵" },
    { codigo: "BTC", nome: "Bitcoin (BTC)", icone: "₿" },
    { codigo: "ETH", nome: "Ethereum (ETH)", icone: "Ξ" },
    { codigo: "LTC", nome: "Litecoin (LTC)", icone: "Ł" },
  ]

  const handleDeposito = async () => {
    if (!valor) return
    setCarregando(true)
    try {
      const valorNumerico = parseFloat(valor.replace(/[^\d]/g, "")) / 100
      
      if (metodo === "pix") {
        const res = await apiClient.post('/transacoes/deposito/pix', { 
          valor: valorNumerico
        })
        if (res.success) {
          setResultado(res.data)
          setEtapa("sucesso")
        }
      } else if (metodo === "crypto" && moeda) {
        const res = await apiClient.post('/transacoes/deposito/crypto', { 
          valor: valorNumerico,
          moeda: moeda
        })
        if (res.success) {
          setResultado(res.data)
          setEtapa("sucesso")
        }
      }
    } catch (e: any) {
      if (e.status === 503) {
        if (metodo === "pix") {
          alert("Efibank não configurado. Os administradores precisam configurar PIX_CLIENT_ID, PIX_CLIENT_SECRET e PIX_CERT_PATH no .env")
        } else {
          alert("OxaPay não configurado. Os administradores precisam configurar OXAPAY_API_KEY no .env")
        }
      } else {
        alert(e.response?.erro || "Erro ao processar depósito. Verifique sua conexão.")
      }
    } finally {
      setCarregando(false)
    }
  }

  const copiar = (texto: string) => {
    navigator.clipboard.writeText(texto)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white">Adicionar Saldo</h1>

      {etapa === "metodo" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => { setMetodo("pix"); setEtapa("valor") }} className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-emerald-500/50 transition-all group">
            <Smartphone className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-white font-bold text-xl">PIX</h3>
            <p className="text-zinc-500 text-sm">Instantâneo e seguro</p>
          </button>
          <button onClick={() => { setMetodo("crypto"); setEtapa("moeda") }} className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-orange-500/50 transition-all group">
            <Bitcoin className="text-orange-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="text-white font-bold text-xl">Cripto</h3>
            <p className="text-zinc-500 text-sm">BTC, ETH, USDT, LTC</p>
          </button>
        </div>
      )}

      {etapa === "moeda" && metodo === "crypto" && (
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
          <h3 className="text-white font-bold mb-4">Selecione a criptomoeda</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {moedasDisponiveis.map((m) => (
              <button
                key={m.codigo}
                onClick={() => {
                  setMoeda(m.codigo as any)
                  setEtapa("valor")
                }}
                className={`p-6 bg-zinc-800 border rounded-xl transition-all ${
                  moeda === m.codigo ? "border-orange-500 bg-orange-500/10" : "border-zinc-700 hover:border-orange-500/50"
                }`}
              >
                <div className="text-3xl mb-2">{m.icone}</div>
                <div className="text-white font-bold">{m.codigo}</div>
                <div className="text-zinc-500 text-xs">{m.nome.split("(")[0].trim()}</div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setEtapa("metodo")}
            className="text-zinc-500 hover:text-white"
          >
            Voltar
          </button>
        </div>
      )}

      {etapa === "valor" && (
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
          <h3 className="text-white font-bold mb-4">
            {metodo === "crypto" ? `Qual o valor em ${moeda}?` : "Qual o valor do depósito?"}
          </h3>
          <input
            type="text"
            placeholder={metodo === "crypto" ? `${moeda} 0.00` : "R$ 0,00"}
            className="w-full bg-zinc-800 border border-zinc-700 p-4 rounded-xl text-white text-3xl font-bold text-center mb-6 outline-none focus:border-emerald-500"
            value={valor}
            onChange={e => {
              if (metodo === "crypto") {
                const val = e.target.value.replace(/[^\d.]/g, "")
                const parts = val.split(".")
                if (parts.length > 2) return
                if (parts[1] && parts[1].length > 8) return
                setValor(val)
              } else {
                const val = e.target.value.replace(/\D/g, "")
                setValor((Number(val) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
              }
            }}
          />
          <div className="flex gap-3">
            <button
              onClick={() => setEtapa(metodo === "crypto" ? "moeda" : "metodo")}
              className="flex-1 bg-zinc-800 p-4 rounded-xl font-bold text-white hover:bg-zinc-700"
            >
              Voltar
            </button>
            <button
              disabled={carregando || !valor}
              onClick={handleDeposito}
              className="flex-1 bg-emerald-500 p-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {carregando ? <Loader2 className="animate-spin" /> : "Continuar"}
            </button>
          </div>
        </div>
      )}

      {etapa === "sucesso" && resultado && (
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-emerald-500" size={32} />
          </div>
          <h2 className="text-white font-bold text-2xl mb-2">Depósito Gerado!</h2>
          <p className="text-zinc-500 mb-8">
            {metodo === "pix" 
              ? "Escaneie o QR Code ou copie o código abaixo."
              : `Envie ${resultado.moeda || moeda} para o endereço abaixo.`}
          </p>
          
          {metodo === "pix" && resultado.qrCode && (
            <>
              <div className="bg-white p-6 rounded-2xl w-64 h-64 mx-auto mb-8 shadow-xl flex items-center justify-center relative overflow-hidden">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(resultado.qrCode || resultado.pixCopiaECola)}`}
                  alt="QR Code Pix"
                  className="w-full h-full"
                />
                <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-2xl pointer-events-none" />
              </div>

              <div className="bg-zinc-800 p-4 rounded-xl flex items-center justify-between gap-4 mb-6">
                <code className="text-zinc-400 text-xs truncate">{resultado.pixCopiaECola || resultado.qrCode}</code>
                <button onClick={() => copiar(resultado.pixCopiaECola || resultado.qrCode)} className="text-emerald-500">
                  {copiado ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </>
          )}

          {metodo === "crypto" && resultado.endereco && (
            <>
              <div className="bg-white p-6 rounded-2xl w-64 h-64 mx-auto mb-8 shadow-xl flex items-center justify-center relative overflow-hidden">
                {resultado.qrCode ? (
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(resultado.endereco)}`}
                    alt="QR Code Crypto"
                    className="w-full h-full"
                  />
                ) : (
                  <Bitcoin className="text-zinc-400" size={64} />
                )}
                <div className="absolute inset-0 border-4 border-orange-500/20 rounded-2xl pointer-events-none" />
              </div>

              <div className="bg-zinc-800 p-4 rounded-xl mb-4">
                <p className="text-zinc-500 text-sm mb-2">Moeda: {resultado.moeda || moeda}</p>
                <div className="flex items-center justify-between gap-4">
                  <code className="text-zinc-400 text-xs break-all flex-1 text-left">{resultado.endereco}</code>
                  <button onClick={() => copiar(resultado.endereco)} className="text-orange-500 flex-shrink-0">
                    {copiado ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              {resultado.moeda && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
                  <p className="text-amber-400 text-sm">
                    Envie apenas {resultado.moeda} para este endereço. Enviar outras moedas resultará em perda permanente.
                  </p>
                </div>
              )}
            </>
          )}

          <button 
            onClick={() => {
              setEtapa("metodo")
              setMetodo(null)
              setMoeda(null)
              setValor("")
              setResultado(null)
            }} 
            className="text-zinc-500 hover:text-white"
          >
            Voltar
          </button>
        </div>
      )}
    </div>
  )
}
