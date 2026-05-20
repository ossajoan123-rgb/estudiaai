// app/wellness/page.tsx
'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { format } from 'date-fns'
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
  Heart,
  Brain,
  Zap,
  Wind,
  AlertCircle,
} from 'lucide-react'

const MOODS = [
  {
    key: 'VERY_BAD',
    emoji: '😢',
    label: 'Muy mal',
    color: '#ef4444',
    val: 1,
  },
  {
    key: 'BAD',
    emoji: '😔',
    label: 'Mal',
    color: '#f97316',
    val: 2,
  },
  {
    key: 'NEUTRAL',
    emoji: '😐',
    label: 'Neutral',
    color: '#f59e0b',
    val: 3,
  },
  {
    key: 'GOOD',
    emoji: '🙂',
    label: 'Bien',
    color: '#6ee7b7',
    val: 4,
  },
  {
    key: 'VERY_GOOD',
    emoji: '😄',
    label: 'Muy bien',
    color: '#10b981',
    val: 5,
  },
]

const TIPS = {
  VERY_BAD: [
    '🫁 Respira profundo: inhala 4 seg, sostén 4, exhala 4.',
    '🎵 Escucha música tranquila durante 10 minutos.',
    '🤝 Habla con alguien de confianza.',
    '⚠️ Si el malestar persiste, busca apoyo profesional.',
  ],

  BAD: [
    '🚶 Camina 15 minutos.',
    '📓 Escribe cómo te sientes.',
    '🛁 Relájate con una ducha caliente.',
    '😴 Descansa un poco si puedes.',
  ],

  NEUTRAL: [
    '🍅 Haz una sesión Pomodoro.',
    '📋 Organiza 3 tareas pequeñas.',
    '🌿 Hidrátate antes de estudiar.',
    '🎯 Define una meta simple.',
  ],

  GOOD: [
    '⚡ Aprovecha para estudiar temas difíciles.',
    '🧠 Usa recuerdo activo.',
    '📚 Avanza tareas pendientes.',
    '💪 Mantén la buena energía.',
  ],

  VERY_GOOD: [
    '🚀 Aprende algo nuevo hoy.',
    '🎓 Enseña un tema a alguien.',
    '📝 Planea tus metas semanales.',
    '🌟 Repite los hábitos positivos.',
  ],
}

type SliderInputProps = {
  label: string
  value: number
  onChange: (v: number) => void
  icon: React.ReactNode
  color: string
}

