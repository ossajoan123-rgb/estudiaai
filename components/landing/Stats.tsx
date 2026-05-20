// components/landing/Stats.tsx
'use client'
import { useEffect, useRef, useState } from 'react'

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true
        let start = 0
        const step = target / 60
        const timer = setInterval(() => {
          start = Math.min(start + step, target)
          setVal(Math.floor(start))
          if (start >= target) clearInterval(timer)
        }, 16)
      }
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

const stats = [
  { label: 'Estudiantes activos', value: 2800, suffix: '+', desc: 'en 12 países de Latinoamérica' },
  { label: 'Mejora promedio en notas', value: 40, suffix: '%', desc: 'después de 8 semanas de uso' },
  { label: 'Horas de estudio registradas', value: 150000, suffix: '+', desc: 'sesiones de estudio efectivo' },
  { label: 'Satisfacción de usuarios', value: 97, suffix: '%', desc: 'recomendarían la plataforma' },
]

export function LandingStats() {
  return (
    <section id="stats" className="relative py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="badge badge-brand mb-4 inline-block">📊 Resultados reales</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-balance" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Números que hablan<br />
            <span className="gradient-text">por sí solos</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-6 text-center">
              {/* Big number */}
              <div className="text-4xl sm:text-5xl font-bold mb-2 gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                <AnimatedNumber target={s.value} suffix={s.suffix} />
              </div>
              <p className="font-semibold mb-1 text-sm" style={{ color: 'var(--text-primary)' }}>{s.label}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
