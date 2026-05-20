// components/dashboard/Sidebar.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  BookOpen, LayoutDashboard, GraduationCap, Target, Heart,
  Lightbulb, Settings, LogOut, Menu, X, Trophy, ChevronRight
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', emoji: '🏠' },
  { href: '/academic', icon: GraduationCap, label: 'Académico', emoji: '📚' },
  { href: '/habits', icon: Target, label: 'Hábitos', emoji: '🎯' },
  { href: '/wellness', icon: Heart, label: 'Bienestar', emoji: '💚' },
  { href: '/recommendations', icon: Lightbulb, label: 'Recomendaciones', emoji: '✨' },
  { href: '/settings', icon: Settings, label: 'Configuración', emoji: '⚙️' },
]

interface SidebarProps {
  user: { name?: string | null; email?: string | null; image?: string | null }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b" style={{ borderColor: 'var(--surface-border)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}>
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          Estudia<span className="gradient-text">AI</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
              style={{
                background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: isActive ? '#a5b4fc' : 'var(--text-secondary)',
                border: isActive ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
              }}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* Achievement badge */}
      <div className="px-3 mb-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <Trophy className="w-4 h-4" style={{ color: '#f59e0b' }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold" style={{ color: '#fcd34d' }}>Racha: 7 días 🔥</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>¡Sigue así!</p>
          </div>
        </div>
      </div>

      {/* User footer */}
      <div className="px-3 pb-4 border-t pt-4" style={{ borderColor: 'var(--surface-border)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            {user.name?.charAt(0) ?? user.email?.charAt(0) ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
              {user.name ?? 'Usuario'}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
          </div>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/' })}
          className="btn-ghost w-full justify-start text-xs py-2">
          <LogOut className="w-3.5 h-3.5" />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 z-40"
        style={{ background: 'var(--surface-1)', borderRight: '1px solid var(--surface-border)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)', color: 'var(--text-primary)' }}
        onClick={() => setMobileOpen(true)}>
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 flex flex-col z-10"
            style={{ background: 'var(--surface-1)', borderRight: '1px solid var(--surface-border)' }}>
            <button onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 btn-ghost p-1.5 rounded-lg">
              <X className="w-4 h-4" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
