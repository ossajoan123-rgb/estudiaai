// components/landing/Testimonials.tsx
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Valentina Torres',
    role: 'Ingeniería de Sistemas – 3er semestre',
    avatar: 'V',
    color: '#6366f1',
    rating: 5,
    text: 'Subí mi promedio de 3.4 a 4.1 en un semestre. El sistema de hábitos y las alertas de materias en riesgo fueron clave. Ahora sé exactamente en qué enfocarme.',
  },
  {
    name: 'Sebastián Morales',
    role: 'Medicina – 4to semestre',
    avatar: 'S',
    color: '#10b981',
    rating: 5,
    text: 'El módulo de bienestar emocional me ayudó a manejar mi ansiedad antes de los parciales. Las técnicas de respiración y el check-in diario cambiaron mi mentalidad.',
  },
  {
    name: 'Camila Rodríguez',
    role: 'Derecho – 2do año',
    avatar: 'C',
    color: '#f59e0b',
    rating: 5,
    text: 'Por fin tengo todo organizado: materias, notas, tareas y hábitos en un solo lugar. El onboarding fue muy preciso diagnosticando mis problemas de procrastinación.',
  },
  {
    name: 'Andrés Jiménez',
    role: 'Administración – 5to semestre',
    avatar: 'A',
    color: '#f43f5e',
    rating: 5,
    text: 'Las recomendaciones de IA son increíblemente precisas. Me dijo que estudiaba mejor en la mañana antes de que yo mismo lo notara, y tenía toda la razón.',
  },
  {
    name: 'Laura Gómez',
    role: 'Psicología – 1er semestre',
    avatar: 'L',
    color: '#8b5cf6',
    rating: 5,
    text: 'Perfecta para adaptarme a la vida universitaria. El onboarding identificó mis dificultades y el plan personalizado fue lo que necesitaba para empezar con el pie derecho.',
  },
  {
    name: 'Diego Herrera',
    role: 'Arquitectura – 3er año',
    avatar: 'D',
    color: '#06b6d4',
    rating: 4,
    text: 'Me encanta el diseño, se siente premium y moderno. La gestión de notas me evita el estrés de calcular manualmente cuánto necesito en cada parcial.',
  },
]

export function LandingTestimonials() {
  return (
    <section id="testimonials" className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="badge badge-brand mb-4 inline-block">💬 Testimonios</span>
          <h2 className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Estudiantes reales,<br />
            <span className="gradient-text">resultados reales</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.name} className="glass-card p-6">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}99)` }}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
