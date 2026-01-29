"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { DashboardMockup } from "./dashboard-mockup"
import { Navbar } from "./navbar"
import { LogoCloud } from "./logo-cloud"
import { FeatureCardsSection } from "./feature-cards-section"
import { AISection } from "./ai-section"
import { ProductDirectionSection } from "./product-direction-section"
import { WorkflowsSection } from "./workflows-section"
import { DownloadAppSection } from "./download-app-section"
import { CTASection } from "./cta-section"
import { Footer } from "./footer"

export function Hero3DStage() {
  const [yOffset, setYOffset] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()

    const handleScroll = () => {
      setYOffset(Math.min(window.scrollY / 300, 1) * -20)
    }

    window.addEventListener("resize", checkMobile)
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const baseTransform = {
    translateX: 2,
    scale: isMobile ? 0.8 : 1.2,
    rotateX: 47,
    rotateY: 31,
    rotateZ: 324,
  }

  return (
    <section className="relative min-h-screen overflow-hidden" style={{ backgroundColor: "#09090B" }}>
      <Navbar />

      {/* Glow de fundo */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -30%)",
          width: isMobile ? "600px" : "1200px",
          height: isMobile ? "400px" : "800px",
          background: "radial-gradient(ellipse at center, rgba(16,185,129,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Conteúdo clicável */}
      <div className="relative z-20 pt-24 md:pt-28 flex flex-col">
        <div className="w-full flex justify-center px-4 md:px-6 mt-10 md:mt-16">
          <div className="w-full max-w-4xl relative z-30">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] text-white leading-[1.1]"
            >
              Sua carteira digital para <span className="text-emerald-400">PIX</span> e{" "}
              <span className="text-orange-400">Criptomoedas</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 md:mt-6 text-sm md:text-lg text-zinc-400"
            >
              Deposite, transfira e gerencie seu dinheiro digital. Taxas justas e transparentes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 md:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
            >
              <Link
                href="/login?registrar=true"
                className="relative z-40 w-full sm:w-auto text-center px-6 py-3 bg-emerald-500 text-zinc-900 font-medium rounded-xl hover:bg-emerald-400 transition-colors text-sm"
              >
                Criar conta grátis
              </Link>

              <Link
                href="/changelog"
                className="relative z-40 text-zinc-300 font-medium hover:text-white transition-colors flex items-center gap-2 text-sm"
              >
                Novidades →
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Mockup 3D, somente visual */}
        <div
          className="relative mt-8 md:mt-16 hidden md:block pointer-events-none"
          style={{
            width: "100vw",
            marginLeft: "-50vw",
            marginRight: "-50vw",
            left: "50%",
            right: "50%",
            height: "700px",
            marginTop: "-60px",
          }}
        >
          <div
            className="absolute bottom-0 left-0 right-0 h-72 pointer-events-none"
            style={{ background: "linear-gradient(to top, #09090B 20%, transparent 100%)" }}
          />

          <div
            className="pointer-events-none"
            style={{
              transform: `translateY(${yOffset}px)`,
              transition: "transform 0.1s ease-out",
              perspective: "4000px",
              perspectiveOrigin: "100% 0",
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            <motion.div
              className="pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              style={{
                backgroundColor: "#09090B",
                transformOrigin: "0 0",
                border: "1px solid #1e1e1e",
                borderRadius: "10px",
                width: "1600px",
                height: "900px",
                margin: "280px auto auto",
                position: "absolute",
                inset: 0,
                transform: `translate(${baseTransform.translateX}%) scale(${baseTransform.scale}) rotateX(${baseTransform.rotateX}deg) rotateY(${baseTransform.rotateY}deg) rotate(${baseTransform.rotateZ}deg)`,
                overflow: "hidden",
              }}
            >
              <DashboardMockup />
            </motion.div>
          </div>
        </div>

        <LogoCloud />
        <FeatureCardsSection />
        <AISection />
        <ProductDirectionSection />
        <WorkflowsSection />
        <DownloadAppSection />
        <CTASection />
        <Footer />
      </div>
    </section>
  )
}
