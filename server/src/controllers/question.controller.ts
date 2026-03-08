import type { Request, Response } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import type { ApiResponse, Question, PaginatedResponse } from '../types/index'
import type { AuthenticatedRequest } from '../middleware/auth.middleware'

export const getQuestions = async (req: Request, res: Response): Promise<void> => {
  const { topic_id, difficulty, page = '1', limit = '20', search } = req.query as Record<string, string>
  const pageNum = parseInt(page, 10)
  const limitNum = parseInt(limit, 10)
  const from = (pageNum - 1) * limitNum
  const to = from + limitNum - 1

  let query = supabaseAdmin.from('questions')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (topic_id) query = query.eq('topic_id', topic_id)
  if (difficulty) query = query.eq('difficulty', difficulty)
  if (search) query = query.ilike('title', `%${search}%`)

  const { data, error, count } = await query

  if (error) { res.status(500).json({ success: false, error: error.message }); return }

  const response: ApiResponse<PaginatedResponse<Question>> = {
    success: true,
    data: { data: data as Question[], total: count ?? 0, page: pageNum, limit: limitNum, totalPages: Math.ceil((count ?? 0) / limitNum) },
  }
  res.status(200).json(response)
}

export const getQuestionById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string }
  const { data, error } = await supabaseAdmin
    .from('questions').select('*, topics(title, slug, color, icon)').eq('id', id).eq('is_active', true).single()

  if (error ?? !data) { res.status(404).json({ success: false, error: 'Question not found' }); return }
  res.status(200).json({ success: true, data })
}

export const createQuestion = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { data, error } = await supabaseAdmin
    .from('questions').insert({ ...(req.body as Partial<Question>), created_by: req.user?.id }).select().single()

  if (error) { res.status(400).json({ success: false, error: error.message }); return }
  res.status(201).json({ success: true, data })
}

export const updateQuestion = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string }
  const { data, error } = await supabaseAdmin
    .from('questions').update(req.body as Partial<Question>).eq('id', id).select().single()

  if (error) { res.status(400).json({ success: false, error: error.message }); return }
  res.status(200).json({ success: true, data })
}

export const deleteQuestion = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string }
  const { error } = await supabaseAdmin.from('questions').update({ is_active: false }).eq('id', id)

  if (error) { res.status(400).json({ success: false, error: error.message }); return }
  res.status(200).json({ success: true, message: 'Question deleted' })
}