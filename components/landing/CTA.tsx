// components/landing/CTA.tsx
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'

export function LandingCTA() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="glass-card p-12 border-glow relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 opacity-30"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.4) 0%, transparent 70%)' }} />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fcd34d' }}>
              <Zap className="w-4 h-4" />
              Gratis para siempre en el plan básico
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Tu mejor semestre<br />
              <span className="gradient-text">empieza hoy</span>
            </h2>

            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Únete a miles de estudiantes que ya transformaron su vida académica.
              Sin tarjeta de crédito. Sin compromisos.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register" className="btn-primary text-base px-10 py-4 group">
                Crear cuenta gratis
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                ✓ Sin tarjeta · ✓ Configuración en 5 min · ✓ Cancela cuando quieras
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
