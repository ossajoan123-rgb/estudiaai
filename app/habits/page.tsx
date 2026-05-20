// app/habits/page.tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { format, startOfDay, subDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { Plus, Flame, Target, CheckCircle2, Circle, Trash2, X, Save } from 'lucide-react'

interface HabitLog { id: string; completedAt: string }
interface Habit {
  id: string; name: string; description?: string; category: string
  icon: string; color: string; currentStreak: number; bestStreak: number
  totalCompletions: number; targetDays: number[]; isSystemSuggested: boolean
  logs: HabitLog[]
}

const CATEGORIES = ['STUDY','HEALTH','SLEEP','MINDFULNESS','ORGANIZATION','SOCIAL','OTHER']
const CATEGORY_EMOJIS: Record<string,string> = { STUDY:'📚', HEALTH:'🏃', SLEEP:'😴', MINDFULNESS:'🧘', ORGANIZATION:'📋', SOCIAL:'👥', OTHER:'✨' }
const ICONS = ['✨','🍅','📝','🏃','😴','🧘','💪','📚','🎯','🎸','🌿','💧','🔥','⭐','🌅','🎨']
const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f43f5e','#84cc16','#f97316','#ec4899']

function HabitStreak({ streak, best }: { streak: number; best: number }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-1.5">
        <Flame className="w-4 h-4 text-orange-400" />
        <span className="font-bold" style={{ color: streak > 0 ? '#f97316' : 'var(--text-muted)' }}>
          {streak} días
        </span>
        <span style={{ color: 'var(--text-muted)' }}>racha actual</span>
      </div>
      <span style={{ color: 'var(--surface-border)' }}>·</span>
      <span style={{ color: 'var(--text-muted)' }}>Mejor: {best}</span>
    </div>
  )
}

