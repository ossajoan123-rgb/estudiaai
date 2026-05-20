// app/settings/page.tsx
'use client'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { toast } from 'sonner'
import { User, Bell, Shield, LogOut, Save, Moon, Palette } from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [name, setName] = useState(session?.user?.name ?? '')
  const [studyGoal, setStudyGoal] = useState(6)
  const [notifications, setNotifications] = useState({ habits: true, tasks: true, weekly: true })
  const [saving, setSaving] = useState(false)

  async function saveProfile() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success('Perfil actualizado ✅')
    setSaving(false)
  }

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      {/* Profile */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.2)', color: '#6366f1' }}>
            <User className="w-5 h-5" />
          </div>
          <h3 className="font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Perfil</h3>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            {session?.user?.name?.charAt(0) ?? 'U'}
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{session?.user?.name}</p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{session?.user?.email}</p>
            <span className="badge badge-brand text-xs mt-1">Plan Gratuito</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Nombre</label>
            <input value={name} onChange={e => setName(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Meta de horas de estudio por día
            </label>
            <input type="number" value={studyGoal} onChange={e => setStudyGoal(+e.target.value)}
              className="input-field" min={1} max={16} />
          </div>
          <button onClick={saveProfile} disabled={saving} className="btn-primary py-2.5 disabled:opacity-50">
            {saving ? 'Guardando...' : <><Save className="w-4 h-4" /> Guardar cambios</>}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b' }}>
            <Bell className="w-5 h-5" />
          </div>
          <h3 className="font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Notificaciones</h3>
        </div>
        <div className="space-y-4">
          {[
            { key: 'habits', label: 'Recordatorios de hábitos', desc: 'Te recordamos completar tus hábitos diarios' },
            { key: 'tasks', label: 'Alertas de tareas', desc: 'Notificación cuando una tarea está próxima a vencer' },
            { key: 'weekly', label: 'Resumen semanal', desc: 'Informe de tu progreso cada domingo' },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--surface-2)' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{n.label}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{n.desc}</p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))}
                className="w-11 h-6 rounded-full transition-all duration-200 relative flex-shrink-0"
                style={{ background: notifications[n.key as keyof typeof notifications] ? '#6366f1' : 'var(--surface-3)' }}>
                <div className="w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-200"
                  style={{ left: notifications[n.key as keyof typeof notifications] ? '26px' : '4px' }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Account */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Cuenta</h3>
        </div>
        <div className="space-y-3">
          <div className="p-3 rounded-xl flex items-center justify-between" style={{ background: 'var(--surface-2)' }}>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Proveedor de autenticación</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Correo / Google</p>
            </div>
            <span className="badge badge-success text-xs">Activo</span>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })}
            className="btn-secondary w-full py-3 hover:text-red-400">
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      </div>

      {/* About */}
      <div className="glass-card p-6 text-center">
        <p className="text-3xl mb-2">📚</p>
        <p className="font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>EstudiaAI</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Versión 1.0.0 · Hecho con ❤️ para estudiantes</p>
        <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
          EstudiaAI no reemplaza el apoyo profesional académico ni psicológico.
          Siempre busca ayuda de profesionales cuando la necesites.
        </p>
      </div>
    </div>
  )
}
