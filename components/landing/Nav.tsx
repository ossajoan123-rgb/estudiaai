// components/landing/Nav.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Menu, X } from 'lucide-react'

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Funciones', href: '#features' },
    { label: 'Estadísticas', href: '#stats' },
    { label: 'Testimonios', href: '#testimonials' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-white/5 py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}>
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Estudia<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <a key={l.href} href={l.href}
              className="text-sm font-medium transition-colors duration-200 hover:text-white"
              style={{ color: 'var(--text-secondary)' }}>
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login" className="btn-ghost text-sm">Iniciar sesión</Link>
          <Link href="/auth/register" className="btn-primary text-sm">Comenzar gratis</Link>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden btn-ghost p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/5 px-4 py-4 flex flex-col gap-3">
          {links.map(l => (
            <a key={l.href} href={l.href}
              className="text-sm font-medium py-2" style={{ color: 'var(--text-secondary)' }}
              onClick={() => setMobileOpen(false)}>
              {l.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: 'var(--surface-border)' }}>
            <Link href="/auth/login" className="btn-secondary w-full text-center">Iniciar sesión</Link>
            <Link href="/auth/register" className="btn-primary w-full text-center">Comenzar gratis</Link>
          </div>
        </div>
      )}
    </header>
  )
}
