"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ArrowRight, ArrowDownToLine, ArrowLeftRight, History, Users, Percent, FileText } from "lucide-react"

const carouselCards = [
  {
    id: 1,
    category: "Depositos",
    title: "Adicione saldo via Pix ou transferencia",
    icon: ArrowRight,
    mockup: "deposits",
  },
  {
    id: 2,
    category: "Transferencias",
    title: "Envie para qualquer usuario instantaneamente",
    icon: ArrowRight,
    mockup: "transfers",
  },
  {
    id: 3,
    category: "Historico",
    title: "Extrato completo de todas as movimentacoes",
    icon: ArrowRight,
    mockup: "history",
  },
  {
    id: 4,
    category: "Usuarios",
    title: "Encontre e adicione contatos facilmente",
    icon: ArrowRight,
    mockup: "users",
  },
  {
    id: 5,
    category: "Taxas",
    title: "Visualize taxas antes de confirmar",
    icon: ArrowRight,
    mockup: "fees",
  },
  {
    id: 6,
    category: "Comprovantes",
    title: "Baixe recibos de todas as transacoes",
    icon: ArrowRight,
    mockup: "receipts",
  },
]

function DepositsMockup() {
  return (
    <div className="flex flex-col gap-2 md:gap-3 p-3 md:p-4">
      <div className="flex items-center gap-2 text-[10px] md:text-xs text-zinc-400 mb-1 md:mb-2">
        <ArrowDownToLine className="w-3 h-3 md:w-3.5 md:h-3.5" />
        <span>Metodos de deposito</span>
      </div>
      <div className="space-y-1.5 md:space-y-2">
        {[
          { name: "PIX", icon: "", active: true, time: "Instantaneo" },
          { name: "Cripto", icon: "", active: true, time: "5-30 min" },
        ].map((method) => (
          <div
            key={method.name}
            className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg bg-zinc-800/50"
          >
            <span className="text-sm md:text-base">{method.icon}</span>
            <div className="flex-1">
              <span className="text-zinc-300 text-xs md:text-sm">{method.name}</span>
              <p className="text-zinc-600 text-[10px] md:text-xs">{method.time}</p>
            </div>
            {method.active && <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500" />}
          </div>
        ))}
      </div>
    </div>
  )
}

function TransfersMockup() {
  return (
    <div className="flex flex-col gap-2 md:gap-3 p-3 md:p-4">
      <div className="flex items-center gap-2 text-[10px] md:text-xs text-zinc-400 mb-1 md:mb-2">
        <ArrowLeftRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
        <span>Transferir para</span>
      </div>
      <div className="bg-zinc-800/30 rounded-lg p-2 md:p-3">
        <input 
          type="text" 
          placeholder="@usuario ou email" 
          className="w-full bg-transparent text-zinc-300 text-xs md:text-sm outline-none"
          readOnly
          value="@mariasantos"
        />
      </div>
      <div className="bg-zinc-800/30 rounded-lg p-2 md:p-3">
        <p className="text-zinc-500 text-[10px] md:text-xs mb-1">Valor</p>
        <p className="text-white text-base md:text-lg font-semibold">R$ 250,00</p>
      </div>
      <div className="h-8 md:h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
        <span className="text-zinc-900 text-xs md:text-sm font-medium">Enviar agora</span>
      </div>
    </div>
  )
}

function HistoryMockup() {
  return (
    <div className="flex flex-col gap-2 md:gap-3 p-3 md:p-4">
      <div className="flex items-center gap-2 text-[10px] md:text-xs text-zinc-400 mb-1 md:mb-2">
        <History className="w-3 h-3 md:w-3.5 md:h-3.5" />
        <span>Extrato</span>
      </div>
      <div className="space-y-1.5 md:space-y-2">
        {[
          { desc: "Deposito PIX", amount: "+R$ 500,00", positive: true },
          { desc: "Para @joao", amount: "-R$ 100,00", positive: false },
          { desc: "De @maria", amount: "+R$ 75,00", positive: true },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 md:py-2 border-b border-zinc-800/50 last:border-0">
            <span className="text-zinc-400 text-xs md:text-sm">{item.desc}</span>
            <span className={`text-xs md:text-sm font-medium ${item.positive ? "text-emerald-400" : "text-zinc-300"}`}>
              {item.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function UsersMockup() {
  return (
    <div className="flex flex-col gap-2 md:gap-3 p-3 md:p-4">
      <div className="flex items-center gap-2 text-[10px] md:text-xs text-zinc-400 mb-1 md:mb-2">
        <Users className="w-3 h-3 md:w-3.5 md:h-3.5" />
        <span>Contatos frequentes</span>
      </div>
      <div className="space-y-1.5 md:space-y-2">
        {[
          { name: "Maria Santos", user: "@mariasantos" },
          { name: "Joao Silva", user: "@joaosilva" },
          { name: "Pedro Costa", user: "@pedrocosta" },
        ].map((contact) => (
          <div key={contact.user} className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 cursor-pointer">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="text-emerald-400 text-[10px] md:text-xs font-bold">{contact.name.split(" ").map(n => n[0]).join("")}</span>
            </div>
            <div>
              <p className="text-zinc-300 text-xs md:text-sm">{contact.name}</p>
              <p className="text-zinc-600 text-[10px] md:text-xs">{contact.user}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeesMockup() {
  return (
    <div className="flex flex-col gap-2 md:gap-3 p-3 md:p-4">
      <div className="flex items-center gap-2 text-[10px] md:text-xs text-zinc-400 mb-1 md:mb-2">
        <Percent className="w-3 h-3 md:w-3.5 md:h-3.5" />
        <span>Tabela de taxas</span>
      </div>
      <div className="space-y-1.5 md:space-y-2">
        <div className="bg-zinc-800/30 rounded-lg p-2 md:p-3">
          <div className="flex justify-between mb-1.5 md:mb-2">
            <span className="text-zinc-400 text-[10px] md:text-xs">Deposito</span>
            <span className="text-emerald-400 text-[10px] md:text-xs font-medium">0.5% - 1.5%</span>
          </div>
          <div className="h-1 bg-zinc-700 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-emerald-500 rounded-full" />
          </div>
        </div>
        <div className="bg-zinc-800/30 rounded-lg p-2 md:p-3">
          <div className="flex justify-between mb-1.5 md:mb-2">
            <span className="text-zinc-400 text-[10px] md:text-xs">Transferencia</span>
            <span className="text-blue-400 text-[10px] md:text-xs font-medium">0.3% - 1.0%</span>
          </div>
          <div className="h-1 bg-zinc-700 rounded-full overflow-hidden">
            <div className="h-full w-1/4 bg-blue-500 rounded-full" />
          </div>
        </div>
      </div>
      <p className="text-zinc-600 text-[10px] md:text-xs text-center">Taxa varia conforme valor</p>
    </div>
  )
}

function ReceiptsMockup() {
  return (
    <div className="flex items-center justify-center h-full p-3 md:p-4">
      <div className="w-full max-w-[180px] md:max-w-[200px] bg-zinc-800/50 rounded-lg md:rounded-xl p-3 md:p-4 border border-zinc-700/50">
        <div className="flex items-center gap-2 mb-2 md:mb-3">
          <FileText className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
          <span className="text-zinc-300 text-xs md:text-sm">Comprovante</span>
        </div>
        <div className="space-y-1.5 md:space-y-2 text-[10px] md:text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-500">Tipo</span>
            <span className="text-zinc-300">Transferencia</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Valor</span>
            <span className="text-emerald-400">R$ 250,00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">ID</span>
            <span className="text-zinc-400">#TRF-847291</span>
          </div>
        </div>
        <div className="h-7 md:h-8 bg-zinc-700/50 rounded-lg flex items-center justify-center mt-2 md:mt-3">
          <span className="text-zinc-300 text-[10px] md:text-xs">Baixar PDF</span>
        </div>
      </div>
    </div>
  )
}

function CardMockup({ type }: { type: string }) {
  switch (type) {
    case "deposits":
      return <DepositsMockup />
    case "transfers":
      return <TransfersMockup />
    case "history":
      return <HistoryMockup />
    case "users":
      return <UsersMockup />
    case "fees":
      return <FeesMockup />
    case "receipts":
      return <ReceiptsMockup />
    default:
      return null
  }
}

export function WorkflowsSection() {
  const [scrollPosition, setScrollPosition] = useState(0)

  // Calculate max scroll based on screen size (we'll use 1 for mobile, 2 for tablet, 4 for desktop)
  const getMaxScroll = () => {
    if (typeof window === "undefined") return carouselCards.length - 1
    if (window.innerWidth < 640) return carouselCards.length - 1
    if (window.innerWidth < 1024) return carouselCards.length - 2
    return carouselCards.length - 4
  }

  const scrollLeft = () => {
    setScrollPosition(Math.max(0, scrollPosition - 1))
  }

  const scrollRight = () => {
    setScrollPosition(Math.min(getMaxScroll(), scrollPosition + 1))
  }

  return (
    <section id="como-funciona" className="relative py-16 md:py-24" style={{ backgroundColor: "#09090B" }}>
      {/* Top gradient */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "20%",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.05), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 md:gap-8 mb-10 md:mb-16">
          <div className="lg:max-w-xl">
            {/* Emerald indicator */}
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs md:text-sm text-zinc-400">Como funciona</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-zinc-600" />
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white leading-[1.1]">
              Simples, rapido
              <br />
              e sem complicacao
            </h2>
          </div>

          {/* Description */}
          <p className="text-zinc-400 text-sm md:text-base lg:max-w-sm lg:pt-12">
            Deposite dinheiro na sua carteira e transfira para qualquer pessoa. Sem saque externo, apenas movimentacao
            dentro da plataforma.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div
            className="flex gap-3 md:gap-4 transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${scrollPosition * (100)}%)` }}
          >
            {carouselCards.map((card) => (
              <div 
                key={card.id} 
                className="flex-shrink-0 w-[85%] sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
              >
                <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden h-[280px] md:h-[340px] flex flex-col">
                  {/* Mockup area */}
                  <div className="flex-1 relative overflow-hidden">
                    <CardMockup type={card.mockup} />
                    {/* Fade overlay */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-12 md:h-16 pointer-events-none"
                      style={{
                        background: "linear-gradient(to top, rgba(9,9,11,0.9), transparent)",
                      }}
                    />
                  </div>

                  {/* Card footer */}
                  <div className="p-3 md:p-4 border-t border-zinc-800/30">
                    <div className="flex items-center justify-between gap-2 md:gap-3">
                      {/* Text content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] md:text-xs text-zinc-500 mb-0.5 md:mb-1">{card.category}</p>
                        <p className="text-xs md:text-sm text-zinc-200 leading-snug line-clamp-2">{card.title}</p>
                      </div>
                      {/* Icon button */}
                      <button className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 hover:text-emerald-400 hover:border-emerald-500 transition-colors">
                        <card.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center justify-center gap-2 mt-6 md:mt-8">
          <button
            onClick={scrollLeft}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={scrollPosition === 0}
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={scrollRight}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            disabled={scrollPosition >= carouselCards.length - 1}
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
