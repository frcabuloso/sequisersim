"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { FileText, Shield, Scale, AlertCircle } from "lucide-react"
import Link from "next/link"

const sections = [
  {
    id: "introducao",
    title: "1. Introducao",
    content: `Bem-vindo ao fluxpay. Estes Termos de Uso ("Termos") regem o uso da plataforma fluxpay, incluindo nosso site, aplicativos e todos os servicos relacionados (coletivamente, o "Servico").

Ao acessar ou usar o Servico, voce concorda em estar vinculado a estes Termos. Se voce nao concordar com qualquer parte destes Termos, nao podera acessar o Servico.

O fluxpay e uma carteira digital publica que permite depositos e transferencias entre usuarios. Nao oferecemos servicos de saque externo - o dinheiro circula exclusivamente dentro do ecossistema fluxpay.`
  },
  {
    id: "definicoes",
    title: "2. Definicoes",
    content: `Para os fins destes Termos:

- "fluxpay", "nos", "nosso" refere-se a fluxpay Pagamentos Ltda.
- "Usuario", "voce", "seu" refere-se a qualquer pessoa que acesse ou use o Servico.
- "Conta" refere-se a sua conta registrada no fluxpay.
- "Carteira" refere-se ao saldo disponivel em sua Conta.
- "Deposito" refere-se a adicao de fundos a sua Carteira.
- "Transferencia" refere-se a movimentacao de fundos entre Carteiras de diferentes Usuarios.
- "Taxa" refere-se aos valores cobrados pelo uso dos servicos.`
  },
  {
    id: "elegibilidade",
    title: "3. Elegibilidade",
    content: `Para usar o fluxpay, voce deve:

- Ter pelo menos 18 anos de idade
- Ser residente no Brasil
- Possuir CPF valido e ativo
- Fornecer informacoes verdadeiras, precisas e completas durante o cadastro
- Manter suas informacoes de conta atualizadas

Reservamo-nos o direito de recusar o servico, encerrar contas ou remover conteudo a nosso exclusivo criterio.`
  },
  {
    id: "conta",
    title: "4. Sua Conta",
    content: `Ao criar uma conta, voce e responsavel por:

- Manter a confidencialidade de suas credenciais de acesso
- Todas as atividades que ocorrem em sua conta
- Notificar-nos imediatamente sobre qualquer uso nao autorizado

Voce nao deve:

- Criar mais de uma conta pessoal
- Compartilhar suas credenciais com terceiros
- Usar a conta de outra pessoa
- Transferir sua conta para terceiros sem nossa autorizacao`
  },
  {
    id: "servicos",
    title: "5. Servicos",
    content: `O fluxpay oferece os seguintes servicos:

DEPOSITOS
- Adicione fundos a sua Carteira via Pix ou criptomoedas
- Depositos via Pix sao creditados instantaneamente
- Depositos via criptomoedas podem levar de 10 a 30 minutos
- Taxas aplicaveis conforme tabela vigente

TRANSFERENCIAS
- Envie dinheiro para outros usuarios fluxpay instantaneamente
- Transferencias sao irreversiveis apos confirmacao
- Verifique sempre os dados do destinatario antes de confirmar
- Taxas aplicaveis conforme tabela vigente

IMPORTANTE: O fluxpay NAO oferece servicos de saque para contas bancarias externas. Os fundos podem ser utilizados apenas para transferencias dentro da plataforma.`
  },
  {
    id: "taxas",
    title: "6. Taxas",
    content: `As taxas do fluxpay sao transparentes e progressivas:

DEPOSITOS
- Ate R$ 100,00: 1,5%
- De R$ 100,01 a R$ 1.000,00: 1,0%
- Acima de R$ 1.000,00: 0,5%

TRANSFERENCIAS
- Ate R$ 100,00: 1,0%
- De R$ 100,01 a R$ 1.000,00: 0,75%
- Acima de R$ 1.000,00: 0,5%

As taxas sao sempre exibidas antes da confirmacao de qualquer operacao. Reservamo-nos o direito de alterar as taxas mediante aviso previo de 30 dias.`
  },
  {
    id: "seguranca",
    title: "7. Seguranca",
    content: `Implementamos medidas de seguranca para proteger suas informacoes:

- Criptografia de ponta a ponta em todas as transacoes
- Autenticacao em duas etapas (2FA)
- Monitoramento continuo contra fraudes
- Armazenamento seguro de dados

Voce e responsavel por:

- Manter suas credenciais em seguranca
- Usar senhas fortes e unicas
- Habilitar a autenticacao em duas etapas
- Reportar atividades suspeitas imediatamente`
  },
  {
    id: "privacidade",
    title: "8. Privacidade",
    content: `Coletamos e processamos seus dados pessoais conforme nossa Politica de Privacidade, que faz parte integrante destes Termos.

DADOS COLETADOS
- Informacoes de cadastro (nome, CPF, endereco, etc.)
- Dados de transacoes
- Informacoes de dispositivo e navegacao
- Comunicacoes com nosso suporte

USO DOS DADOS
- Fornecer e melhorar nossos servicos
- Processar transacoes
- Prevenir fraudes
- Cumprir obrigacoes legais
- Comunicar novidades e atualizacoes

Nao vendemos seus dados pessoais a terceiros.`
  },
  {
    id: "proibicoes",
    title: "9. Uso Proibido",
    content: `Voce concorda em NAO usar o fluxpay para:

- Atividades ilegais ou fraudulentas
- Lavagem de dinheiro ou financiamento ao terrorismo
- Venda de produtos ou servicos ilegais
- Jogos de azar nao autorizados
- Piramides financeiras ou esquemas Ponzi
- Violacao de direitos de propriedade intelectual
- Assedio, ameacas ou intimidacao de outros usuarios
- Tentativas de hackear ou comprometer nossos sistemas
- Criar contas falsas ou usar identidades de terceiros
- Qualquer atividade que viole leis aplicaveis

Violacoes podem resultar em suspensao ou encerramento permanente da conta, alem de medidas legais cabiveis.`
  },
  {
    id: "limitacao",
    title: "10. Limitacao de Responsabilidade",
    content: `O SERVICO E FORNECIDO "COMO ESTA" E "CONFORME DISPONIBILIDADE".

Na maxima extensao permitida por lei, o fluxpay nao sera responsavel por:

- Perda de lucros, dados ou oportunidades de negocios
- Danos indiretos, incidentais ou consequentes
- Acoes de terceiros ou outros usuarios
- Interrupcoes de servico ou manutencoes
- Erros causados por informacoes incorretas fornecidas por voce
- Transferencias realizadas para destinatarios errados por sua culpa

Nossa responsabilidade total esta limitada ao valor das taxas pagas por voce nos ultimos 12 meses.`
  },
  {
    id: "alteracoes",
    title: "11. Alteracoes nos Termos",
    content: `Podemos modificar estes Termos a qualquer momento. Alteracoes materiais serao notificadas com pelo menos 30 dias de antecedencia atraves de:

- Email para o endereco cadastrado
- Notificacao no aplicativo
- Aviso em nosso site

O uso continuado do Servico apos as alteracoes entrarem em vigor constitui sua aceitacao dos novos Termos.

Se voce nao concordar com as alteracoes, devera encerrar sua conta antes que entrem em vigor.`
  },
  {
    id: "encerramento",
    title: "12. Encerramento",
    content: `ENCERRAMENTO POR VOCE
Voce pode encerrar sua conta a qualquer momento atraves das configuracoes do aplicativo ou entrando em contato com nosso suporte.

ENCERRAMENTO POR NOS
Podemos suspender ou encerrar sua conta se:

- Voce violar estes Termos
- Suspeitarmos de atividade fraudulenta
- Formos obrigados por lei ou ordem judicial
- O servico for descontinuado

APOS O ENCERRAMENTO
- Voce devera transferir qualquer saldo remanescente para outros usuarios
- Saldos nao transferidos em 90 dias serao tratados conforme legislacao aplicavel
- Manteremos registros conforme exigido por lei`
  },
  {
    id: "contato",
    title: "13. Contato",
    content: `Para duvidas sobre estes Termos ou nossos servicos:

Email: juridico@fluxpay.com.br
Suporte: suporte@fluxpay.com.br
Telefone: 0800 123 4567

Endereco:
fluxpay Pagamentos Ltda.
Av. Paulista, 1000 - 10o andar
Sao Paulo - SP, 01310-100
CNPJ: 00.000.000/0001-00`
  },
]

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-[#09090B]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">Legal</span>
            </div>
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 sm:mb-6"
              style={{
                letterSpacing: "-0.0325em",
                fontVariationSettings: '"opsz" 28',
                fontWeight: 538,
                lineHeight: 1.1,
              }}
            >
              Termos de Uso
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed mb-8">
              Leia atentamente estes termos antes de usar o fluxpay. Eles estabelecem seus direitos e responsabilidades como usuario da nossa plataforma.
            </p>
            <p className="text-zinc-500 text-sm">
              Ultima atualizacao: 15 de Janeiro de 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
              <Shield className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-white font-medium mb-2">Seguranca</h3>
              <p className="text-zinc-500 text-sm">Seus dados estao protegidos com criptografia de ponta</p>
            </div>
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
              <Scale className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-white font-medium mb-2">Transparencia</h3>
              <p className="text-zinc-500 text-sm">Taxas claras e sem surpresas em nenhuma operacao</p>
            </div>
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
              <AlertCircle className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-white font-medium mb-2">Suporte</h3>
              <p className="text-zinc-500 text-sm">Estamos disponiveis para ajudar sempre que precisar</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6"
          >
            <h2 className="text-white font-medium text-lg mb-4">Indice</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-zinc-400 hover:text-emerald-400 text-sm transition-colors py-1"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="scroll-mt-32"
              >
                <h2 className="text-white font-medium text-2xl mb-4">{section.title}</h2>
                <div className="text-zinc-400 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-b from-zinc-900/80 to-zinc-900/50 border border-zinc-800 rounded-3xl p-12"
          >
            <h2 
              className="text-2xl sm:text-3xl text-white mb-4"
              style={{
                letterSpacing: "-0.0325em",
                fontVariationSettings: '"opsz" 28',
                fontWeight: 538,
              }}
            >
              Tem duvidas?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              Nossa equipe de suporte esta pronta para ajudar com qualquer questao sobre nossos termos ou servicos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/como-funciona"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-medium rounded-xl transition-colors"
              >
                Falar com suporte
              </Link>
              <Link
                href="/como-funciona"
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition-colors"
              >
                Ver FAQ
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
