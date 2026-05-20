// components/dashboard/DashboardClient.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import { es } from 'date-fns/locale'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from 'recharts'

import {
  Clock,
  BookOpen,
  Target,
  Flame,
  ArrowRight,
  Plus,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface DashData {
  user?: {
    name: string | null
    studyHoursGoal: number
    academicRiskLevel: string
    emotionalRiskLevel: string
  } | null

  subjectsWithAvg?: Array<{
    id: string
    name: string
    color: string
    currentAvg: number | null
    targetGrade: number
    pendingTasks: number
  }>

  overallGPA?: number
  weeklyStudyHours?: number
  totalTasks?: number

  tasks?: Array<{
    id: string
    title: string
    priority: string
    status: string
    dueDate: string | null
    subject: {
      name: string
      color: string
    } | null
  }>

  habits?: Array<{
    id: string
    name: string
    icon: string
    color: string
    currentStreak: number
    logs: Array<{
      completedAt: string
    }>
  }>

  maxStreak?: number

  checkins?: Array<{
    mood: string
    stressLevel: number
    motivationLevel: number
    date: string
  }>

  todayCheckin?: {
    mood: string
    stressLevel: number
    energyLevel: number
    motivation: number
  } | null

  recommendations?: Array<{
    id: string
    type: string
    title: string
    body: string
    priority: string
  }>

  achievements?: Array<{
    badge: string
    title: string
    description: string
  }>
}

// ─────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  trend,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  color: string
  trend?: 'up' | 'down' | null
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: `${color}20`,
            color,
            border: `1px solid ${color}30`,
          }}
        >
          {icon}
        </div>

        {trend && (
          <div
            className="flex items-center gap-1 text-xs font-medium"
            style={{
              color: trend === 'up' ? '#10b981' : '#ef4444',
            }}
          >
            {trend === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
          </div>
        )}
      </div>

      <div
        className="text-2xl font-bold mb-1"
        style={{
          color: 'var(--text-primary)',
        }}
      >
        {value}
      </div>

      <div
        className="text-xs font-medium mb-0.5"
        style={{
          color: 'var(--text-secondary)',
        }}
      >
        {label}
      </div>

      {sub && (
        <div
          className="text-xs"
          style={{
            color: 'var(--text-muted)',
          }}
        >
          {sub}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MOODS
// ─────────────────────────────────────────────────────────────

const moodMap: Record<
  string,
  { emoji: string; label: string; color: string }
> = {
  VERY_GOOD: {
    emoji: '😄',
    label: 'Muy bien',
    color: '#10b981',
  },

  GOOD: {
    emoji: '🙂',
    label: 'Bien',
    color: '#6ee7b7',
  },

  NEUTRAL: {
    emoji: '😐',
    label: 'Neutral',
    color: '#f59e0b',
  },

  BAD: {
    emoji: '😔',
    label: 'Mal',
    color: '#f97316',
  },

  VERY_BAD: {
    emoji: '😢',
    label: 'Muy mal',
    color: '#ef4444',
  },
}

const priorityColors: Record<string, string> = {
  URGENT: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#f59e0b',
  LOW: '#6366f1',
}

// ─────────────────────────────────────────────────────────────
// CHECKIN
// ─────────────────────────────────────────────────────────────

function CheckInWidget({
  todayCheckin,
}: {
  todayCheckin: DashData['todayCheckin']
}) {
  const router = useRouter()

  const [selected, setSelected] = useState<string | null>(null)

  const [done, setDone] = useState(!!todayCheckin)

  if (done && todayCheckin) {
    const m = moodMap[todayCheckin.mood] ?? moodMap.NEUTRAL

    return (
      <div className="glass-card p-5">
        <p
          className="text-xs font-medium mb-3"
          style={{
            color: 'var(--text-muted)',
          }}
        >
          CHECK-IN DE HOY ✓
        </p>

        <div className="flex items-center gap-3">
          <span className="text-4xl">{m.emoji}</span>

          <div>
            <p
              className="font-semibold"
              style={{
                color: m.color,
              }}
            >
              {m.label}
            </p>

            <p
              className="text-xs"
              style={{
                color: 'var(--text-muted)',
              }}
            >
              Estrés: {todayCheckin.stressLevel}/10 · Energía:{' '}
              {todayCheckin.energyLevel}/10
            </p>
          </div>
        </div>
      </div>
    )
  }

  async function submit(mood: string) {
    setSelected(mood)

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood,
          stressLevel: 5,
          energyLevel: 6,
          motivation: 6,
          anxiety: 4,
        }),
      })

      if (res.ok) {
        setDone(true)
        toast.success('¡Check-in registrado!')
      }
    } catch {
      toast.error('Error al registrar check-in')
    }
  }

  return (
    <div className="glass-card p-5">
      <p
        className="text-xs font-medium mb-3"
        style={{
          color: 'var(--text-muted)',
        }}
      >
        ¿CÓMO TE SIENTES HOY?
      </p>

      <div className="flex gap-2 justify-between">
        {Object.entries(moodMap).map(([key, m]) => (
          <button
            key={key}
            onClick={() => submit(key)}
            className="flex flex-col items-center gap-1 p-2 rounded-xl flex-1 transition-all duration-200"
            style={{
              background:
                selected === key
                  ? `${m.color}20`
                  : 'var(--surface-2)',

              border: `1px solid ${
                selected === key
                  ? m.color
                  : 'var(--surface-border)'
              }`,
            }}
          >
            <span className="text-2xl">{m.emoji}</span>

            <span
              className="text-xs hidden sm:block"
              style={{
                color: 'var(--text-muted)',
              }}
            >
              {m.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────

export function DashboardClient({
  data,
}: {
  data: DashData | null
}) {

  // PROTECCIÓN TOTAL
  if (!data || !data.user) {
    return (
      <div className="p-10">
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">
            Cargando dashboard...
          </h2>

          <p
            style={{
              color: 'var(--text-muted)',
            }}
          >
            Preparando tu información académica
          </p>
        </div>
      </div>
    )
  }

  // DEFAULTS
  const user = data.user

  const subjectsWithAvg = data.subjectsWithAvg ?? []
  const overallGPA = data.overallGPA ?? 0
  const weeklyStudyHours = data.weeklyStudyHours ?? 0
  const totalTasks = data.totalTasks ?? 0
  const tasks = data.tasks ?? []
  const habits = data.habits ?? []
  const maxStreak = data.maxStreak ?? 0
  const checkins = data.checkins ?? []
  const todayCheckin = data.todayCheckin ?? null
  const recommendations = data.recommendations ?? []
  const achievements = data.achievements ?? []

  // MOOD DATA
  const moodValues: Record<string, number> = {
    VERY_GOOD: 5,
    GOOD: 4,
    NEUTRAL: 3,
    BAD: 2,
    VERY_BAD: 1,
  }

  const moodChartData = checkins
    .slice()
    .reverse()
    .map((c) => ({
      date: format(new Date(c.date), 'dd/MM', {
        locale: es,
      }),
      estado: moodValues[c.mood] ?? 3,
      estrés: c.stressLevel,
      motivación: c.motivationLevel,
    }))

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ALERTA */}
      {(user.academicRiskLevel === 'HIGH' ||
        user.academicRiskLevel === 'CRITICAL') && (
        <div
          className="flex items-start gap-3 p-4 rounded-xl"
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
          }}
        >
          <AlertTriangle
            className="w-5 h-5 mt-0.5 flex-shrink-0"
            style={{
              color: '#ef4444',
            }}
          />

          <div>
            <p
              className="font-semibold text-sm"
              style={{
                color: '#fca5a5',
              }}
            >
              Riesgo académico detectado
            </p>

            <p
              className="text-xs mt-1"
              style={{
                color: 'var(--text-muted)',
              }}
            >
              Revisa tus recomendaciones.
            </p>
          </div>
        </div>
      )}

      {/* CHECKIN */}
      <CheckInWidget todayCheckin={todayCheckin} />

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Horas esta semana"
          value={`${weeklyStudyHours}h`}
          sub={`Meta: ${(user.studyHoursGoal ?? 0) * 5}h`}
          color="#6366f1"
        />

        <StatCard
          icon={<BookOpen className="w-5 h-5" />}
          label="Promedio"
          value={
            overallGPA > 0
              ? `${overallGPA.toFixed(1)} / 5`
              : 'Sin notas'
          }
          color="#10b981"
        />

        <StatCard
          icon={<Target className="w-5 h-5" />}
          label="Tareas"
          value={`${totalTasks}`}
          color="#f59e0b"
        />

        <StatCard
          icon={<Flame className="w-5 h-5" />}
          label="Racha"
          value={`${maxStreak} días`}
          color="#f43f5e"
        />
      </div>

      {/* MATERIAS */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-sm">
            Materias activas
          </p>

          <Link
            href="/academic"
            className="btn-ghost text-xs py-1.5 px-3 rounded-lg"
          >
            Gestionar
          </Link>
        </div>

        {subjectsWithAvg.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">📚</p>

            <p className="text-sm font-medium mb-1">
              Sin materias
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {subjectsWithAvg.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: s.color,
                  }}
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">
                      {s.name}
                    </p>

                    <span className="text-sm font-bold">
                      {s.currentAvg !== null
                        ? s.currentAvg.toFixed(1)
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TAREAS */}
      <div className="glass-card p-5">
        <p className="font-semibold text-sm mb-4">
          Próximas tareas
        </p>

        {tasks.length === 0 ? (
          <p className="text-sm">
            No tienes tareas pendientes
          </p>
        ) : (
          <div className="space-y-2">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-xl"
                style={{
                  background: 'var(--surface-2)',
                }}
              >
                <p className="text-sm font-medium">
                  {t.title}
                </p>

                {t.subject && (
                  <p className="text-xs">
                    {t.subject.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RECOMENDACIONES */}
      {recommendations.length > 0 && (
        <div className="glass-card p-5">
          <p className="font-semibold text-sm mb-4">
            Recomendaciones
          </p>

          <div className="space-y-3">
            {recommendations.map((r) => (
              <div
                key={r.id}
                className="p-3 rounded-xl"
                style={{
                  background: 'var(--surface-2)',
                }}
              >
                <p className="text-sm font-medium mb-1">
                  {r.title}
                </p>

                <p className="text-xs">
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LOGROS */}
      {achievements.length > 0 && (
        <div className="glass-card p-5">
          <p className="font-semibold text-sm mb-4">
            Logros
          </p>

          <div className="space-y-2">
            {achievements.map((a) => (
              <div
                key={a.title}
                className="flex items-center gap-3"
              >
                <span className="text-2xl">
                  {a.badge}
                </span>

                <div>
                  <p className="text-sm font-medium">
                    {a.title}
                  </p>

                  <p className="text-xs">
                    {a.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHART */}
      {moodChartData.length > 0 && (
        <div className="glass-card p-5">
          <p className="font-semibold text-sm mb-4">
            Estado emocional
          </p>

          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={moodChartData}>
              <XAxis dataKey="date" />
              <YAxis hide />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="estado"
                stroke="#6366f1"
                fill="#6366f1"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}