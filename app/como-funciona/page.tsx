"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { 
  Wallet, 
  ArrowDownToLine, 
  ArrowLeftRight, 
  History, 
  Shield, 
  Zap,
  ChevronDown,
  Users,
  Building2,
  Globe
} from "lucide-react"
import { useState } from "react"

const steps = [
  {
    number: "01",
    title: "Crie sua conta",
    description: "Cadastre-se em menos de 2 minutos com seu email ou Google. Verificacao rapida e segura.",
    icon: Users,
  },
  {
    number: "02", 
    title: "Adicione saldo",
    description: "Faca depositos via PIX ou criptomoedas. Seu saldo fica disponivel instantaneamente.",
    icon: ArrowDownToLine,
  },
  {
    number: "03",
    title: "Transfira para qualquer pessoa",
    description: "Envie dinheiro para outros usuarios fluxpay de forma instantanea e com taxas justas.",
    icon: ArrowLeftRight,
  },
  {
    number: "04",
    title: "Gerencie tudo",
    description: "Acompanhe seu saldo, historico de transacoes e extrato completo em tempo real.",
    icon: History,
  },
]

const values = [
  {
    icon: Shield,
    title: "Seguranca em primeiro lugar",
    description: "Criptografia de ponta a ponta e protecao avancada contra fraudes em todas as transacoes.",
  },
  {
    icon: Zap,
    title: "Velocidade sem compromisso",
    description: "Transferencias instantaneas 24/7. Seu dinheiro chega em segundos, nao em dias.",
  },
  {
    icon: Globe,
    title: "Acessivel para todos",
    description: "Uma carteira digital publica que qualquer pessoa ou empresa pode usar facilmente.",
  },
  {
    icon: Building2,
    title: "Feito para escalar",
    description: "Infraestrutura robusta que suporta desde microtransacoes ate operacoes empresariais.",
  },
]

const faqs = [
  {
    question: "O que e o fluxpay?",
    answer: "fluxpay e uma carteira digital publica que permite depositos e transferencias entre usuarios. Nao existe saque externo - o dinheiro circula dentro do ecossistema, garantindo seguranca e velocidade nas transacoes."
  },
  {
    question: "Como funcionam as taxas?",
    answer: "Nossas taxas sao progressivas e transparentes. Quanto maior o valor da transacao, menor a taxa percentual. PIX: 0,5%. Crypto: 1,0%. Transferencias: 0,5% a 1,0% dependendo do valor."
  },
  {
    question: "Quanto tempo demora uma transferencia?",
    answer: "Transferencias entre usuarios fluxpay sao instantaneas, 24 horas por dia, 7 dias por semana. O valor e creditado na conta do destinatario em segundos apos a confirmacao."
  },
  {
    question: "Posso usar como empresa?",
    answer: "Sim! O fluxpay foi desenvolvido tanto para pessoas fisicas quanto para empresas. Oferecemos recursos especiais para negocios como relatorios detalhados, multiplos usuarios e integracao via API."
  },
  {
    question: "O fluxpay e seguro?",
    answer: "Absolutamente. Utilizamos criptografia de ponta a ponta, autenticacao em duas etapas (2FA), PIN de 6 digitos e sistemas avancados de deteccao de fraudes. Seus dados e seu dinheiro estao protegidos."
  },
  {
    question: "Como faco depositos?",
    answer: "Voce pode adicionar saldo via PIX (instantaneo) ou criptomoedas (BTC, ETH, USDT, LTC). Escolha o metodo mais conveniente e o valor sera creditado conforme o prazo de cada opcao."
  },
  {
    question: "Existe limite de transacoes?",
    answer: "Contas verificadas tem limites generosos que atendem a maioria dos usuarios. Para limites maiores, entre em contato com nosso suporte para uma analise personalizada da sua conta."
  },
  {
    question: "Posso cancelar uma transferencia?",
    answer: "Como as transferencias sao instantaneas, nao e possivel cancela-las apos a confirmacao. Por isso, sempre verifique os dados do destinatario antes de confirmar qualquer envio."
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-zinc-800 last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 sm:py-6 flex items-center justify-between text-left hover:text-emerald-400 transition-colors"
      >
        <span className="text-white font-medium text-base sm:text-lg pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-zinc-500 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-4 sm:pb-6" : "max-h-0"}`}>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen bg-[#09090B] overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 sm:mb-6">
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span className="text-emerald-400 text-xs sm:text-sm font-medium">Sobre o fluxpay</span>
            </div>
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 sm:mb-6 px-2"
              style={{
                letterSpacing: "-0.0325em",
                fontVariationSettings: '"opsz" 28',
                fontWeight: 538,
                lineHeight: 1.1,
              }}
            >
              A carteira digital<br />
              <span className="text-emerald-400">do futuro</span>
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-2">
              Construida para simplificar a forma como voce movimenta dinheiro. 
              Depositos rapidos, transferencias instantaneas e total transparencia nas taxas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900"
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Como o fluxpay funciona"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>
          <p className="text-zinc-500 text-xs sm:text-sm text-center mt-3 sm:mt-4 px-2">Assista ao video e descubra como o fluxpay pode transformar sua forma de lidar com dinheiro</p>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-3 sm:mb-4"
              style={{
                letterSpacing: "-0.0325em",
                fontVariationSettings: '"opsz" 28',
                fontWeight: 538,
              }}
            >
              Como funciona
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto px-2">
              Em 4 passos simples voce comeca a usar o fluxpay
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/30 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <span className="text-3xl sm:text-4xl font-bold text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors">{step.number}</span>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <step.icon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  </div>
                </div>
                <h3 className="text-white font-medium text-base sm:text-lg mb-1.5 sm:mb-2">{step.title}</h3>
                <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-3 sm:mb-4"
              style={{
                letterSpacing: "-0.0325em",
                fontVariationSettings: '"opsz" 28',
                fontWeight: 538,
              }}
            >
              Nossos valores
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto px-2">
              O que nos move todos os dias
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-5 sm:p-8 rounded-xl sm:rounded-2xl bg-zinc-900/50 border border-zinc-800"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3 sm:mb-4">
                  <value.icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                </div>
                <h3 className="text-white font-medium text-lg sm:text-xl mb-1.5 sm:mb-2">{value.title}</h3>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-3 sm:mb-4"
              style={{
                letterSpacing: "-0.0325em",
                fontVariationSettings: '"opsz" 28',
                fontWeight: 538,
              }}
            >
              Perguntas frequentes
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto px-2">
              Tire suas duvidas sobre o fluxpay
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-800 p-4 sm:p-6 md:p-8"
          >
            {faqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
