import { useEffect, useState } from 'react'
import api from '../lib/axios'
import type { Question, ApiResponse, PaginatedResponse } from '../types'

export interface Filters {
  topic_id?: string
  difficulty?: string
  search?: string
  page?: number
}

export const useQuestions = (filters: Filters = {}) => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.topic_id) params.set('topic_id', filters.topic_id)
    if (filters.difficulty) params.set('difficulty', filters.difficulty)
    if (filters.search) params.set('search', filters.search)
    if (filters.page) params.set('page', String(filters.page))
    params.set('limit', '20')

    api.get<ApiResponse<PaginatedResponse<Question>>>(`/questions?${params.toString()}`)
      .then(res => {
        setQuestions(res.data.data?.data ?? [])
        setTotal(res.data.data?.total ?? 0)
        setTotalPages(res.data.data?.totalPages ?? 1)
      })
      .catch(() => setError('Failed to load questions'))
      .finally(() => setLoading(false))
  }, [filters.topic_id, filters.difficulty, filters.search, filters.page])

  return { questions, total, totalPages, loading, error }
}