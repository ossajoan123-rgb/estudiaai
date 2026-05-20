// components/dashboard/TopBar.tsx
'use client'
import { usePathname } from 'next/navigation'
import { Bell, Search } from 'lucide-react'
import { useState } from 'react'

const pageLabels: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: '¡Hola de nuevo! 👋', subtitle: 'Aquí está tu resumen de hoy' },
  '/academic': { title: 'Gestión Académica 📚', subtitle: 'Materias, notas y tareas' },
  '/habits': { title: 'Mis Hábitos 🎯', subtitle: 'Construye rutinas ganadoras' },
  '/wellness': { title: 'Bienestar Emocional 💚', subtitle: 'Cuida tu mente y energía' },
  '/recommendations': { title: 'Recomendaciones ✨', subtitle: 'Consejos personalizados para ti' },
  '/settings': { title: 'Configuración ⚙️', subtitle: 'Personaliza tu experiencia' },
}

interface TopBarProps {
  user: { name?: string | null }
}

export function TopBar({ user }: TopBarProps) {
  const pathname = usePathname()
  const page = pageLabels[pathname] ?? { title: 'EstudiaAI', subtitle: '' }
  const [searchOpen, setSearchOpen] = useState(false)

  // Format date
  const today = new Date()
  const dateStr = today.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })
  const dateFormatted = dateStr.charAt(0).toUpperCase() + dateStr.slice(1)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-4 border-b"
      style={{
        background: 'rgba(10,10,22,0.85)',
        backdropFilter: 'blur(20px)',
        borderColor: 'var(--surface-border)',
      }}>
      {/* Left - page title */}
      <div className="min-w-0 pl-12 lg:pl-0">
        <h1 className="text-lg font-bold truncate" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          {page.title}
        </h1>
        <p className="text-xs hidden sm:block" style={{ color: 'var(--text-muted)' }}>
          {page.subtitle} · {dateFormatted}
        </p>
      </div>

      {/* Right - actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button onClick={() => setSearchOpen(!searchOpen)}
          className="btn-ghost p-2 rounded-xl"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)' }}>
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button className="btn-ghost p-2 rounded-xl relative"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)' }}>
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          {user.name?.charAt(0) ?? 'U'}
        </div>
      </div>
    </header>
  )
}
