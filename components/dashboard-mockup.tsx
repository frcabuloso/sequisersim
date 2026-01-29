"use client"

import type React from "react"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  ArrowDownToLine,
  ArrowLeftRight,
  Users,
  History,
  Percent,
  Settings,
  HelpCircle,
  ChevronDown,
  Search,
  Bell,
  Plus,
  MoreHorizontal,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Code,
} from "lucide-react"

export function DashboardMockup() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
  }

  const panelVariants = {
    hidden: {
      opacity: 0,
      x: 100,
      y: -80,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <motion.div
      className="w-full h-full bg-zinc-950 flex overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Sidebar */}
      <motion.div
        className="w-[220px] h-full bg-zinc-900/80 border-r border-zinc-800/50 flex flex-col shrink-0"
        variants={panelVariants}
      >
        {/* Logo */}
        <div className="p-3 border-b border-zinc-800/50">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-zinc-900" />
            </div>
            <span className="text-white font-semibold text-sm">fluxpay</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 ml-auto" />
          </div>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-800/50 rounded-md text-zinc-500 text-xs">
            <Search className="w-3.5 h-3.5" />
            <span>Buscar...</span>
            <span className="ml-auto text-[10px] bg-zinc-700/50 px-1.5 py-0.5 rounded">⌘K</span>
          </div>
        </div>

        {/* Main nav */}
        <div className="px-3 space-y-0.5">
          <NavItem icon={LayoutDashboard} label="Dashboard" active />
          <NavItem icon={Wallet} label="Carteira" />
          <NavItem icon={ArrowDownToLine} label="Depositos" badge={3} />
          <NavItem icon={ArrowLeftRight} label="Transferencias" />
          <NavItem icon={History} label="Extrato" />
          <NavItem icon={Users} label="Contatos" />
        </div>

        {/* Integrations section */}
        <div className="mt-5 px-3">
          <div className="px-2 py-1 text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
            Desenvolvedor
          </div>
          <div className="space-y-0.5 mt-1">
            <NavItem icon={Code} label="API" />
            <NavItem icon={Percent} label="Taxas" />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-auto p-3 border-t border-zinc-800/50 space-y-0.5">
          <NavItem icon={Settings} label="Configuracoes" />
          <NavItem icon={HelpCircle} label="Ajuda" />
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div className="flex-1 h-full bg-zinc-950 flex flex-col overflow-hidden" variants={panelVariants}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800/50 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-white font-semibold text-lg">Dashboard</h1>
            <p className="text-zinc-500 text-xs">Visao geral da sua carteira</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-zinc-500 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-zinc-900 text-xs font-medium rounded-lg hover:bg-emerald-400 transition-colors">
              <Plus className="w-3.5 h-3.5" />
              Novo deposito
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 grid grid-cols-4 gap-4">
          <StatCard
            icon={Wallet}
            iconColor="text-emerald-400"
            iconBg="bg-emerald-500/20"
            label="Saldo disponivel"
            value="R$ 8.472,50"
            trend="Ativo"
            trendUp
          />
          <StatCard
            icon={ArrowDownToLine}
            iconColor="text-blue-400"
            iconBg="bg-blue-500/20"
            label="Em processamento"
            value="R$ 1.250,00"
            trend="2 depositos"
            trendUp
          />
          <StatCard
            icon={ArrowUpRight}
            iconColor="text-purple-400"
            iconBg="bg-purple-500/20"
            label="Entradas (30d)"
            value="R$ 15.840,00"
            trend="+23%"
            trendUp
          />
          <StatCard
            icon={ArrowDownRight}
            iconColor="text-orange-400"
            iconBg="bg-orange-500/20"
            label="Saidas (30d)"
            value="R$ 12.340,00"
            trend="47 transf."
            trendUp={false}
          />
        </div>

        {/* Recent transactions */}
        <div className="flex-1 px-6 pb-6 overflow-hidden">
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl h-full flex flex-col">
            <div className="px-4 py-3 border-b border-zinc-800/50 flex items-center justify-between">
              <h3 className="text-white font-medium text-sm">Atividade recente</h3>
              <button className="text-zinc-500 hover:text-white transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <TransactionItem
                type="deposit"
                description="Deposito via Pix"
                user="Voce"
                amount="+R$ 500,00"
                status="completed"
                time="ha 5 min"
              />
              <TransactionItem
                type="transfer"
                description="Transferencia enviada"
                user="@mariasantos"
                amount="-R$ 150,00"
                status="completed"
                time="ha 1h"
              />
              <TransactionItem
                type="deposit"
                description="Deposito via Pix"
                user="Voce"
                amount="+R$ 1.000,00"
                status="processing"
                time="ha 3h"
              />
              <TransactionItem
                type="transfer"
                description="Transferencia recebida"
                user="@joaosilva"
                amount="+R$ 250,00"
                status="completed"
                time="ha 5h"
              />
              <TransactionItem
                type="transfer"
                description="Transferencia enviada"
                user="@pedrocosta"
                amount="-R$ 75,00"
                status="completed"
                time="ha 8h"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function NavItem({
  icon: Icon,
  label,
  badge,
  active,
  color,
}: {
  icon: React.ElementType
  label: string
  badge?: number
  active?: boolean
  color?: string
}) {
  return (
    <div
      className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
        active ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300"
      }`}
    >
      <Icon className={`w-4 h-4 ${color || ""}`} />
      <span className="flex-1 text-xs">{label}</span>
      {badge && (
        <span className="bg-emerald-500/80 text-zinc-900 text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-medium px-1">
          {badge}
        </span>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  trend,
  trendUp,
}: {
  icon: React.ElementType
  iconColor: string
  iconBg: string
  label: string
  value: string
  trend: string
  trendUp: boolean
}) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <span className={`text-xs ${trendUp ? "text-emerald-400" : "text-zinc-400"}`}>
          {trend}
        </span>
      </div>
      <p className="text-zinc-500 text-xs mb-1">{label}</p>
      <p className="text-white font-semibold text-lg">{value}</p>
    </div>
  )
}

function TransactionItem({
  type,
  description,
  user,
  amount,
  status,
  time,
}: {
  type: "deposit" | "transfer"
  description: string
  user: string
  amount: string
  status: "completed" | "processing" | "failed"
  time: string
}) {
  const statusConfig = {
    completed: { label: "Concluido", color: "bg-emerald-500/20 text-emerald-400" },
    processing: { label: "Processando", color: "bg-yellow-500/20 text-yellow-400" },
    failed: { label: "Falhou", color: "bg-red-500/20 text-red-400" },
  }

  const isPositive = amount.startsWith("+")

  return (
    <div className="px-4 py-3 border-b border-zinc-800/30 flex items-center justify-between hover:bg-zinc-800/20 transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          type === "deposit" ? "bg-emerald-500/20" : "bg-blue-500/20"
        }`}>
          {type === "deposit" ? (
            <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
          ) : (
            <ArrowLeftRight className="w-4 h-4 text-blue-400" />
          )}
        </div>
        <div>
          <p className="text-white text-xs font-medium">{description}</p>
          <p className="text-zinc-600 text-[10px]">{user}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusConfig[status].color}`}>
          {statusConfig[status].label}
        </span>
        <p className={`text-xs font-medium w-24 text-right ${isPositive ? "text-emerald-400" : "text-zinc-300"}`}>
          {amount}
        </p>
        <p className="text-zinc-600 text-[10px] w-16 text-right">{time}</p>
      </div>
    </div>
  )
}
