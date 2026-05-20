// hooks/useSubjects.ts
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

export function useSubjects() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/subjects')
      const data = await res.json()
      setSubjects(data.subjects ?? [])
    } catch {
      toast.error('Error cargando materias')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch_() }, [fetch_])
  return { subjects, loading, refetch: fetch_ }
}

// hooks/useHabits.ts — same pattern
export function useHabits() {
  const [habits, setHabits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/habits')
      const data = await res.json()
      setHabits(data.habits ?? [])
    } catch {
      toast.error('Error cargando hábitos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch_() }, [fetch_])
  return { habits, loading, refetch: fetch_ }
}

export function useTasks() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/tasks')
      const data = await res.json()
      setTasks(data.tasks ?? [])
    } catch {
      toast.error('Error cargando tareas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch_() }, [fetch_])
  return { tasks, loading, refetch: fetch_ }
}

export function useCheckins(days = 30) {
  const [checkins, setCheckins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/checkin?days=${days}`)
      const data = await res.json()
      setCheckins(data.checkins ?? [])
    } catch {
      toast.error('Error cargando check-ins')
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => { fetch_() }, [fetch_])
  return { checkins, loading, refetch: fetch_ }
}

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/recommendations')
      const data = await res.json()
      setRecommendations(data.recommendations ?? [])
    } catch {
      toast.error('Error cargando recomendaciones')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch_() }, [fetch_])
  return { recommendations, loading, refetch: fetch_ }
}
