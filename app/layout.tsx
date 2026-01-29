import React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { PWAProvider } from "@/lib/pwa-context"
import { ProtecaoFrontend } from "@/components/protecao-frontend"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "fluxpay - Carteira Digital",
  description:
    "Sua carteira digital para depositos e transferencias via PIX e criptomoedas. Taxas justas e transparentes.",
  manifest: "/manifest.json",
  keywords: ["carteira digital", "pix", "criptomoedas", "transferencias", "depositos", "fintech"],
  authors: [{ name: "fluxpay" }],
  creator: "fluxpay",
  publisher: "fluxpay",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://fluxpay.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "fluxpay - Carteira Digital",
    description: "Sua carteira digital para depositos e transferencias via PIX e criptomoedas.",
    url: "https://fluxpay.com",
    siteName: "fluxpay",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "fluxpay - Carteira Digital",
    description: "Sua carteira digital para depositos e transferencias via PIX e criptomoedas.",
    creator: "@fluxpay",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "fluxpay",
    startupImage: ["/icons/icon-512x512.png"],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10B981" },
    { media: "(prefers-color-scheme: dark)", color: "#09090B" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="fluxpay" />
        <meta name="application-name" content="fluxpay" />
        <meta name="msapplication-TileColor" content="#09090B" />
        <meta name="msapplication-tap-highlight" content="no" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                window.deferredInstallPrompt = e;
              });
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ProtecaoFrontend />
        <AuthProvider>
          <PWAProvider>{children}</PWAProvider>
        </AuthProvider>
        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
