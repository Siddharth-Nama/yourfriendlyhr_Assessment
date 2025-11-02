import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/lib/theme-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FitAI Coach - Your AI-Powered Personal Fitness Assistant",
  description:
    "Get personalized AI-generated workout plans, diet plans, and fitness guidance tailored to your goals, fitness level, and preferences.",
  keywords: "fitness coach, AI fitness, personal training, workout plans, diet plans, health, exercise",
  authors: [{ name: "FitAI Coach" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fitai-coach.vercel.app",
    siteName: "FitAI Coach",
    title: "FitAI Coach - Your AI-Powered Personal Fitness Assistant",
    description:
      "Get personalized AI-generated workout plans, diet plans, and fitness guidance tailored to your goals.",
    images: [
      {
        url: "https://fitai-coach.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FitAI Coach - AI Fitness Planning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FitAI Coach",
    description: "Your AI-Powered Personal Fitness Assistant",
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
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f97316" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${_geist.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
