// components/landing/Footer.tsx
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export function LandingFooter() {
  return (
    <footer className="border-t py-12" style={{ borderColor: 'var(--surface-border)', background: 'var(--surface-1)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>EstudiaAI</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Tu compañero académico inteligente. Mejora tu rendimiento, hábitos y bienestar.
            </p>
          </div>

          {/* Links */}
          {[
            { title: 'Producto', links: ['Funciones', 'Precios', 'Changelog', 'Roadmap'] },
            { title: 'Empresa', links: ['Sobre nosotros', 'Blog', 'Carreras', 'Prensa'] },
            { title: 'Soporte', links: ['Centro de ayuda', 'Contacto', 'Privacidad', 'Términos'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l}>
                    <Link href="#" className="text-sm hover:text-white transition-colors" style={{ color: 'var(--text-muted)' }}>{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'var(--surface-border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © 2025 EstudiaAI. Todos los derechos reservados.
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Hecho con ❤️ para estudiantes latinoamericanos
          </p>
        </div>
      </div>
    </footer>
  )
}
