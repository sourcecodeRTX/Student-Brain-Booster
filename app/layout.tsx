import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Student Brain Booster - AI Education Assistant",
  description:
    "AI-powered education assistant for all students. Get instant help with any subject at any education level using advanced AI technology.",
  keywords: "education, AI, student, study, learning, tutor, all subjects, all levels",
  authors: [{ name: "Ratty Ram", email: "rattyramraj@gmail.com" }],
  openGraph: {
    title: "Student Brain Booster - AI Education Assistant",
    description: "AI-powered education assistant for all students",
    type: "website",
    url: "https://student-brain-booster.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Brain Booster - AI Education Assistant",
    description: "AI-powered education assistant for all students",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#667eea" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
