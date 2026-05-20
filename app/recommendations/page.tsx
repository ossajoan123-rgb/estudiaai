// app/recommendations/page.tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { X, CheckCircle2, Lightbulb, BookOpen, Heart, Target, AlertTriangle, Trophy } from 'lucide-react'

interface Rec { id: string; type: string; title: string; body: string; priority: string; isRead: boolean; createdAt: string }

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  ACADEMIC:    { icon: <BookOpen className="w-5 h-5" />,    color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  EMOTIONAL:   { icon: <Heart className="w-5 h-5" />,       color: '#f43f5e', bg: 'rgba(244,63,94,0.1)' },
  HABIT:       { icon: <Target className="w-5 h-5" />,      color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  PRODUCTIVITY:{ icon: <Lightbulb className="w-5 h-5" />,   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  ALERT:       { icon: <AlertTriangle className="w-5 h-5" />,color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  ACHIEVEMENT: { icon: <Trophy className="w-5 h-5" />,      color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  SYSTEM:      { icon: <Lightbulb className="w-5 h-5" />,   color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
}

const PRIORITY_ORDER: Record<string, number> = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
const PRIORITY_COLORS: Record<string, string> = { URGENT: '#ef4444', HIGH: '#f97316', MEDIUM: '#f59e0b', LOW: '#6366f1' }

export default function RecommendationsPage() {
  const [recs, setRecs] = useState<Rec[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('ALL')

  const fetchRecs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/recommendations')
      const data = await res.json()
      setRecs((data.recommendations ?? []).sort((a: Rec, b: Rec) =>
        (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3)
      ))
    } catch { toast.error('Error cargando recomendaciones') }
    setLoading(false)
  }, [])

  useEffect(() => { fetchRecs() }, [fetchRecs])

  async function markRead(id: string) {
    await fetch('/api/recommendations', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'read' }) })
    setRecs(r => r.map(x => x.id === id ? { ...x, isRead: true } : x))
  }

  async function dismiss(id: string) {
    await fetch('/api/recommendations', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action: 'dismiss' }) })
    setRecs(r => r.filter(x => x.id !== id))
    toast.success('Recomendación descartada')
  }

  const types = ['ALL', ...Array.from(new Set(recs.map(r => r.type)))]
  const filtered = filter === 'ALL' ? recs : recs.filter(r => r.type === filter)
  const unread = recs.filter(r => !r.isRead).length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: recs.length, icon: '✨', color: '#6366f1' },
          { label: 'Sin leer', value: unread, icon: '🔔', color: '#f59e0b' },
          { label: 'Alta prioridad', value: recs.filter(r => r.priority === 'HIGH' || r.priority === 'URGENT').length, icon: '⚠️', color: '#ef4444' },
          { label: 'Académicas', value: recs.filter(r => r.type === 'ACADEMIC').length, icon: '📚', color: '#10b981' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold mb-0.5" style={{ color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {types.map(t => {
          const cfg = TYPE_CONFIG[t]
          return (
            <button key={t} onClick={() => setFilter(t)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200"
              style={{
                background: filter === t ? (cfg?.bg ?? 'rgba(99,102,241,0.15)') : 'var(--surface-2)',
                color: filter === t ? (cfg?.color ?? '#a5b4fc') : 'var(--text-secondary)',
                border: `1px solid ${filter === t ? (cfg?.color ?? '#6366f1') + '50' : 'var(--surface-border)'}`,
              }}>
              {t === 'ALL' ? '🔍 Todas' : t}
            </button>
          )
        })}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-6xl mb-4">🎉</p>
          <p className="font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
            {filter === 'ALL' ? '¡Sin recomendaciones pendientes!' : 'Sin recomendaciones en esta categoría'}
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Las recomendaciones se generan automáticamente según tu actividad
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(rec => {
            const cfg = TYPE_CONFIG[rec.type] ?? TYPE_CONFIG.SYSTEM
            return (
              <div key={rec.id}
                className="glass-card p-5 transition-all duration-300"
                style={{
                  opacity: rec.isRead ? 0.75 : 1,
                  borderColor: !rec.isRead ? `${cfg.color}30` : undefined,
                }}
                onClick={() => !rec.isRead && markRead(rec.id)}>
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                    {cfg.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{rec.title}</p>
                        {!rec.isRead && (
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-xs px-2 py-0.5 rounded-md"
                          style={{ background: `${PRIORITY_COLORS[rec.priority]}20`, color: PRIORITY_COLORS[rec.priority] }}>
                          {rec.priority}
                        </span>
                        {rec.isRead && (
                          <button onClick={(e) => { e.stopPropagation(); dismiss(rec.id) }}
                            className="btn-ghost p-1 rounded-lg hover:text-red-400">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{rec.body}</p>

                    <div className="flex items-center justify-between">
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {format(new Date(rec.createdAt), "d 'de' MMMM", { locale: es })}
                      </p>
                      {!rec.isRead ? (
                        <button onClick={(e) => { e.stopPropagation(); markRead(rec.id) }}
                          className="flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-white"
                          style={{ color: cfg.color }}>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Marcar leída
                        </button>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); dismiss(rec.id) }}
                          className="text-xs btn-ghost py-1 px-2 rounded-lg hover:text-red-400">
                          Descartar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* How it works */}
      <div className="glass-card p-5" style={{ borderColor: 'rgba(139,92,246,0.2)' }}>
        <p className="font-semibold text-sm mb-3" style={{ color: '#c4b5fd' }}>🤖 ¿Cómo funcionan las recomendaciones?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {[
            '📊 Analiza tu historial de notas y materias en riesgo',
            '💚 Monitorea tu estado emocional y niveles de estrés',
            '🎯 Evalúa el cumplimiento de tus hábitos diarios',
            '⏰ Detecta patrones de productividad y horarios óptimos',
          ].map(tip => (
            <p key={tip} className="flex gap-2"><span>{tip.substring(0,2)}</span>{tip.substring(2)}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
