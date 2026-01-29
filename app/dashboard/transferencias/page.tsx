"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { 
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Star,
  StarOff,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Bitcoin,
  ChevronRight,
  ChevronLeft,
  History,
  AlertTriangle,
  Info,
  Copy,
  Check
} from "lucide-react"

type PaymentMethod = "pix" | "crypto"
type PixKeyType = "cpf" | "cnpj" | "email" | "telefone" | "aleatoria"

interface Recipient {
  id: string
  name: string
  email?: string
  avatar: string
  pixKey?: string
  pixKeyType?: PixKeyType
  lastTransfer?: string
  isFavorite?: boolean
}

const TRANSFER_RATES = {
  pix: { rate: 0.5, label: "0,5%" },
  crypto: { rate: 1.0, label: "1,0%" }
}

const CRYPTO_NETWORKS = [
  { id: "btc", name: "Bitcoin", symbol: "BTC", addressRegex: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/ },
  { id: "eth", name: "Ethereum", symbol: "ETH", addressRegex: /^0x[a-fA-F0-9]{40}$/ },
  { id: "usdt_trc20", name: "USDT (TRC20)", symbol: "USDT", addressRegex: /^T[a-zA-Z0-9]{33}$/ },
  { id: "usdt_erc20", name: "USDT (ERC20)", symbol: "USDT", addressRegex: /^0x[a-fA-F0-9]{40}$/ },
  { id: "ltc", name: "Litecoin", symbol: "LTC", addressRegex: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/ },
]

