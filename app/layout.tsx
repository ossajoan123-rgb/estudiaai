// app/layout.tsx

import type { Metadata, Viewport } from 'next'

import './globals.css'

import { Providers } from '@/components/shared/Providers'

import { Toaster } from 'sonner'

import AdvisorChat from '@/components/ai/AdvisorChat'

export const metadata: Metadata = {
  title: {
    default: 'EstudiaAI — Tu compañero académico inteligente',
    template: '%s | EstudiaAI',
  },

  description:
    'Plataforma inteligente que ayuda a estudiantes a mejorar su rendimiento académico, hábitos de estudio y bienestar emocional.',

  keywords: [
    'estudio',
    'académico',
    'hábitos',
    'productividad',
    'bienestar',
    'IA',
    'estudiantes',
  ],

  authors: [
    {
      name: 'EstudiaAI',
    },
  ],

  creator: 'EstudiaAI',

  openGraph: {
    type: 'website',

    locale: 'es_CO',

    url: process.env.NEXT_PUBLIC_APP_URL,

    title:
      'EstudiaAI — Tu compañero académico inteligente',

    description:
      'Mejora tu rendimiento académico con IA personalizada.',

    siteName: 'EstudiaAI',
  },

  twitter: {
    card: 'summary_large_image',

    title: 'EstudiaAI',

    description:
      'Tu compañero académico inteligente.',
  },

  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a16',

  width: 'device-width',

  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (

    <html
      lang="es"
      suppressHydrationWarning
    >

      <head>

        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

      </head>

      <body
        className="antialiased"
        style={{
          fontFamily: 'var(--font-body)',
        }}
      >

        <Providers>

          {children}

          {/* CHAT IA */}

          <AdvisorChat />

          {/* TOASTS */}

          <Toaster
            position="top-right"

            richColors

            theme="dark"

            toastOptions={{
              style: {
                background: '#12122a',

                border:
                  '1px solid rgba(99,102,241,0.2)',

                color: '#f1f2ff',
              },
            }}
          />

        </Providers>

      </body>

    </html>
  )
}