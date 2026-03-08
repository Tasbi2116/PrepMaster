import { useEffect, useState } from 'react'
import api from '../lib/axios'
import type { Topic, ApiResponse } from '../types'

export const useTopics = () => {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.get<ApiResponse<Topic[]>>('/topics')
      .then(res => setTopics(res.data.data ?? []))
      .catch(() => setError('Failed to load topics'))
      .finally(() => setLoading(false))
  }, [])

  return { topics, loading, error }
}