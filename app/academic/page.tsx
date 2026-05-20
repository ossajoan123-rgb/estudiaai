// app/academic/page.tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { format, isPast, isToday, isTomorrow } from 'date-fns'
import { es } from 'date-fns/locale'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import {
  Plus, Trash2, Edit2, ChevronDown, ChevronUp, BookOpen,
  AlertTriangle, CheckCircle2, Clock, Target, ClipboardList, X, Save
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Grade { id: string; name: string; score: number; maxScore: number; weight: number; type: string; gradedAt: string }
interface Subject { id: string; name: string; code?: string; teacher?: string; color: string; credits: number; targetGrade: number; minGrade: number; grades: Grade[]; currentAvg?: number; pendingWeight?: number }
interface Task { id: string; title: string; description?: string; dueDate?: string; priority: string; status: string; type: string; estimatedMinutes?: number; subject?: { name: string; color: string } }

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f43f5e','#84cc16']
const PRIORITY_COLORS: Record<string,string> = { URGENT:'#ef4444', HIGH:'#f97316', MEDIUM:'#f59e0b', LOW:'#6366f1' }
const GRADE_TYPES = ['EXAM','QUIZ','HOMEWORK','PROJECT','PARTICIPATION','MIDTERM','FINAL','OTHER']
const TASK_TYPES = ['HOMEWORK','EXAM_PREP','PROJECT','READING','PRACTICE','OTHER']

function calcAvg(grades: Grade[]) {
  if (!grades.length) return null
  const total = grades.reduce((s, g) => s + g.weight, 0)
  if (total === 0) return null
  return grades.reduce((s, g) => s + (g.score / g.maxScore) * 5 * (g.weight / total), 0)
}

function calcNeeded(grades: Grade[], target: number) {
  const usedWeight = grades.reduce((s, g) => s + g.weight, 0)
  const remaining = 100 - usedWeight
  if (remaining <= 0) return null
  const currentWeighted = grades.reduce((s, g) => s + (g.score / g.maxScore) * 5 * g.weight, 0)
  const needed = (target * 100 - currentWeighted) / remaining
  return Math.min(5, Math.max(0, needed))
}

// ─── SubjectCard ──────────────────────────────────────────────────────────────
function SubjectCard({ subject, onAddGrade, onDelete }: {
  subject: Subject
  onAddGrade: (s: Subject) => void
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const avg = calcAvg(subject.grades)
  const needed = calcNeeded(subject.grades, subject.targetGrade)
  const usedWeight = subject.grades.reduce((s, g) => s + g.weight, 0)
  const atRisk = avg !== null && avg < subject.minGrade

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-5">
        <div className="w-3 h-12 rounded-full flex-shrink-0" style={{ background: subject.color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{subject.name}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {subject.code && `${subject.code} · `}{subject.credits} créditos{subject.teacher && ` · ${subject.teacher}`}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {atRisk && <AlertTriangle className="w-4 h-4 text-orange-400" />}
              <div className="text-right">
                <p className="text-2xl font-bold" style={{
                  fontFamily: 'var(--font-display)',
                  color: avg === null ? 'var(--text-muted)' : atRisk ? '#f97316' : '#10b981'
                }}>
                  {avg !== null ? avg.toFixed(2) : '—'}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>/ 5.0</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
              <span>Peso evaluado: {usedWeight}%</span>
              {needed !== null && <span style={{ color: needed > 4.5 ? '#ef4444' : '#f59e0b' }}>
                Necesitas: {needed.toFixed(2)}
              </span>}
            </div>
            <div className="progress-bar h-2">
              <div className="progress-fill" style={{
                width: `${usedWeight}%`,
                background: atRisk ? 'linear-gradient(90deg,#f97316,#ef4444)' : 'linear-gradient(90deg,#6366f1,#8b5cf6)'
              }} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => onAddGrade(subject)} className="btn-ghost p-2 rounded-lg">
            <Plus className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(subject.id)} className="btn-ghost p-2 rounded-lg hover:text-red-400">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={() => setExpanded(!expanded)} className="btn-ghost p-2 rounded-lg">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded grades */}
      {expanded && (
        <div className="border-t px-5 pb-5 pt-4" style={{ borderColor: 'var(--surface-border)' }}>
          {subject.grades.length === 0 ? (
            <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>
              Sin notas registradas. <button onClick={() => onAddGrade(subject)} className="underline" style={{ color: '#a5b4fc' }}>Agrega la primera</button>
            </p>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                {subject.grades.map(g => (
                  <div key={g.id} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--surface-border)' }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{g.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {g.type} · Peso: {g.weight}% · {format(new Date(g.gradedAt), 'dd MMM yyyy', { locale: es })}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold" style={{ color: (g.score / g.maxScore) >= 0.6 ? '#10b981' : '#ef4444' }}>
                        {g.score.toFixed(1)} / {g.maxScore.toFixed(1)}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        = {((g.score / g.maxScore) * 5).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Mini bar chart */}
              <ResponsiveContainer width="100%" height={80}>
                <BarChart data={subject.grades.map(g => ({ name: g.name.substring(0,10), nota: (g.score/g.maxScore)*5 }))}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis domain={[0,5]} hide />
                  <Tooltip contentStyle={{ background:'#12122a', border:'1px solid rgba(99,102,241,0.2)', borderRadius:8, fontSize:11 }} />
                  <Bar dataKey="nota" radius={[4,4,0,0]}>
                    {subject.grades.map((g, i) => (
                      <Cell key={i} fill={(g.score/g.maxScore) >= 0.6 ? '#6366f1' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Modals ───────────────────────────────────────────────────────────────────
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AcademicPage() {
  const [tab, setTab] = useState<'subjects'|'tasks'>('subjects')
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [showSubjectModal, setShowSubjectModal] = useState(false)
  const [showGradeModal, setShowGradeModal] = useState<Subject|null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)

  // Forms
  const [subjectForm, setSubjectForm] = useState({ name:'', code:'', teacher:'', credits:3, color:'#6366f1', semester:'2025-1', targetGrade:4.0, minGrade:3.0 })
  const [gradeForm, setGradeForm] = useState({ name:'', score:4.0, maxScore:5.0, weight:25, type:'EXAM', gradedAt:new Date().toISOString().split('T')[0] })
  const [taskForm, setTaskForm] = useState({ title:'', description:'', dueDate:'', priority:'MEDIUM', type:'HOMEWORK', subjectId:'', estimatedMinutes:60 })
  const [saving, setSaving] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [sRes, tRes] = await Promise.all([
        fetch('/api/subjects'), fetch('/api/tasks')
      ])
      const [sData, tData] = await Promise.all([sRes.json(), tRes.json()])
      const enriched = (sData.subjects ?? []).map((s: Subject) => ({ ...s, currentAvg: calcAvg(s.grades) }))
      setSubjects(enriched)
      setTasks(tData.tasks ?? [])
    } catch { toast.error('Error cargando datos') }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function createSubject() {
    setSaving(true)
    try {
      const res = await fetch('/api/subjects', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(subjectForm) })
      if (!res.ok) throw new Error()
      toast.success('Materia creada ✅')
      setShowSubjectModal(false)
      setSubjectForm({ name:'', code:'', teacher:'', credits:3, color:'#6366f1', semester:'2025-1', targetGrade:4.0, minGrade:3.0 })
      fetchData()
    } catch { toast.error('Error creando materia') }
    setSaving(false)
  }

  async function addGrade() {
    if (!showGradeModal) return
    setSaving(true)
    try {
      const res = await fetch(`/api/subjects/${showGradeModal.id}/grades`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ...gradeForm, gradedAt: new Date(gradeForm.gradedAt).toISOString() })
      })
      if (!res.ok) throw new Error()
      toast.success('Nota registrada ✅')
      setShowGradeModal(null)
      setGradeForm({ name:'', score:4.0, maxScore:5.0, weight:25, type:'EXAM', gradedAt:new Date().toISOString().split('T')[0] })
      fetchData()
    } catch { toast.error('Error registrando nota') }
    setSaving(false)
  }

  async function createTask() {
    setSaving(true)
    try {
      const body = { ...taskForm, dueDate: taskForm.dueDate ? new Date(taskForm.dueDate).toISOString() : undefined, subjectId: taskForm.subjectId || undefined }
      const res = await fetch('/api/tasks', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
      if (!res.ok) throw new Error()
      toast.success('Tarea creada ✅')
      setShowTaskModal(false)
      setTaskForm({ title:'', description:'', dueDate:'', priority:'MEDIUM', type:'HOMEWORK', subjectId:'', estimatedMinutes:60 })
      fetchData()
    } catch { toast.error('Error creando tarea') }
    setSaving(false)
  }

  async function completeTask(id: string) {
    await fetch(`/api/tasks/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status:'COMPLETED' }) })
    toast.success('Tarea completada 🎉')
    fetchData()
  }

  async function deleteSubject(id: string) {
    if (!confirm('¿Eliminar esta materia y todas sus notas?')) return
    await fetch(`/api/subjects/${id}`, { method:'DELETE' })
    toast.success('Materia eliminada')
    fetchData()
  }

  const overallGPA = subjects.length ? subjects.reduce((s,sub) => s + (sub.currentAvg ?? 0), 0) / subjects.filter(s => s.currentAvg !== null).length : 0
  const atRisk = subjects.filter(s => s.currentAvg !== null && s.currentAvg < s.minGrade)
  const pendingTasks = tasks.filter(t => t.status !== 'COMPLETED')

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Promedio general', value: overallGPA > 0 ? overallGPA.toFixed(2) : '—', icon:'📊', color:'#6366f1' },
          { label:'Materias activas', value: subjects.length, icon:'📚', color:'#10b981' },
          { label:'En riesgo', value: atRisk.length, icon:'⚠️', color:'#f97316' },
          { label:'Tareas pendientes', value: pendingTasks.length, icon:'📋', color:'#f59e0b' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold mb-0.5" style={{ color: s.color, fontFamily:'var(--font-display)' }}>{s.value}</p>
            <p className="text-xs" style={{ color:'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {[
          { key:'subjects', label:'📚 Materias', icon: BookOpen },
          { key:'tasks', label:'📋 Tareas', icon: ClipboardList }
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: tab === t.key ? 'rgba(99,102,241,0.2)' : 'var(--surface-2)',
              color: tab === t.key ? '#a5b4fc' : 'var(--text-secondary)',
              border: `1px solid ${tab === t.key ? 'rgba(99,102,241,0.4)' : 'var(--surface-border)'}`,
            }}>
            {t.label}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => tab === 'subjects' ? setShowSubjectModal(true) : setShowTaskModal(true)}
          className="btn-primary text-sm py-2">
          <Plus className="w-4 h-4" />
          {tab === 'subjects' ? 'Nueva materia' : 'Nueva tarea'}
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      ) : tab === 'subjects' ? (
        subjects.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-6xl mb-4">📚</p>
            <p className="font-semibold text-lg mb-2" style={{ color:'var(--text-primary)' }}>Sin materias registradas</p>
            <p className="text-sm mb-6" style={{ color:'var(--text-muted)' }}>Agrega tus materias para comenzar a seguir tu progreso académico</p>
            <button onClick={() => setShowSubjectModal(true)} className="btn-primary"><Plus className="w-4 h-4" /> Agregar materia</button>
          </div>
        ) : (
          <div className="space-y-4">
            {subjects.map(s => (
              <SubjectCard key={s.id} subject={s} onAddGrade={setShowGradeModal} onDelete={deleteSubject} />
            ))}
          </div>
        )
      ) : (
        /* Tasks tab */
        <div className="space-y-3">
          {pendingTasks.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-6xl mb-4">🎉</p>
              <p className="font-semibold text-lg mb-2" style={{ color:'var(--text-primary)' }}>¡Sin tareas pendientes!</p>
              <p className="text-sm" style={{ color:'var(--text-muted)' }}>Agrega tus tareas y exámenes para nunca olvidar una entrega</p>
            </div>
          ) : pendingTasks.map(t => {
            const due = t.dueDate ? new Date(t.dueDate) : null
            const overdue = due && isPast(due) && !isToday(due)
            return (
              <div key={t.id} className="glass-card p-4 flex items-start gap-4">
                <button onClick={() => completeTask(t.id)}
                  className="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all duration-200 hover:border-indigo-400"
                  style={{ borderColor: PRIORITY_COLORS[t.priority] }} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium" style={{ color:'var(--text-primary)' }}>{t.title}</p>
                  {t.description && <p className="text-xs mt-0.5 line-clamp-1" style={{ color:'var(--text-muted)' }}>{t.description}</p>}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="badge text-xs px-2 py-0.5 rounded-md" style={{ background:`${PRIORITY_COLORS[t.priority]}20`, color:PRIORITY_COLORS[t.priority] }}>{t.priority}</span>
                    <span className="badge text-xs px-2 py-0.5 rounded-md" style={{ background:'var(--surface-3)', color:'var(--text-muted)' }}>{t.type}</span>
                    {t.subject && <span className="text-xs" style={{ color:'var(--text-muted)' }}>📚 {t.subject.name}</span>}
                    {due && (
                      <span className="text-xs flex items-center gap-1" style={{ color: overdue ? '#ef4444' : isToday(due) ? '#f59e0b' : 'var(--text-muted)' }}>
                        <Clock className="w-3 h-3" />
                        {overdue ? '⚠️ Vencida ' : ''}{format(due, 'dd MMM', { locale: es })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Modals ── */}
      {showSubjectModal && (
        <Modal title="Nueva Materia" onClose={() => setShowSubjectModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-secondary)' }}>Nombre *</label>
              <input value={subjectForm.name} onChange={e => setSubjectForm(f => ({...f, name:e.target.value}))} className="input-field" placeholder="Ej: Cálculo Diferencial" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-secondary)' }}>Código</label>
                <input value={subjectForm.code} onChange={e => setSubjectForm(f => ({...f, code:e.target.value}))} className="input-field" placeholder="MAT101" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-secondary)' }}>Créditos</label>
                <input type="number" value={subjectForm.credits} onChange={e => setSubjectForm(f => ({...f, credits:+e.target.value}))} className="input-field" min={1} max={10} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-secondary)' }}>Profesor</label>
              <input value={subjectForm.teacher} onChange={e => setSubjectForm(f => ({...f, teacher:e.target.value}))} className="input-field" placeholder="Prof. García" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-secondary)' }}>Meta (0-5)</label>
                <input type="number" value={subjectForm.targetGrade} onChange={e => setSubjectForm(f => ({...f, targetGrade:+e.target.value}))} className="input-field" min={0} max={5} step={0.1} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-secondary)' }}>Mínima (0-5)</label>
                <input type="number" value={subjectForm.minGrade} onChange={e => setSubjectForm(f => ({...f, minGrade:+e.target.value}))} className="input-field" min={0} max={5} step={0.1} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-secondary)' }}>Color</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setSubjectForm(f => ({...f, color:c}))}
                    className="w-8 h-8 rounded-lg transition-all duration-200"
                    style={{ background:c, outline: subjectForm.color===c ? `3px solid white` : 'none', outlineOffset:2 }} />
                ))}
              </div>
            </div>
            <button onClick={createSubject} disabled={!subjectForm.name || saving} className="btn-primary w-full py-3 disabled:opacity-50">
              {saving ? 'Guardando...' : <><Save className="w-4 h-4" /> Crear materia</>}
            </button>
          </div>
        </Modal>
      )}

      {showGradeModal && (
        <Modal title={`Agregar nota — ${showGradeModal.name}`} onClose={() => setShowGradeModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-secondary)' }}>Nombre de la evaluación *</label>
              <input value={gradeForm.name} onChange={e => setGradeForm(f => ({...f, name:e.target.value}))} className="input-field" placeholder="Ej: Parcial 1" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-secondary)' }}>Nota</label>
                <input type="number" value={gradeForm.score} onChange={e => setGradeForm(f => ({...f, score:+e.target.value}))} className="input-field" min={0} step={0.1} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-secondary)' }}>Sobre</label>
                <input type="number" value={gradeForm.maxScore} onChange={e => setGradeForm(f => ({...f, maxScore:+e.target.value}))} className="input-field" min={0} step={0.1} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-secondary)' }}>Peso %</label>
                <input type="number" value={gradeForm.weight} onChange={e => setGradeForm(f => ({...f, weight:+e.target.value}))} className="input-field" min={1} max={100} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-secondary)' }}>Tipo</label>
                <select value={gradeForm.type} onChange={e => setGradeForm(f => ({...f, type:e.target.value}))} className="input-field">
                  {GRADE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-secondary)' }}>Fecha</label>
                <input type="date" value={gradeForm.gradedAt} onChange={e => setGradeForm(f => ({...f, gradedAt:e.target.value}))} className="input-field" />
              </div>
            </div>
            {/* Preview */}
            <div className="p-3 rounded-xl text-sm" style={{ background:'var(--surface-2)', border:'1px solid var(--surface-border)' }}>
              <p style={{ color:'var(--text-muted)' }}>
                Equivale a: <strong style={{ color:'#a5b4fc' }}>
                  {gradeForm.maxScore > 0 ? ((gradeForm.score/gradeForm.maxScore)*5).toFixed(2) : '—'} / 5.0
                </strong>
              </p>
            </div>
            <button onClick={addGrade} disabled={!gradeForm.name || saving} className="btn-primary w-full py-3 disabled:opacity-50">
              {saving ? 'Guardando...' : <><Save className="w-4 h-4" /> Guardar nota</>}
            </button>
          </div>
        </Modal>
      )}

      {showTaskModal && (
        <Modal title="Nueva Tarea" onClose={() => setShowTaskModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-secondary)' }}>Título *</label>
              <input value={taskForm.title} onChange={e => setTaskForm(f => ({...f, title:e.target.value}))} className="input-field" placeholder="Ej: Taller de cálculo" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-secondary)' }}>Descripción</label>
              <textarea value={taskForm.description} onChange={e => setTaskForm(f => ({...f, description:e.target.value}))} className="input-field resize-none" rows={2} placeholder="Detalles adicionales..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-secondary)' }}>Prioridad</label>
                <select value={taskForm.priority} onChange={e => setTaskForm(f => ({...f, priority:e.target.value}))} className="input-field">
                  {['URGENT','HIGH','MEDIUM','LOW'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-secondary)' }}>Tipo</label>
                <select value={taskForm.type} onChange={e => setTaskForm(f => ({...f, type:e.target.value}))} className="input-field">
                  {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-secondary)' }}>Fecha límite</label>
                <input type="datetime-local" value={taskForm.dueDate} onChange={e => setTaskForm(f => ({...f, dueDate:e.target.value}))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-secondary)' }}>Tiempo estimado (min)</label>
                <input type="number" value={taskForm.estimatedMinutes} onChange={e => setTaskForm(f => ({...f, estimatedMinutes:+e.target.value}))} className="input-field" min={5} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color:'var(--text-secondary)' }}>Materia</label>
              <select value={taskForm.subjectId} onChange={e => setTaskForm(f => ({...f, subjectId:e.target.value}))} className="input-field">
                <option value="">Sin materia</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <button onClick={createTask} disabled={!taskForm.title || saving} className="btn-primary w-full py-3 disabled:opacity-50">
              {saving ? 'Guardando...' : <><Save className="w-4 h-4" /> Crear tarea</>}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
