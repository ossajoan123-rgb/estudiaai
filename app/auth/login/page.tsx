// app/auth/login/page.tsx
'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Eye, EyeOff, ArrowRight, Chrome } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await signIn('credentials', { email, password, redirect: false })
      if (res?.error) {
        toast.error('Credenciales incorrectas. Verifica tu email y contraseña.')
      } else {
        toast.success('¡Bienvenido de vuelta!')
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      toast.error('Error inesperado. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    await signIn('google', { callbackUrl })
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--surface-bg)' }}>
      {/* Left panel - decorative */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center relative overflow-hidden p-12"
        style={{ background: 'var(--surface-1)' }}>
        <div className="orb orb-brand w-96 h-96 -top-20 -left-20 opacity-60" />
        <div className="orb orb-accent w-64 h-64 bottom-10 right-10 opacity-40" />
        <div className="relative z-10 text-center max-w-md">
          <div className="text-6xl mb-6">📚</div>
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Tu éxito académico<br />
            <span className="gradient-text">te espera</span>
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Miles de estudiantes ya están mejorando sus notas, hábitos y bienestar con EstudiaAI.
          </p>
          {/* Testimonial mini */}
          <div className="mt-8 glass-card p-4 text-left">
            <p className="text-sm italic mb-3" style={{ color: 'var(--text-secondary)' }}>
              "Subí mi promedio de 3.4 a 4.1 en un semestre gracias a EstudiaAI."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">V</div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Valentina T. – Ingeniería de Sistemas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Estudia<span className="gradient-text">AI</span>
            </span>
          </Link>

          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Bienvenido de vuelta
          </h1>
          <p className="mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
            ¿No tienes cuenta?{' '}
            <Link href="/auth/register" className="font-medium hover:text-white transition-colors" style={{ color: '#a5b4fc' }}>
              Regístrate gratis
            </Link>
          </p>

          {/* Google button */}
          <button onClick={handleGoogle} disabled={googleLoading}
            className="btn-secondary w-full mb-4 py-3 disabled:opacity-50">
            <Chrome className="w-5 h-5" />
            {googleLoading ? 'Conectando...' : 'Continuar con Google'}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: 'var(--surface-border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>o con email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--surface-border)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Contraseña
                </label>
                <Link href="#" className="text-xs hover:text-white transition-colors" style={{ color: '#a5b4fc' }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 btn-ghost p-1">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-2 disabled:opacity-50">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Iniciando sesión...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Iniciar sesión <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <p className="font-medium mb-1" style={{ color: '#a5b4fc' }}>🧪 Cuenta demo</p>
            <p style={{ color: 'var(--text-secondary)' }}>Email: <code className="font-mono text-xs">demo@estudiaai.com</code></p>
            <p style={{ color: 'var(--text-secondary)' }}>Pass: <code className="font-mono text-xs">demo123456</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}
