import { useEffect, useState, useCallback } from 'react'
import api from '../lib/axios'
import type { ProgressStats, ApiResponse } from '../types'
import { useAuth } from '../context/AuthContext'

export const useProgress = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<ProgressStats>({ total: 0, solved: 0, attempted: 0, viewed: 0 })
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback((): void => {
    if (!user) { setLoading(false); return }
    api.get<ApiResponse<ProgressStats>>('/progress/stats')
      .then(res => setStats(res.data.data ?? { total: 0, solved: 0, attempted: 0, viewed: 0 }))
      .finally(() => setLoading(false))
  }, [user])

  useEffect(() => { fetchStats() }, [fetchStats])

  const markProgress = async (question_id: string, status: 'viewed' | 'attempted' | 'solved'): Promise<void> => {
    await api.post('/progress', { question_id, status })
    fetchStats()
  }

  return { stats, loading, markProgress }
}