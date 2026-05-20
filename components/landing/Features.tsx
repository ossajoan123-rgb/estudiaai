// components/landing/Features.tsx
import { BookOpen, Brain, Heart, BarChart2, Target, Zap, Calendar, Shield } from 'lucide-react'

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    color: '#6366f1',
    title: 'IA que te entiende',
    desc: 'Analiza tu historial académico, hábitos y emociones para darte recomendaciones ultra-personalizadas.',
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    color: '#10b981',
    title: 'Gestión académica total',
    desc: 'Registra materias, notas, ponderaciones y ve exactamente cuánto necesitas en cada evaluación.',
  },
  {
    icon: <Target className="w-6 h-6" />,
    color: '#f59e0b',
    title: 'Sistema de hábitos',
    desc: 'Construye hábitos de estudio sólidos con rachas, recordatorios y técnicas probadas científicamente.',
  },
  {
    icon: <Heart className="w-6 h-6" />,
    color: '#f43f5e',
    title: 'Bienestar emocional',
    desc: 'Check-ins diarios de estado emocional. Detectamos estrés y ansiedad antes de que afecten tu rendimiento.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    color: '#8b5cf6',
    title: 'Productividad aumentada',
    desc: 'Técnica Pomodoro integrada, modo deep work y planificador semanal inteligente.',
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    color: '#06b6d4',
    title: 'Planeador inteligente',
    desc: 'Organiza tus tareas, exámenes y sesiones de estudio con un calendario que se adapta a ti.',
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    color: '#f97316',
    title: 'Onboarding personalizado',
    desc: 'Cuestionario inicial que identifica tu estilo de aprendizaje, riesgos académicos y áreas de mejora.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    color: '#ec4899',
    title: 'Alertas tempranas',
    desc: 'Sistema de alertas que te avisa cuando una materia está en riesgo antes de que sea demasiado tarde.',
  },
]

export function LandingFeatures() {
  return (
    <section id="features" className="relative py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="badge badge-brand mb-4 inline-block">✨ Funcionalidades</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-balance" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Todo lo que necesitas<br />
            <span className="gradient-text">en un solo lugar</span>
          </h2>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Diseñado por educadores, psicólogos y expertos en productividad para maximizar tu potencial académico.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="glass-card p-5 group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                style={{ background: `${f.color}20`, color: f.color, border: `1px solid ${f.color}30` }}>
                {f.icon}
              </div>
              <h3 className="font-semibold mb-2 text-sm" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
