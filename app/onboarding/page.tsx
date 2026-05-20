// app/onboarding/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, BookOpen, Check } from 'lucide-react'
import { toast } from 'sonner'

// ─── Types ───────────────────────────────────────────────────────────────────
type Answer = string | number | boolean | string[]

interface StepData {
  [key: string]: Answer
}

// ─── All steps config ────────────────────────────────────────────────────────
const TOTAL_STEPS = 5

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round(((step - 1) / total) * 100)
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          Paso {step} de {total}
        </span>
        <span className="text-xs font-medium" style={{ color: '#a5b4fc' }}>{pct}% completado</span>
      </div>
      <div className="progress-bar h-2">
        <div className="progress-fill h-full" style={{ width: `${pct}%` }} />
      </div>
      {/* Step dots */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: i < step - 1 ? '#6366f1' : i === step - 1 ? '#a5b4fc' : 'var(--surface-3)',
              boxShadow: i === step - 1 ? '0 0 8px #6366f1' : 'none',
            }} />
        ))}
      </div>
    </div>
  )
}

function SliderQuestion({ label, min, max, value, onChange, lowLabel, highLabel }:
  { label: string; min: number; max: number; value: number; onChange: (v: number) => void; lowLabel?: string; highLabel?: string }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</label>
        <span className="text-2xl font-bold gradient-text">{value}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #6366f1 ${((value - min) / (max - min)) * 100}%, var(--surface-3) 0)`,
          outline: 'none',
        }}
      />
      {(lowLabel || highLabel) && (
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{lowLabel}</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{highLabel}</span>
        </div>
      )}
    </div>
  )
}

function OptionCard({ label, selected, onClick, emoji }: { label: string; selected: boolean; onClick: () => void; emoji?: string }) {
  return (
    <button onClick={onClick} type="button"
      className="flex items-center gap-3 p-4 rounded-xl text-sm font-medium transition-all duration-200 text-left w-full"
      style={{
        background: selected ? 'rgba(99,102,241,0.2)' : 'var(--surface-2)',
        border: `1px solid ${selected ? 'rgba(99,102,241,0.5)' : 'var(--surface-border)'}`,
        color: selected ? '#a5b4fc' : 'var(--text-secondary)',
        boxShadow: selected ? '0 0 15px rgba(99,102,241,0.2)' : 'none',
      }}>
      {emoji && <span className="text-xl">{emoji}</span>}
      <span className="flex-1">{label}</span>
      {selected && <Check className="w-4 h-4 flex-shrink-0" />}
    </button>
  )
}

// ─── Step components ──────────────────────────────────────────────────────────
function Step1Welcome({ data, setData }: { data: StepData; setData: (d: StepData) => void }) {
  return (
    <div>
      <div className="text-5xl mb-4">👋</div>
      <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
        ¡Cuéntanos sobre<br /><span className="gradient-text">tus hábitos!</span>
      </h2>
      <p className="mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Esto nos ayuda a crear tu perfil académico personalizado. Sé honesto, no hay respuestas incorrectas.
      </p>

      <SliderQuestion
        label="¿Cuántas horas estudias al día en promedio?"
        min={0} max={12} value={(data.studyHoursPerDay as number) ?? 3}
        onChange={v => setData({ ...data, studyHoursPerDay: v })}
        lowLabel="Casi nada" highLabel="Todo el día"
      />
      <SliderQuestion
        label="Nivel de procrastinación (1 = nunca, 10 = siempre)"
        min={1} max={10} value={(data.procrastinationLevel as number) ?? 5}
        onChange={v => setData({ ...data, procrastinationLevel: v })}
        lowLabel="Súper disciplinado" highLabel="Procrastino todo"
      />
      <SliderQuestion
        label="¿Qué tan organizado/a eres? (1 = caos total, 10 = muy organizado)"
        min={1} max={10} value={(data.organizationLevel as number) ?? 5}
        onChange={v => setData({ ...data, organizationLevel: v })}
        lowLabel="Caos total" highLabel="Muy organizado"
      />
      <SliderQuestion
        label="Nivel de distracción al estudiar (1 = nada, 10 = mucho)"
        min={1} max={10} value={(data.distractionsLevel as number) ?? 5}
        onChange={v => setData({ ...data, distractionsLevel: v })}
        lowLabel="Enfoque total" highLabel="Me distraigo mucho"
      />
    </div>
  )
}

