// app/not-found.tsx
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center p-6"
      style={{ background: 'var(--surface-bg)' }}>
      <div className="orb orb-brand w-96 h-96 top-0 left-0 fixed opacity-20 pointer-events-none" />
      <div className="relative max-w-md">
        <div className="text-8xl mb-6">📚</div>
        <h1 className="text-6xl font-bold mb-4 gradient-text" style={{ fontFamily: 'var(--font-display)' }}>404</h1>
        <p className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Página no encontrada</p>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          Esta página no existe, pero tu potencial académico sí. 🚀
        </p>
        <Link href="/dashboard" className="btn-primary">
          <BookOpen className="w-4 h-4" /> Volver al Dashboard
        </Link>
      </div>
    </div>
  )
}