function SliderInput({
  label,
  value,
  onChange,
  icon,
  color,
}: SliderInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div
          className="flex items-center gap-2 text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span style={{ color }}>{icon}</span>
          {label}
        </div>

        <span
          className="text-lg font-bold"
          style={{ color }}
        >
          {value}/10
        </span>
      </div>

      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} ${
            ((value - 1) / 9) * 100
          }%, var(--surface-3) 0)`,
          outline: 'none',
        }}
      />
    </div>
  )
}

export default function WellnessPage() {
  const [checkins, setCheckins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedMood, setSelectedMood] =
    useState<string | null>(null)

  const [form, setForm] = useState({
    stressLevel: 5,
    energyLevel: 6,
    motivation: 6,
    anxiety: 4,
    notes: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const fetchCheckins = useCallback(async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/checkin?days=30')

      const data = await res.json()

      setCheckins(data.checkins ?? [])

      const todayStr = new Date().toDateString()

      const todayCheckin = data.checkins?.find(
        (c: any) =>
          new Date(c.date).toDateString() === todayStr
      )

      if (todayCheckin) {
        setSubmitted(true)
        setSelectedMood(todayCheckin.mood)
      }
    } catch {
      toast.error('Error cargando datos')
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchCheckins()
  }, [fetchCheckins])

  async function submit() {
    if (!selectedMood) {
      toast.error('Selecciona cómo te sientes')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: selectedMood,
          ...form,
        }),
      })

      if (!res.ok) {
        throw new Error()
      }

      toast.success('Check-in registrado 💚')

      setSubmitted(true)

      await fetchCheckins()
    } catch {
      toast.error('Error al guardar')
    }

    setSubmitting(false)
  }

  const moodVals: Record<string, number> = {
    VERY_BAD: 1,
    BAD: 2,
    NEUTRAL: 3,
    GOOD: 4,
    VERY_GOOD: 5,
  }

  const chartData = checkins
    .slice()
    .reverse()
    .map((c: any) => ({
      date: format(new Date(c.date), 'dd/MM'),
      estado: moodVals[c.mood] ?? 3,
      estrés: c.stressLevel,
      energía: c.energyLevel,
      motivación: c.motivation,
    }))

  const avgMood =
    checkins.length > 0
      ? checkins.reduce(
          (s: number, c: any) =>
            s + (moodVals[c.mood] ?? 3),
          0
        ) / checkins.length
      : 0

  const avgStress =
    checkins.length > 0
      ? checkins.reduce(
          (s: number, c: any) =>
            s + c.stressLevel,
          0
        ) / checkins.length
      : 0

  const avgEnergy =
    checkins.length > 0
      ? checkins.reduce(
          (s: number, c: any) =>
            s + c.energyLevel,
          0
        ) / checkins.length
      : 0

  const avgMotiv =
    checkins.length > 0
      ? checkins.reduce(
          (s: number, c: any) =>
            s + c.motivation,
          0
        ) / checkins.length
      : 0

  const radarData = [
    {
      subject: 'Ánimo',
      A: Math.round((avgMood / 5) * 100),
    },
    {
      subject: 'Energía',
      A: Math.round((avgEnergy / 10) * 100),
    },
    {
      subject: 'Motivación',
      A: Math.round((avgMotiv / 10) * 100),
    },
    {
      subject: 'Bajo estrés',
      A: Math.round(((10 - avgStress) / 10) * 100),
    },
  ]

  const currentMood = MOODS.find(
    (m) => m.key === selectedMood
  )

  const tips =
    selectedMood
      ? TIPS[selectedMood as keyof typeof TIPS] ?? []
      : []

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <p>Cargando bienestar...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Disclaimer */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl"
        style={{
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        <AlertCircle
          className="w-5 h-5 flex-shrink-0 mt-0.5"
          style={{ color: '#a5b4fc' }}
        />

        <p
          className="text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          <strong style={{ color: '#a5b4fc' }}>
            Aviso importante:
          </strong>{' '}
          Esta herramienta no reemplaza apoyo profesional.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {[
          {
            label: 'Estado ánimo',
            value:
              avgMood > 0
                ? `${avgMood.toFixed(1)} / 5`
                : '—',
            emoji:
              MOODS.find(
                (m) =>
                  m.val === Math.round(avgMood)
              )?.emoji ?? '😐',
            color: '#10b981',
          },

          {
            label: 'Estrés',
            value:
              avgStress > 0
                ? `${avgStress.toFixed(1)} / 10`
                : '—',
            emoji: '😤',
            color:
              avgStress > 6
                ? '#ef4444'
                : '#f59e0b',
          },

          {
            label: 'Energía',
            value:
              avgEnergy > 0
                ? `${avgEnergy.toFixed(1)} / 10`
                : '—',
            emoji: '⚡',
            color: '#6366f1',
          },

          {
            label: 'Check-ins',
            value: checkins.length,
            emoji: '📊',
            color: '#8b5cf6',
          },
        ].map((s) => (
          <div
            key={s.label}
            className="glass-card p-4 text-center"
          >
            <p className="text-2xl mb-1">
              {s.emoji}
            </p>

            <p
              className="text-2xl font-bold mb-0.5"
              style={{
                color: s.color,
                fontFamily: 'var(--font-display)',
              }}
            >
              {s.value}
            </p>

            <p
              className="text-xs"
              style={{
                color: 'var(--text-muted)',
              }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Form */}
        <div className="lg:col-span-1 space-y-5">

          <div className="glass-card p-5">

            <h3
              className="font-bold mb-1"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--text-primary)',
              }}
            >
              Check-in de hoy
            </h3>

            <p
              className="text-xs mb-5"
              style={{
                color: 'var(--text-muted)',
              }}
            >
              {new Date().toLocaleDateString(
                'es-CO',
                {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                }
              )}
            </p>

            <p
              className="text-sm font-medium mb-3"
              style={{
                color: 'var(--text-secondary)',
              }}
            >
              ¿Cómo te sientes hoy?
            </p>

            <div className="grid grid-cols-5 gap-1.5 mb-5">

              {MOODS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() =>
                    !submitted &&
                    setSelectedMood(m.key)
                  }
                  disabled={submitted}
                  title={m.label}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200"
                  style={{
                    background:
                      selectedMood === m.key
                        ? `${m.color}20`
                        : 'var(--surface-2)',

                    border: `1px solid ${
                      selectedMood === m.key
                        ? m.color
                        : 'var(--surface-border)'
                    }`,
                  }}
                >
                  <span className="text-2xl">
                    {m.emoji}
                  </span>

                  <span
                    className="text-xs hidden sm:block"
                    style={{
                      color:
                        selectedMood === m.key
                          ? m.color
                          : 'var(--text-muted)',
                    }}
                  >
                    {m.label}
                  </span>
                </button>
              ))}
            </div>

            {selectedMood && !submitted && (
              <div className="space-y-4 mb-5">

                <SliderInput
                  label="Estrés"
                  value={form.stressLevel}
                  onChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      stressLevel: v,
                    }))
                  }
                  icon={<Brain className="w-4 h-4" />}
                  color="#f97316"
                />

                <SliderInput
                  label="Energía"
                  value={form.energyLevel}
                  onChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      energyLevel: v,
                    }))
                  }
                  icon={<Zap className="w-4 h-4" />}
                  color="#6366f1"
                />

                <SliderInput
                  label="Motivación"
                  value={form.motivation}
                  onChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      motivation: v,
                    }))
                  }
                  icon={<Heart className="w-4 h-4" />}
                  color="#10b981"
                />

                <SliderInput
                  label="Ansiedad"
                  value={form.anxiety}
                  onChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      anxiety: v,
                    }))
                  }
                  icon={<Wind className="w-4 h-4" />}
                  color="#8b5cf6"
                />

                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      notes: e.target.value,
                    }))
                  }
                  className="input-field resize-none text-sm"
                  rows={3}
                  placeholder="Notas opcionales..."
                />
              </div>
            )}

            {submitted ? (
              <div className="text-center py-4">

                <p className="text-3xl mb-2">
                  {currentMood?.emoji ?? '✅'}
                </p>

                <p
                  className="font-semibold mb-1"
                  style={{
                    color:
                      currentMood?.color ??
                      '#10b981',
                  }}
                >
                  Check-in completado
                </p>

                <p
                  className="text-xs"
                  style={{
                    color: 'var(--text-muted)',
                  }}
                >
                  Vuelve mañana
                </p>
              </div>
            ) : (
              <button
                onClick={submit}
                disabled={
                  !selectedMood || submitting
                }
                className="btn-primary w-full py-3 disabled:opacity-50"
              >
                {submitting
                  ? 'Guardando...'
                  : '💚 Registrar check-in'}
              </button>
            )}
          </div>

          {/* Tips */}
          {tips.length > 0 && (
            <div
              className="glass-card p-5"
              style={{
                borderColor: `${currentMood?.color}30`,
              }}
            >
              <p
                className="font-semibold text-sm mb-3"
                style={{
                  color: currentMood?.color,
                }}
              >
                💡 Recomendaciones
              </p>

              <div className="space-y-2">

                {tips.map((tip) => (
                  <p
                    key={tip}
                    className="text-xs p-2 rounded-lg"
                    style={{
                      background:
                        'var(--surface-2)',
                      color:
                        'var(--text-secondary)',
                    }}
                  >
                    {tip}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">

          {chartData.length > 0 && (
            <div className="glass-card p-5">

              <p
                className="font-semibold text-sm mb-4"
                style={{
                  color: 'var(--text-primary)',
                }}
              >
                Tendencia emocional
              </p>

              <ResponsiveContainer
                width="100%"
                height={220}
              >
                <AreaChart data={chartData}>

                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                  />

                  <YAxis hide />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="estado"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.2}
                  />

                  <Area
                    type="monotone"
                    dataKey="energía"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.2}
                  />

                  <Area
                    type="monotone"
                    dataKey="motivación"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {checkins.length > 0 && (
            <div className="glass-card p-5">

              <p
                className="font-semibold text-sm mb-4"
                style={{
                  color: 'var(--text-primary)',
                }}
              >
                Perfil promedio
              </p>

              <ResponsiveContainer
                width="100%"
                height={240}
              >
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis
                    dataKey="subject"
                  />

                  <Radar
                    dataKey="A"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}