function Step2StudyMethod({ data, setData }: { data: StepData; setData: (d: StepData) => void }) {
  const methods = [
    { value: 'POMODORO', label: 'Técnica Pomodoro', emoji: '🍅', desc: '25 min estudio + 5 descanso' },
    { value: 'DEEP_WORK', label: 'Deep Work', emoji: '🔥', desc: 'Bloques largos de concentración' },
    { value: 'SPACED_REPETITION', label: 'Repetición espaciada', emoji: '🧠', desc: 'Repasos con intervals crecientes' },
    { value: 'MIND_MAPPING', label: 'Mapas mentales', emoji: '🗺️', desc: 'Organizo visualmente el contenido' },
    { value: 'ACTIVE_RECALL', label: 'Recuerdo activo', emoji: '💡', desc: 'Me pregunto a mí mismo el contenido' },
    { value: 'CORNELL_NOTES', label: 'Método Cornell', emoji: '📝', desc: 'Notas estructuradas con resúmenes' },
    { value: 'MIXED', label: 'Mezcla de varios', emoji: '🎯', desc: 'Combino diferentes métodos' },
  ]

  const schedule = data.studySchedule as { morning: boolean; afternoon: boolean; night: boolean } ??
    { morning: false, afternoon: true, night: true }

  return (
    <div>
      <div className="text-5xl mb-4">📚</div>
      <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
        ¿Cómo prefieres<br /><span className="gradient-text">estudiar?</span>
      </h2>
      <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Selecciona el método que más usas actualmente.
      </p>

      <div className="grid grid-cols-1 gap-2 mb-6">
        {methods.map(m => (
          <OptionCard key={m.value} emoji={m.emoji}
            label={`${m.label} — ${m.desc}`}
            selected={data.studyMethod === m.value}
            onClick={() => setData({ ...data, studyMethod: m.value })}
          />
        ))}
      </div>

      <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>¿En qué horario estudias mejor?</p>
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: 'morning', label: '🌅 Mañana', desc: '6am – 12pm' },
          { key: 'afternoon', label: '☀️ Tarde', desc: '12pm – 6pm' },
          { key: 'night', label: '🌙 Noche', desc: '6pm – 12am' },
        ].map(h => (
          <button key={h.key} type="button"
            onClick={() => setData({ ...data, studySchedule: { ...schedule, [h.key]: !schedule[h.key as keyof typeof schedule] } })}
            className="p-3 rounded-xl text-center text-sm transition-all duration-200"
            style={{
              background: schedule[h.key as keyof typeof schedule] ? 'rgba(99,102,241,0.2)' : 'var(--surface-2)',
              border: `1px solid ${schedule[h.key as keyof typeof schedule] ? 'rgba(99,102,241,0.5)' : 'var(--surface-border)'}`,
              color: schedule[h.key as keyof typeof schedule] ? '#a5b4fc' : 'var(--text-secondary)',
            }}>
            <div className="font-medium">{h.label}</div>
            <div className="text-xs mt-1 opacity-70">{h.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

function Step3Academic({ data, setData }: { data: StepData; setData: (d: StepData) => void }) {
  return (
    <div>
      <div className="text-5xl mb-4">🎓</div>
      <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
        Tu situación<br /><span className="gradient-text">académica</span>
      </h2>
      <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Cuéntanos sobre tu estado académico actual.
      </p>

      <div className="mb-5">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
          ¿En qué semestre/año estás?
        </label>
        <input type="text" value={(data.currentSemester as string) ?? ''}
          onChange={e => setData({ ...data, currentSemester: e.target.value })}
          className="input-field" placeholder="Ej: 3er semestre, 2do año..." />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
          ¿Cuál es tu promedio actual? (0.0 – 5.0)
        </label>
        <input type="number" min="0" max="5" step="0.1"
          value={(data.currentGPA as number) ?? ''}
          onChange={e => setData({ ...data, currentGPA: parseFloat(e.target.value) })}
          className="input-field" placeholder="Ej: 3.8" />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
          ¿Cuál es tu objetivo académico principal?
        </label>
        <textarea value={(data.academicGoal as string) ?? ''}
          onChange={e => setData({ ...data, academicGoal: e.target.value })}
          className="input-field min-h-20 resize-none"
          placeholder="Ej: Mantener promedio sobre 4.0, aprobar todas las materias, graduarme con honores..." />
      </div>

      <SliderQuestion
        label="¿Cuántas horas duermes por noche?"
        min={3} max={12} value={(data.sleepHoursPerNight as number) ?? 7}
        onChange={v => setData({ ...data, sleepHoursPerNight: v })}
        lowLabel="Muy poco" highLabel="Bastante"
      />
    </div>
  )
}

function Step4Emotional({ data, setData }: { data: StepData; setData: (d: StepData) => void }) {
  return (
    <div>
      <div className="text-5xl mb-4">💚</div>
      <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
        ¿Cómo está tu<br /><span className="gradient-text">bienestar emocional?</span>
      </h2>
      <p className="mb-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Sé honesto. Esta información es confidencial y nos ayuda a darte mejor apoyo.
      </p>
      <div className="p-3 rounded-xl mb-6 text-xs" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', color: 'var(--text-muted)' }}>
        ⚠️ EstudiaAI no reemplaza atención psicológica profesional. Si sientes que necesitas ayuda,
        por favor busca apoyo de un profesional de salud mental.
      </div>

      <SliderQuestion
        label="Nivel de estrés actual (1 = relajado, 10 = muy estresado)"
        min={1} max={10} value={(data.stressLevel as number) ?? 5}
        onChange={v => setData({ ...data, stressLevel: v })}
        lowLabel="Muy relajado" highLabel="Muy estresado"
      />
      <SliderQuestion
        label="Nivel de ansiedad académica (1 = ninguna, 10 = mucha)"
        min={1} max={10} value={(data.anxietyLevel as number) ?? 4}
        onChange={v => setData({ ...data, anxietyLevel: v })}
        lowLabel="Sin ansiedad" highLabel="Mucha ansiedad"
      />
      <SliderQuestion
        label="¿Qué tan motivado/a te sientes? (1 = nada, 10 = muy motivado)"
        min={1} max={10} value={(data.motivationLevel as number) ?? 6}
        onChange={v => setData({ ...data, motivationLevel: v })}
        lowLabel="Sin motivación" highLabel="Muy motivado"
      />
      <SliderQuestion
        label="Nivel de energía general (1 = muy cansado, 10 = con energía)"
        min={1} max={10} value={(data.energyLevel as number) ?? 6}
        onChange={v => setData({ ...data, energyLevel: v })}
        lowLabel="Agotado" highLabel="Con energía"
      />
      <SliderQuestion
        label="Autoestima académica (1 = muy baja, 10 = muy alta)"
        min={1} max={10} value={(data.academicSelfEsteem as number) ?? 5}
        onChange={v => setData({ ...data, academicSelfEsteem: v })}
        lowLabel="Me siento incapaz" highLabel="Muy seguro/a"
      />
    </div>
  )
}

function Step5LearningStyle({ data, setData }: { data: StepData; setData: (d: StepData) => void }) {
  const styles = [
    { value: 'VISUAL', label: 'Visual', emoji: '👁️', desc: 'Aprendo mejor con diagramas, videos, colores y mapas mentales.' },
    { value: 'AUDITORY', label: 'Auditivo', emoji: '🎧', desc: 'Me ayuda escuchar explicaciones, podcasts y discutir el tema.' },
    { value: 'KINESTHETIC', label: 'Práctico / Kinestésico', emoji: '🤲', desc: 'Aprendo haciendo ejercicios, experimentos y práctica directa.' },
    { value: 'READING_WRITING', label: 'Lectura / Escritura', emoji: '📖', desc: 'Prefiero leer libros y escribir notas detalladas.' },
  ]

  return (
    <div>
      <div className="text-5xl mb-4">🧠</div>
      <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
        ¿Cómo aprendes<br /><span className="gradient-text">mejor?</span>
      </h2>
      <p className="mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Selecciona tu estilo de aprendizaje predominante.
      </p>

      <div className="flex flex-col gap-3 mb-8">
        {styles.map(s => (
          <button key={s.value} type="button"
            onClick={() => setData({ ...data, learningStyle: s.value })}
            className="flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-200"
            style={{
              background: data.learningStyle === s.value ? 'rgba(99,102,241,0.2)' : 'var(--surface-2)',
              border: `1px solid ${data.learningStyle === s.value ? 'rgba(99,102,241,0.5)' : 'var(--surface-border)'}`,
            }}>
            <span className="text-2xl">{s.emoji}</span>
            <div>
              <p className="font-semibold text-sm mb-1" style={{ color: data.learningStyle === s.value ? '#a5b4fc' : 'var(--text-primary)' }}>
                {s.label}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
            </div>
            {data.learningStyle === s.value && (
              <div className="ml-auto w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="glass-card p-4 border-glow">
        <p className="text-sm font-medium mb-1" style={{ color: '#a5b4fc' }}>🎉 ¡Ya casi terminamos!</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Con esta información crearemos tu perfil académico personalizado y generaremos tu plan inicial de estudio y hábitos.
        </p>
      </div>
    </div>
  )
}

// ─── Main Onboarding Page ─────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter()
  const { update } = useSession()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<StepData>({
    studyHoursPerDay: 3,
    procrastinationLevel: 5,
    organizationLevel: 5,
    distractionsLevel: 5,
    studyMethod: 'MIXED',
    studySchedule: { morning: false, afternoon: true, night: false },
    currentSemester: '',
    academicGoal: '',
    currentGPA: 3.5,
    sleepHoursPerNight: 7,
    stressLevel: 5,
    anxietyLevel: 4,
    motivationLevel: 6,
    energyLevel: 6,
    academicSelfEsteem: 5,
    learningStyle: 'VISUAL',
    timeManagementScore: 5,
  })

  async function handleSubmit() {
    setLoading(true)
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Error guardando onboarding')
      await update({ onboardingCompleted: true })
      toast.success('¡Perfil creado! Bienvenido a EstudiaAI 🚀')
      router.push('/dashboard')
    } catch {
      toast.error('Error guardando tu perfil. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const steps = [Step1Welcome, Step2StudyMethod, Step3Academic, Step4Emotional, Step5LearningStyle]
  const CurrentStep = steps[step - 1]

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--surface-bg)' }}>
      {/* Ambient */}
      <div className="orb orb-brand w-96 h-96 top-0 left-0 fixed opacity-20 pointer-events-none" />
      <div className="orb orb-accent w-64 h-64 bottom-0 right-0 fixed opacity-15 pointer-events-none" />

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>EstudiaAI</span>
        </div>

        <div className="glass-card p-8">
          <ProgressBar step={step} total={TOTAL_STEPS} />

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}>
              <CurrentStep data={data} setData={setData} />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} className="btn-secondary flex-1 py-3">
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
            )}
            {step < TOTAL_STEPS ? (
              <button onClick={() => setStep(s => s + 1)} className="btn-primary flex-1 py-3">
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1 py-3 disabled:opacity-50">
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creando tu perfil...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    ¡Crear mi perfil! 🚀
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