function TransferenciasContent() {
  const searchParams = useSearchParams()
  const initialMethod = searchParams.get("metodo") as PaymentMethod | null
  
  const [activeTab, setActiveTab] = useState<"enviar" | "historico">("enviar")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(initialMethod)
  const [step, setStep] = useState<"method" | "recipient" | "details" | "pin" | "confirm" | "processing" | "success">(initialMethod ? "recipient" : "method")
  
  const [favoritos, setFavoritos] = useState<Recipient[]>([])
  const [historico, setHistorico] = useState<any[]>([])
  const [carregandoFavoritos, setCarregandoFavoritos] = useState(true)
  const [carregandoHistorico, setCarregandoHistorico] = useState(true)
  
  const [pixKey, setPixKey] = useState("")
  const [pixKeyType, setPixKeyType] = useState<PixKeyType>("cpf")
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null)
  const [recipientName, setRecipientName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  
  // Crypto specific
  const [cryptoNetwork, setCryptoNetwork] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [cryptoMemo, setCryptoMemo] = useState("")
  const [addressValid, setAddressValid] = useState<boolean | null>(null)
  
  // Common
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [pin, setPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [transactionId, setTransactionId] = useState("")
  const [copied, setCopied] = useState(false)
  const [saveAsFavorite, setSaveAsFavorite] = useState(false)

  useEffect(() => {
    const buscarDados = async () => {
      if (activeTab === "historico") {
        setCarregandoHistorico(true)
        try {
          const res = await apiClient.get('/transferencias')
          if (res.success) {
            setHistorico(res.data || [])
          }
        } catch (e) {
          console.error("Erro ao buscar histórico", e)
        } finally {
          setCarregandoHistorico(false)
        }
      } else {
        setCarregandoFavoritos(true)
        try {
          const res = await apiClient.get('/favoritos')
          if (res.success) {
            const favs = (res.data || []).map((f: any) => ({
              id: f.id,
              name: f.nome,
              avatar: f.nome.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
              pixKey: f.chave_pix,
              pixKeyType: f.tipo_chave,
              isFavorite: true
            }))
            setFavoritos(favs)
            setFavorites(favs.map((f: Recipient) => f.id))
          }
        } catch (e) {
          console.error("Erro ao buscar favoritos", e)
        } finally {
          setCarregandoFavoritos(false)
        }
      }
    }
    buscarDados()
  }, [activeTab])

  const numericAmount = Number.parseFloat(amount.replace(/\D/g, "")) / 100 || 0
  const currentRate = paymentMethod ? TRANSFER_RATES[paymentMethod].rate : 0.5
  const fee = numericAmount * (currentRate / 100)
  const total = numericAmount + fee

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return (Number.parseInt(numbers || "0") / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(formatCurrency(e.target.value))

  // Reset all fields when switching method
  const handleMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method)
    setStep("recipient")
    // Clear PIX fields
    setPixKey("")
    setPixKeyType("cpf")
    setSelectedRecipient(null)
    setRecipientName("")
    setSearchQuery("")
    // Clear Crypto fields
    setCryptoNetwork("")
    setWalletAddress("")
    setCryptoMemo("")
    setAddressValid(null)
    // Clear common fields
    setAmount("")
    setDescription("")
    setPin("")
    setSaveAsFavorite(false)
  }

  // Validate crypto address
  useEffect(() => {
    if (paymentMethod === "crypto" && walletAddress && cryptoNetwork) {
      const network = CRYPTO_NETWORKS.find(n => n.id === cryptoNetwork)
      if (network) {
        setAddressValid(network.addressRegex.test(walletAddress))
      }
    } else {
      setAddressValid(null)
    }
  }, [walletAddress, cryptoNetwork, paymentMethod])

  const handleSelectRecipient = (recipient: Recipient) => {
    setSelectedRecipient(recipient)
    setPixKey(recipient.pixKey || "")
    setPixKeyType(recipient.pixKeyType || "cpf")
    setRecipientName(recipient.name)
    setStep("details")
  }

  const handleManualPixKey = async () => {
    if (pixKey) {
      setIsLoading(true)
      try {
        const res = await apiClient.post('/transferencias/consultar-destinatario', {
          chavePix: pixKey
        })
        if (res.success && res.data) {
          setRecipientName(res.data.nome || "Nome não encontrado")
          setSelectedRecipient(null)
          setStep("details")
        } else {
          alert("Chave PIX inválida ou não encontrada")
        }
      } catch (e: any) {
        alert(e.response?.erro || "Erro ao consultar chave PIX")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleCryptoNext = () => {
    if (cryptoNetwork && walletAddress && addressValid) {
      setStep("details")
    }
  }

  const handleDetailsNext = () => {
    if (numericAmount > 0) {
      setStep("pin")
    }
  }

  const handlePinSubmit = () => {
    if (pin.length === 6) {
      setStep("confirm")
    }
  }

  const handleConfirm = async () => {
    setStep("processing")
    setIsLoading(true)

    try {
      const res = await apiClient.post('/transferencias', {
        metodo: paymentMethod,
        valor: numericAmount,
        pin,
        descricao: description,
        chavePix: paymentMethod === "pix" ? pixKey : undefined,
        tipoChavePix: paymentMethod === "pix" ? pixKeyType : undefined,
        nomeDestinatario: paymentMethod === "pix" ? (selectedRecipient?.name || recipientName) : undefined,
        moeda: paymentMethod === "crypto" ? (cryptoNetwork?.split("_")[0] || "USDT").toUpperCase() : undefined,
        rede: paymentMethod === "crypto" ? cryptoNetwork : undefined,
        enderecoCarteira: paymentMethod === "crypto" ? walletAddress : undefined,
        memo: paymentMethod === "crypto" ? cryptoMemo : undefined,
      })

      if (res.success) {
        if (saveAsFavorite && paymentMethod === "pix" && pixKey) {
          try {
            await apiClient.post('/favoritos', {
              nome: selectedRecipient?.name || recipientName || "Favorito",
              chavePix: pixKey,
              tipoChavePix: pixKeyType
            })
          } catch (e) {
            console.error("Erro ao salvar favorito", e)
          }
        }
        setTransactionId(res.data.transacao?.id || `TRF${Date.now()}`)
        setStep("success")
      } else {
        alert(res.error || "Erro ao processar transferencia")
        setStep("confirm")
      }
    } catch (e: any) {
      if (e.status === 503) {
        alert("Efibank não configurado. Os administradores precisam configurar PIX_CLIENT_ID, PIX_CLIENT_SECRET e PIX_CERT_PATH no .env")
      } else {
        alert(e.response?.erro || e.message || "Erro de conexao")
      }
      setStep("confirm")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const resetForm = () => {
    setPaymentMethod(null)
    setStep("method")
    setPixKey("")
    setPixKeyType("cpf")
    setSelectedRecipient(null)
    setRecipientName("")
    setSearchQuery("")
    setCryptoNetwork("")
    setWalletAddress("")
    setCryptoMemo("")
    setAddressValid(null)
    setAmount("")
    setDescription("")
    setPin("")
    setTransactionId("")
    setSaveAsFavorite(false)
  }

  const goBack = () => {
    if (step === "recipient") {
      setStep("method")
      setPaymentMethod(null)
    } else if (step === "details") {
      setStep("recipient")
      setSelectedRecipient(null)
    } else if (step === "pin") {
      setStep("details")
      setPin("")
    } else if (step === "confirm") {
      setStep("pin")
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filteredRecipients = favoritos.filter(r => 
    !searchQuery || 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.pixKey?.includes(searchQuery)
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-white">Transferencias</h1>
        <p className="text-zinc-500 text-xs sm:text-sm mt-1">Envie dinheiro via PIX ou Crypto</p>
      </div>

      <div className="flex gap-1 p-1 bg-zinc-900/50 rounded-xl w-fit">
        {[
          { id: "enviar" as const, label: "Enviar" },
          { id: "historico" as const, label: "Historico" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => { setActiveTab(tab.id); if (tab.id === "enviar") resetForm() }}
className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
                }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "enviar" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Step 1: Select Method */}
            {step === "method" && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-6">
                <h2 className="text-white font-medium mb-3 sm:mb-4 text-sm sm:text-base">Selecione o metodo</h2>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => handleMethodChange("pix")}
                    className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-zinc-800/30 hover:bg-zinc-800 border border-zinc-700 hover:border-emerald-500/50 rounded-xl transition-all group"
                  >
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center transition-colors">
                      <Smartphone className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-medium text-sm sm:text-base">PIX</p>
                      <p className="text-zinc-500 text-xs mt-0.5 sm:mt-1 hidden sm:block">Transferencia instantanea</p>
                      <p className="text-emerald-400 text-xs sm:text-sm font-semibold mt-1 sm:mt-2">0,5%</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMethodChange("crypto")}
                    className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-zinc-800/30 hover:bg-zinc-800 border border-zinc-700 hover:border-orange-500/50 rounded-xl transition-all group"
                  >
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-orange-500/10 group-hover:bg-orange-500/20 flex items-center justify-center transition-colors">
                      <Bitcoin className="w-5 h-5 sm:w-7 sm:h-7 text-orange-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-medium text-sm sm:text-base">Crypto</p>
                      <p className="text-zinc-500 text-xs mt-0.5 sm:mt-1 hidden sm:block">BTC, ETH, USDT, LTC</p>
                      <p className="text-orange-400 text-xs sm:text-sm font-semibold mt-1 sm:mt-2">1,0%</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: PIX - Recipient */}
            {step === "recipient" && paymentMethod === "pix" && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-6">
                <button type="button" onClick={goBack} className="flex items-center gap-1 text-zinc-400 hover:text-white text-sm mb-4 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>

                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 p-2.5 sm:p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  <span className="text-white font-medium text-sm sm:text-base">PIX</span>
                  <span className="ml-auto text-xs sm:text-sm font-medium text-emerald-400">0,5%</span>
                </div>

                {/* Manual PIX Key Input */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-white font-medium text-sm sm:text-base mb-2 sm:mb-3">Digite a chave PIX</h3>
                  <div className="flex gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
                    {[
                      { id: "cpf" as const, label: "CPF" },
                      { id: "cnpj" as const, label: "CNPJ" },
                      { id: "email" as const, label: "E-mail" },
                      { id: "telefone" as const, label: "Tel" },
                      { id: "aleatoria" as const, label: "Chave" },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setPixKeyType(type.id)}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          pixKeyType === type.id
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                      placeholder={
                        pixKeyType === "cpf" ? "000.000.000-00" :
                        pixKeyType === "cnpj" ? "00.000.000/0000-00" :
                        pixKeyType === "email" ? "email@exemplo.com" :
                        pixKeyType === "telefone" ? "(00) 00000-0000" :
                        "Chave aleatoria"
                      }
                      className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleManualPixKey}
                      disabled={!pixKey}
                      className="px-4 py-2.5 sm:py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex-1 h-px bg-zinc-800" />
                  <span className="text-zinc-500 text-xs sm:text-sm">ou selecione</span>
                  <div className="flex-1 h-px bg-zinc-800" />
                </div>

                {/* Search */}
                <div className="relative mb-3 sm:mb-4">
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por nome ou chave"
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>

                {carregandoFavoritos ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-emerald-500 w-6 h-6" />
                  </div>
                ) : filteredRecipients.length > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <History className="w-4 h-4 text-zinc-500" />
                      <span className="text-zinc-400 text-xs sm:text-sm">Favoritos</span>
                    </div>
                    <div className="space-y-2">
                      {filteredRecipients.map((recipient) => (
                        <div
                          key={recipient.id}
                          className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-zinc-800/30 hover:bg-zinc-800/50 rounded-xl transition-colors"
                        >
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await apiClient.delete(`/favoritos/${recipient.id}`)
                                setFavoritos(prev => prev.filter(f => f.id !== recipient.id))
                                setFavorites(prev => prev.filter(f => f !== recipient.id))
                              } catch (e) {
                                console.error("Erro ao remover favorito", e)
                              }
                            }}
                            className="text-amber-400 hover:text-amber-300 transition-colors hidden sm:block"
                          >
                            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSelectRecipient(recipient)}
                            className="flex-1 flex items-center gap-2 sm:gap-4 text-left min-w-0"
                          >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-emerald-400 font-bold text-xs sm:text-sm">{recipient.avatar}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-sm truncate">{recipient.name}</p>
                              <p className="text-zinc-500 text-xs truncate">{recipient.pixKey}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600 flex-shrink-0" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-zinc-500 text-sm">
                    Nenhum favorito salvo
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Crypto - Network and Address */}
            {step === "recipient" && paymentMethod === "crypto" && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-6">
                <button type="button" onClick={goBack} className="flex items-center gap-1 text-zinc-400 hover:text-white text-sm mb-4 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>

                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 p-2.5 sm:p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <Bitcoin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                  <span className="text-white font-medium text-sm sm:text-base">Crypto</span>
                  <span className="ml-auto text-xs sm:text-sm font-medium text-orange-400">1,0%</span>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6 p-3 sm:p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-400 font-medium text-xs sm:text-sm">Transacao irreversivel</p>
                    <p className="text-amber-300/80 text-xs mt-0.5 sm:mt-1">Verifique a rede e endereco antes de enviar.</p>
                  </div>
                </div>

                {/* Network Selection */}
                <div className="mb-4 sm:mb-6">
                  <label className="block text-white font-medium text-sm sm:text-base mb-2 sm:mb-3">Selecione a rede</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CRYPTO_NETWORKS.map((network) => (
                      <button
                        key={network.id}
                        type="button"
                        onClick={() => { setCryptoNetwork(network.id); setWalletAddress(""); setAddressValid(null) }}
                        className={`p-2 sm:p-3 rounded-lg border text-left transition-colors ${
                          cryptoNetwork === network.id
                            ? "bg-orange-500/20 border-orange-500/30 text-orange-400"
                            : "bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                        }`}
                      >
                        <p className="font-medium text-xs sm:text-sm">{network.symbol}</p>
                        <p className="text-xs opacity-70 hidden sm:block">{network.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wallet Address */}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-white font-medium text-sm sm:text-base mb-2">Endereco da carteira</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder={cryptoNetwork ? "Cole o endereco" : "Selecione a rede"}
                      disabled={!cryptoNetwork}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 bg-zinc-800 border rounded-xl text-white text-sm placeholder:text-zinc-500 focus:outline-none transition-colors ${
                        addressValid === true ? "border-emerald-500/50" :
                        addressValid === false ? "border-red-500/50" :
                        "border-zinc-700 focus:border-orange-500/50"
                      } disabled:opacity-50`}
                    />
                    {walletAddress && (
                      <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
                        {addressValid === true && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />}
                        {addressValid === false && <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />}
                      </div>
                    )}
                  </div>
                  {addressValid === false && (
                    <p className="text-red-400 text-xs mt-1.5 sm:mt-2">Endereco invalido</p>
                  )}
                </div>

                {/* Memo/Tag */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-white font-medium text-sm sm:text-base">Tag / Memo</label>
                    <span className="text-zinc-500 text-xs">(opcional)</span>
                  </div>
                  <input
                    type="text"
                    value={cryptoMemo}
                    onChange={(e) => setCryptoMemo(e.target.value)}
                    placeholder="Digite se necessario"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
                  <p className="text-zinc-500 text-xs mt-1.5 sm:mt-2 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Algumas redes exigem Tag/Memo
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCryptoNext}
                  disabled={!cryptoNetwork || !walletAddress || !addressValid}
                  className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-400 text-zinc-900 font-medium text-sm sm:text-base rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}

            {/* Step 3: Amount and Details */}
            {step === "details" && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-6">
                <button type="button" onClick={goBack} className="flex items-center gap-1 text-zinc-400 hover:text-white text-sm mb-4 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>

                {/* Recipient Summary */}
                <div className={`flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl ${
                  paymentMethod === "pix" ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-orange-500/10 border border-orange-500/20"
                }`}>
                  {paymentMethod === "pix" ? (
                    <>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        {selectedRecipient ? (
                          <span className="text-emerald-400 font-bold text-xs sm:text-sm">{selectedRecipient.avatar}</span>
                        ) : (
                          <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{selectedRecipient?.name || "Chave PIX"}</p>
                        <p className="text-zinc-400 text-xs sm:text-sm truncate">{pixKey}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                        <Bitcoin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{CRYPTO_NETWORKS.find(n => n.id === cryptoNetwork)?.name}</p>
                        <p className="text-zinc-400 text-xs sm:text-sm truncate">{walletAddress}</p>
                      </div>
                    </>
                  )}
                  <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${paymentMethod === "pix" ? "text-emerald-400" : "text-orange-400"}`} />
                </div>

                {/* Amount */}
                <h2 className="text-white font-medium text-sm sm:text-base mb-3 sm:mb-4">Valor da transferencia</h2>
                <div className="relative mb-3 sm:mb-4">
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="R$ 0,00"
                    className="w-full px-4 py-3 sm:py-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-xl sm:text-2xl font-semibold placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors text-center"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {[50, 100, 200, 500, 1000].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAmount(formatCurrency(String(value * 100)))}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs sm:text-sm rounded-lg transition-colors"
                    >
                      R$ {value}
                    </button>
                  ))}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-white font-medium">Descricao</label>
                    <span className="text-zinc-500 text-xs">(opcional)</span>
                  </div>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Pagamento de servico"
                    maxLength={140}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>

                {/* Save as Favorite - Only for PIX */}
                {paymentMethod === "pix" && !selectedRecipient && (
                  <div className="mb-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveAsFavorite}
                        onChange={(e) => setSaveAsFavorite(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500/20"
                      />
                      <span className="text-zinc-400 text-sm">Salvar como favorito</span>
                    </label>
                  </div>
                )}

                {/* Fee Summary */}
                {numericAmount > 0 && (
                  <div className="space-y-2 mb-6 p-4 bg-zinc-800/30 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Valor</span>
                      <span className="text-white">R$ {numericAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Taxa ({TRANSFER_RATES[paymentMethod!].label})</span>
                      <span className="text-zinc-400">R$ {fee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-zinc-700">
                      <span className="text-zinc-400 font-medium">Total</span>
                      <span className={`font-semibold ${paymentMethod === "pix" ? "text-emerald-400" : "text-orange-400"}`}>
                        R$ {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleDetailsNext}
                  disabled={numericAmount <= 0}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    paymentMethod === "pix" 
                      ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-900"
                      : "bg-orange-500 hover:bg-orange-400 text-zinc-900"
                  }`}
                >
                  Continuar
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 4: PIN */}
            {step === "pin" && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-6">
                <button type="button" onClick={goBack} className="flex items-center gap-1 text-zinc-400 hover:text-white text-sm mb-4 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    paymentMethod === "pix" ? "bg-emerald-500/10" : "bg-orange-500/10"
                  }`}>
                    <Lock className={`w-5 h-5 ${paymentMethod === "pix" ? "text-emerald-400" : "text-orange-400"}`} />
                  </div>
                  <div>
                    <h2 className="text-white font-medium">Confirme com seu PIN</h2>
                    <p className="text-zinc-500 text-sm">Digite seu PIN de 6 digitos</p>
                  </div>
                </div>

                <div className="max-w-xs mx-auto">
                  <div className="relative mb-6">
                    <input
                      type={showPin ? "text" : "password"}
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="******"
                      maxLength={6}
                      className="w-full px-4 py-4 pr-12 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-center text-2xl tracking-[0.5em] font-mono placeholder:text-zinc-600 placeholder:tracking-normal focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handlePinSubmit}
                    disabled={pin.length !== 6}
                    className={`w-full px-6 py-3 font-medium rounded-xl transition-colors disabled:opacity-50 ${
                      paymentMethod === "pix"
                        ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-900"
                        : "bg-orange-500 hover:bg-orange-400 text-zinc-900"
                    }`}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Confirm */}
            {step === "confirm" && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-6">
                <button type="button" onClick={goBack} className="flex items-center gap-1 text-zinc-400 hover:text-white text-sm mb-4 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>

                <h2 className="text-white font-medium mb-6">Confirme sua transferencia</h2>

                {paymentMethod === "crypto" && (
                  <div className="flex items-start gap-3 mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-400 font-medium text-sm">Confirmacao final</p>
                      <p className="text-red-300/80 text-xs mt-1">Esta transacao e irreversivel. Verifique todos os dados antes de confirmar.</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between py-3 border-b border-zinc-800">
                    <span className="text-zinc-500">Metodo</span>
                    <span className="text-white font-medium">{paymentMethod === "pix" ? "PIX" : "Criptomoeda"}</span>
                  </div>
                  
                  {paymentMethod === "pix" && (
                    <>
                      <div className="flex justify-between py-3 border-b border-zinc-800">
                        <span className="text-zinc-500">Destinatario</span>
                        <span className="text-white">{selectedRecipient?.name || "Chave PIX"}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-zinc-800">
                        <span className="text-zinc-500">Chave PIX</span>
                        <span className="text-white">{pixKey}</span>
                      </div>
                    </>
                  )}

                  {paymentMethod === "crypto" && (
                    <>
                      <div className="flex justify-between py-3 border-b border-zinc-800">
                        <span className="text-zinc-500">Rede</span>
                        <span className="text-white">{CRYPTO_NETWORKS.find(n => n.id === cryptoNetwork)?.name}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-zinc-800">
                        <span className="text-zinc-500">Endereco</span>
                        <span className="text-white text-sm truncate max-w-[200px]">{walletAddress}</span>
                      </div>
                      {cryptoMemo && (
                        <div className="flex justify-between py-3 border-b border-zinc-800">
                          <span className="text-zinc-500">Memo/Tag</span>
                          <span className="text-white">{cryptoMemo}</span>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex justify-between py-3 border-b border-zinc-800">
                    <span className="text-zinc-500">Valor</span>
                    <span className="text-white">R$ {numericAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-zinc-800">
                    <span className="text-zinc-500">Taxa</span>
                    <span className="text-zinc-400">R$ {fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-white font-medium">Total</span>
                    <span className={`text-lg font-bold ${paymentMethod === "pix" ? "text-emerald-400" : "text-orange-400"}`}>
                      R$ {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirm}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-xl transition-colors ${
                    paymentMethod === "pix"
                      ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-900"
                      : "bg-orange-500 hover:bg-orange-400 text-zinc-900"
                  }`}
                >
                  Confirmar transferencia
                </button>
              </div>
            )}

            {/* Step 6: Processing */}
            {step === "processing" && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 text-center">
                <Loader2 className={`w-12 h-12 mx-auto mb-4 animate-spin ${
                  paymentMethod === "pix" ? "text-emerald-400" : "text-orange-400"
                }`} />
                <h2 className="text-white font-medium text-lg mb-2">Processando transferencia</h2>
                <p className="text-zinc-500 text-sm">Aguarde enquanto processamos sua transacao...</p>
              </div>
            )}

            {/* Step 7: Success */}
            {step === "success" && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 text-center">
                <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
                  paymentMethod === "pix" ? "bg-emerald-500/20" : "bg-orange-500/20"
                }`}>
                  <CheckCircle2 className={`w-8 h-8 ${paymentMethod === "pix" ? "text-emerald-400" : "text-orange-400"}`} />
                </div>
                <h2 className="text-white font-medium text-xl mb-2">Transferencia realizada!</h2>
                <p className="text-zinc-500 text-sm mb-6">Sua transferencia foi processada com sucesso.</p>

                <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
                  <p className="text-zinc-500 text-xs mb-1">Codigo da transacao</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="text-white font-mono">{transactionId}</code>
                    <button
                      type="button"
                      onClick={() => handleCopy(transactionId)}
                      className="text-zinc-400 hover:text-white"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetForm}
                  className={`px-6 py-3 font-medium rounded-xl transition-colors ${
                    paymentMethod === "pix"
                      ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-900"
                      : "bg-orange-500 hover:bg-orange-400 text-zinc-900"
                  }`}
                >
                  Nova transferencia
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Info */}
          <div className="space-y-6">
            <div className={`border rounded-xl p-5 ${
              paymentMethod === "pix" 
                ? "bg-emerald-500/5 border-emerald-500/20" 
                : paymentMethod === "crypto"
                ? "bg-orange-500/5 border-orange-500/20"
                : "bg-zinc-900/50 border-zinc-800"
            }`}>
              <h3 className="text-white font-medium mb-3">
                {paymentMethod === "pix" ? "Sobre PIX" : paymentMethod === "crypto" ? "Sobre Crypto" : "Informacoes"}
              </h3>
              {paymentMethod === "pix" && (
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    Transferencia instantanea 24/7
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    Taxa de apenas 0,5%
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    Salve favoritos para envios rapidos
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    Confirmacao com PIN e 2FA
                  </li>
                </ul>
              )}
              {paymentMethod === "crypto" && (
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    Suporte a BTC, ETH, USDT, LTC
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    Taxa de 1,0%
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    Transacoes irreversiveis
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    Confirmacao dupla obrigatoria
                  </li>
                </ul>
              )}
              {!paymentMethod && (
                <p className="text-zinc-500 text-sm">Selecione um metodo de transferencia para ver mais informacoes.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "historico" && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <div className="p-3 sm:p-5 border-b border-zinc-800">
            <h2 className="text-sm sm:text-lg font-semibold text-white">Historico de transferencias</h2>
          </div>
          {carregandoHistorico ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
            </div>
          ) : historico.length > 0 ? (
            <div className="divide-y divide-zinc-800">
              {historico.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 sm:p-5 hover:bg-zinc-800/30 transition-colors gap-3">
                  <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
                      tx.method === "pix" ? "bg-emerald-500/10" : "bg-orange-500/10"
                    }`}>
                      {tx.method === "pix" ? (
                        <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                      ) : (
                        <Bitcoin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-xs sm:text-base font-medium truncate">{tx.recipient}</p>
                      <p className="text-zinc-500 text-xs truncate">
                        <span className="hidden sm:inline">{tx.method === "pix" ? tx.pixKey : tx.network} - </span>{tx.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-red-400 text-xs sm:text-base font-semibold">- {tx.amount}</p>
                    <p className="text-zinc-600 text-xs hidden sm:block">Taxa: {tx.fee}</p>
                    <div className="flex items-center gap-1 justify-end mt-0.5 sm:mt-1">
                      {tx.status === "completed" ? (
                        <CheckCircle2 className={`w-3 h-3 ${tx.method === "pix" ? "text-emerald-400" : "text-orange-400"}`} />
                      ) : (
                        <Clock className="w-3 h-3 text-amber-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 text-sm">
              Nenhuma transferência encontrada
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function TransferenciasPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    }>
      <TransferenciasContent />
    </Suspense>
  )
}