function HabitCalendar({ logs }: { logs: HabitLog[] }) {
  const days = Array.from({ length: 21 }, (_, i) => {
    const d = subDays(new Date(), 20 - i)
    const key = format(d, 'yyyy-MM-dd')
    const done = logs.some(l => format(new Date(l.completedAt), 'yyyy-MM-dd') === key)
    return { date: d, done }
  })
  return (
    <div className="flex gap-1.5 flex-wrap">
      {days.map(({ date, done }) => (
        <div key={date.toISOString()}
          title={format(date, 'd MMM', { locale: es })}
          className="w-5 h-5 rounded-sm transition-all duration-200"
          style={{
            background: done ? '#6366f1' : 'var(--surface-3)',
            boxShadow: done ? '0 0 6px rgba(99,102,241,0.4)' : 'none',
          }} />
      ))}
    </div>
  )
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass-card p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{title}</h3>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', category: 'STUDY', icon: '📝', color: '#6366f1',
    frequency: 'DAILY', targetDays: [1,2,3,4,5]
  })
  const [saving, setSaving] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)

  const fetchHabits = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/habits')
      const data = await res.json()
      setHabits(data.habits ?? [])
    } catch { toast.error('Error cargando hábitos') }
    setLoading(false)
  }, [])

  useEffect(() => { fetchHabits() }, [fetchHabits])

  const isCompletedToday = (habit: Habit) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd')
    return habit.logs.some(l => format(new Date(l.completedAt), 'yyyy-MM-dd') === todayStr)
  }

  async function toggleHabit(habit: Habit) {
    setToggling(habit.id)
    try {
      const res = await fetch(`/api/habits/${habit.id}/log`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      const data = await res.json()
      if (data.logged) {
        toast.success(`¡${habit.name} completado! 🔥 ${data.streak} días de racha`)
      } else {
        toast.info('Hábito desmarcado')
      }
      fetchHabits()
    } catch { toast.error('Error al actualizar hábito') }
    setToggling(null)
  }

  async function deleteHabit(id: string) {
    if (!confirm('¿Eliminar este hábito?')) return
    await fetch(`/api/habits/${id}`, { method: 'DELETE' })
    toast.success('Hábito eliminado')
    fetchHabits()
  }

  async function createHabit() {
    setSaving(true)
    try {
      const res = await fetch('/api/habits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      toast.success('Hábito creado ✅')
      setShowModal(false)
      setForm({ name: '', description: '', category: 'STUDY', icon: '📝', color: '#6366f1', frequency: 'DAILY', targetDays: [1,2,3,4,5] })
      fetchHabits()
    } catch { toast.error('Error creando hábito') }
    setSaving(false)
  }

  const completed = habits.filter(isCompletedToday).length
  const total = habits.length
  const todayPct = total > 0 ? Math.round((completed / total) * 100) : 0
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.bestStreak), 0)
  const totalCompletions = habits.reduce((sum, h) => sum + h.totalCompletions, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Completados hoy', value: `${completed} / ${total}`, icon: '✅', color: '#10b981' },
          { label: 'Progreso diario', value: `${todayPct}%`, icon: '🎯', color: '#6366f1' },
          { label: 'Mejor racha', value: `${bestStreak} días`, icon: '🔥', color: '#f97316' },
          { label: 'Total completados', value: totalCompletions, icon: '⭐', color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold mb-0.5" style={{ color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="glass-card p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Progreso de hoy</p>
            <p className="text-sm font-bold" style={{ color: todayPct === 100 ? '#10b981' : '#6366f1' }}>
              {todayPct === 100 ? '🎉 ¡Perfecto!' : `${todayPct}%`}
            </p>
          </div>
          <div className="progress-bar h-3">
            <div className="progress-fill" style={{
              width: `${todayPct}%`,
              background: todayPct === 100 ? 'linear-gradient(90deg,#10b981,#059669)' : 'linear-gradient(90deg,#6366f1,#8b5cf6)',
              transition: 'width 0.8s ease'
            }} />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
          Mis hábitos ({total})
        </h2>
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm py-2">
          <Plus className="w-4 h-4" /> Nuevo hábito
        </button>
      </div>

      {/* Habits list */}
      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-36 rounded-2xl" />)}</div>
      ) : habits.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-6xl mb-4">🎯</p>
          <p className="font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>Sin hábitos configurados</p>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Los hábitos son la base del éxito académico. Empieza con uno pequeño.
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> Crear mi primer hábito
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map(habit => {
            const done = isCompletedToday(habit)
            return (
              <div key={habit.id} className="glass-card p-5 transition-all duration-300"
                style={{ opacity: done ? 0.85 : 1, borderColor: done ? `${habit.color}30` : undefined }}>
                <div className="flex items-start gap-4">
                  {/* Toggle button */}
                  <button
                    onClick={() => toggleHabit(habit)}
                    disabled={toggling === habit.id}
                    className="flex-shrink-0 mt-0.5 transition-all duration-200 hover:scale-110 disabled:opacity-50">
                    {done
                      ? <CheckCircle2 className="w-7 h-7" style={{ color: habit.color }} />
                      : <Circle className="w-7 h-7" style={{ color: 'var(--surface-border)' }} />
                    }
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{habit.icon}</span>
                        <div>
                          <p className="font-semibold" style={{
                            color: done ? 'var(--text-muted)' : 'var(--text-primary)',
                            textDecoration: done ? 'line-through' : 'none',
                          }}>
                            {habit.name}
                          </p>
                          {habit.description && (
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{habit.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {habit.isSystemSuggested && (
                          <span className="badge badge-brand text-xs">IA</span>
                        )}
                        <button onClick={() => deleteHabit(habit.id)} className="btn-ghost p-1.5 rounded-lg hover:text-red-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3">
                      <HabitStreak streak={habit.currentStreak} best={habit.bestStreak} />
                    </div>

                    <div className="mt-3">
                      <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>Últimas 3 semanas</p>
                      <HabitCalendar logs={habit.logs} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Tips */}
      <div className="glass-card p-5" style={{ borderColor: 'rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.05)' }}>
        <p className="font-semibold text-sm mb-3" style={{ color: '#fcd34d' }}>💡 Tips para construir hábitos</p>
        <div className="space-y-2">
          {[
            'Empieza con hábitos pequeños de menos de 5 minutos',
            'Enlaza nuevos hábitos a rutinas que ya tienes',
            'Las rachas de 21 días consolidan el hábito en tu cerebro',
            'No rompas la cadena más de 2 días seguidos',
          ].map(tip => (
            <p key={tip} className="text-xs flex gap-2" style={{ color: 'var(--text-secondary)' }}>
              <span>•</span>{tip}
            </p>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal title="Nuevo Hábito" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Nombre *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" placeholder="Ej: Meditar 10 minutos" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Descripción</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field" placeholder="¿Cómo lo harás?" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Categoría</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field">
                  {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_EMOJIS[c]} {c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Frecuencia</label>
                <select value={form.frequency} onChange={e => setForm(f => ({ ...f, frequency: e.target.value }))} className="input-field">
                  <option value="DAILY">Diario</option>
                  <option value="WEEKDAYS">Lun-Vie</option>
                  <option value="WEEKENDS">Fines de semana</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Icono</label>
              <div className="flex gap-2 flex-wrap">
                {ICONS.map(ic => (
                  <button key={ic} onClick={() => setForm(f => ({ ...f, icon: ic }))}
                    className="w-9 h-9 rounded-xl text-xl transition-all duration-200"
                    style={{
                      background: form.icon === ic ? 'rgba(99,102,241,0.2)' : 'var(--surface-2)',
                      border: `1px solid ${form.icon === ic ? 'rgba(99,102,241,0.5)' : 'var(--surface-border)'}`,
                    }}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                    className="w-8 h-8 rounded-lg transition-all duration-200"
                    style={{ background: c, outline: form.color === c ? '3px solid white' : 'none', outlineOffset: 2 }} />
                ))}
              </div>
            </div>
            <button onClick={createHabit} disabled={!form.name || saving} className="btn-primary w-full py-3 disabled:opacity-50">
              {saving ? 'Guardando...' : <><Save className="w-4 h-4" /> Crear hábito</>}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
