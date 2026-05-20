// app/auth/register/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { BookOpen, Eye, EyeOff, ArrowRight, Chrome, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const checks = [
    { label: 'Al menos 8 caracteres', ok: form.password.length >= 8 },
    { label: 'Letras y números', ok: /[a-zA-Z]/.test(form.password) && /\d/.test(form.password) },
    { label: 'Las contraseñas coinciden', ok: form.password === form.confirm && form.confirm.length > 0 },
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Las contraseñas no coinciden'); return }
    if (form.password.length < 8) { toast.error('La contraseña debe tener al menos 8 caracteres'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Error al registrarse'); return }

      toast.success('¡Cuenta creada! Redirigiendo al onboarding...')
      await signIn('credentials', { email: form.email, password: form.password, callbackUrl: '/onboarding', redirect: true })
    } catch {
      toast.error('Error inesperado. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--surface-bg)' }}>
      {/* Ambient */}
      <div className="orb orb-brand w-96 h-96 -top-20 -right-20 fixed opacity-30 pointer-events-none" />
      <div className="orb orb-accent w-64 h-64 bottom-10 -left-10 fixed opacity-20 pointer-events-none" />

      <div className="relative w-full max-w-md">
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

        <div className="glass-card p-8">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Empieza hoy
          </h1>
          <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="font-medium hover:text-white transition-colors" style={{ color: '#a5b4fc' }}>
              Inicia sesión
            </Link>
          </p>

          {/* Google */}
          <button onClick={() => signIn('google', { callbackUrl: '/onboarding' })}
            className="btn-secondary w-full mb-4 py-3">
            <Chrome className="w-5 h-5" />
            Registrarse con Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--surface-border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>o con email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--surface-border)' }} />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Nombre completo</label>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                className="input-field" placeholder="Tu nombre" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Correo electrónico</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                className="input-field" placeholder="tu@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Contraseña</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)}
                  className="input-field pr-12" placeholder="Mínimo 8 caracteres" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 btn-ghost p-1">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password checks */}
              {form.password && (
                <div className="mt-2 flex flex-col gap-1">
                  {checks.map(c => (
                    <div key={c.label} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className={`w-3.5 h-3.5 ${c.ok ? 'text-emerald-400' : 'text-gray-600'}`} />
                      <span style={{ color: c.ok ? '#6ee7b7' : 'var(--text-muted)' }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Confirmar contraseña</label>
              <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)}
                className="input-field" placeholder="Repite tu contraseña" required />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-2 disabled:opacity-50">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creando cuenta...
                </span>
              ) : (
                <span className="flex items-center gap-2">Crear cuenta <ArrowRight className="w-4 h-4" /></span>
              )}
            </button>
          </form>

          <p className="text-xs mt-4 text-center" style={{ color: 'var(--text-muted)' }}>
            Al registrarte aceptas nuestros{' '}
            <Link href="#" className="underline">Términos de Servicio</Link> y{' '}
            <Link href="#" className="underline">Política de Privacidad</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
