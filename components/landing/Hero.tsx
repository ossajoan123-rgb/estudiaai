// components/landing/Hero.tsx
'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Star, Sparkles, TrendingUp, Heart, Brain } from 'lucide-react'

export function LandingHero() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30
      el.style.setProperty('--rx', `${y}deg`)
      el.style.setProperty('--ry', `${x}deg`)
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  const floatingCards = [
    { icon: <TrendingUp className="w-4 h-4" />, label: '+40% en notas', color: '#10b981', delay: '0s' },
    { icon: <Heart className="w-4 h-4" />, label: 'Bienestar emocional', color: '#f43f5e', delay: '1s' },
    { icon: <Brain className="w-4 h-4" />, label: 'IA personalizada', color: '#6366f1', delay: '2s' },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.15) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(99,102,241,0.15) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
          style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#a5b4fc',
          }}>
          <Sparkles className="w-4 h-4" />
          Inteligencia artificial para estudiantes
          <span className="badge-brand">Nuevo</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] mb-6 text-balance"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Estudia más{' '}
          <span className="relative inline-block">
            <span className="gradient-text">inteligente,</span>
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
              <path d="M2 9C50 3 150 1 298 7" stroke="url(#underline)" strokeWidth="3" strokeLinecap="round" />
              <defs>
                <linearGradient id="underline" x1="0" y1="0" x2="300" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <br />
          no más duro.
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}>
          EstudiaAI analiza tus hábitos, rendimiento y bienestar emocional para darte
          recomendaciones personalizadas que realmente funcionan. Tu compañero académico 24/7.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/auth/register" className="btn-primary text-base px-8 py-4 group">
            Empieza gratis hoy
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/auth/login" className="btn-secondary text-base px-8 py-4">
            Ver demo
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          style={{ color: 'var(--text-muted)' }}>
          <div className="flex -space-x-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                style={{
                  borderColor: 'var(--surface-bg)',
                  background: `hsl(${i * 60}, 70%, 55%)`,
                  color: 'white',
                }}>
                {['S','M','A','J','P'][i-1]}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
          </div>
          <span className="text-sm">+2,800 estudiantes activos</span>
        </div>

        {/* Dashboard preview card */}
        <div ref={heroRef} className="relative max-w-4xl mx-auto"
          style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}>
          <div className="glass-card p-1 border-glow"
            style={{ transform: 'rotateX(var(--rx, 2deg)) rotateY(var(--ry, 0deg))', transition: 'transform 0.1s ease-out' }}>
            {/* Fake dashboard screenshot */}
            <div className="rounded-xl overflow-hidden"
              style={{ background: 'var(--surface-1)', minHeight: '360px', position: 'relative' }}>
              {/* Top bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: 'var(--surface-border)' }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-4 h-6 rounded-md px-3 flex items-center text-xs"
                  style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                  estudiaai.com/dashboard
                </div>
              </div>

              {/* Dashboard content preview */}
              <div className="p-4 grid grid-cols-4 gap-3">
                {[
                  { label: 'Horas esta semana', val: '18.5h', color: '#6366f1', pct: 74 },
                  { label: 'Promedio general', val: '4.1 / 5.0', color: '#10b981', pct: 82 },
                  { label: 'Hábitos activos', val: '5 / 5', color: '#f59e0b', pct: 100 },
                  { label: 'Bienestar', val: 'Bien 😊', color: '#f43f5e', pct: 70 },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3 text-left"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                    <p className="text-lg font-bold mb-2" style={{ color: s.color }}>{s.val}</p>
                    <div className="h-1.5 rounded-full" style={{ background: 'var(--surface-3)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, background: s.color }} />
                    </div>
                  </div>
                ))}

                {/* Chart area */}
                <div className="col-span-3 rounded-xl p-3"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)', minHeight: '180px' }}>
                  <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                    📈 Evolución de notas
                  </p>
                  <svg viewBox="0 0 400 120" className="w-full opacity-80">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 90 C50 85 80 60 120 55 S200 40 250 45 S320 30 400 25 L400 120 L0 120 Z"
                      fill="url(#chartGrad)" />
                    <path d="M0 90 C50 85 80 60 120 55 S200 40 250 45 S320 30 400 25"
                      stroke="#6366f1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    {[[0,90],[120,55],[250,45],[400,25]].map(([x,y],i) => (
                      <circle key={i} cx={x} cy={y} r="4" fill="#6366f1" />
                    ))}
                  </svg>
                </div>

                {/* Tasks preview */}
                <div className="col-span-1 rounded-xl p-3 flex flex-col gap-2"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)' }}>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>📋 Tareas</p>
                  {['Parcial Cálculo', 'Proyecto Python', 'Informe Lab'].map((t, i) => (
                    <div key={t} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm border flex-shrink-0"
                        style={{ borderColor: ['#ef4444','#6366f1','#f59e0b'][i], background: i === 0 ? '#ef4444' : 'transparent' }} />
                      <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating cards */}
          {floatingCards.map((card, i) => (
            <div key={i}
              className="absolute hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold"
              style={{
                background: 'rgba(15,15,32,0.9)',
                border: `1px solid ${card.color}40`,
                color: card.color,
                boxShadow: `0 8px 30px ${card.color}30`,
                top: i === 0 ? '10%' : i === 1 ? '50%' : '75%',
                left: i === 0 ? '-8%' : 'auto',
                right: i !== 0 ? '-5%' : 'auto',
                transform: 'translateY(-50%)',
                animation: `float ${4 + i}s ease-in-out infinite`,
                animationDelay: card.delay,
              }}>
              <span style={{ color: card.color }}>{card.icon}</span>
              {card.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
