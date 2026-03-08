import type { Response } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import type { ApiResponse, UserProgress, Bookmark } from '../types/index'
import type { AuthenticatedRequest } from '../middleware/auth.middleware'

export const getProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { data, error } = await supabaseAdmin
    .from('user_progress').select('*, questions(title, difficulty, topic_id)')
    .eq('user_id', req.user?.id).order('updated_at', { ascending: false })

  if (error) { res.status(500).json({ success: false, error: error.message }); return }
  const response: ApiResponse<UserProgress[]> = { success: true, data: data as UserProgress[] }
  res.status(200).json(response)
}

export const getProgressStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { data, error } = await supabaseAdmin
    .from('user_progress').select('status').eq('user_id', req.user?.id)

  if (error) { res.status(500).json({ success: false, error: error.message }); return }

  res.status(200).json({
    success: true,
    data: {
      total: data.length,
      solved: data.filter(p => p.status === 'solved').length,
      attempted: data.filter(p => p.status === 'attempted').length,
      viewed: data.filter(p => p.status === 'viewed').length,
    },
  })
}

export const upsertProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { question_id, status } = req.body as { question_id: string; status: UserProgress['status'] }

  const { data, error } = await supabaseAdmin.from('user_progress').upsert(
    { user_id: req.user?.id, question_id, status, solved_at: status === 'solved' ? new Date().toISOString() : null },
    { onConflict: 'user_id,question_id' }
  ).select().single()

  if (error) { res.status(400).json({ success: false, error: error.message }); return }
  res.status(200).json({ success: true, data })
}

export const getBookmarks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { data, error } = await supabaseAdmin
    .from('bookmarks').select('*, questions(id, title, difficulty, topic_id, tags)')
    .eq('user_id', req.user?.id).order('created_at', { ascending: false })

  if (error) { res.status(500).json({ success: false, error: error.message }); return }
  const response: ApiResponse<Bookmark[]> = { success: true, data: data as Bookmark[] }
  res.status(200).json(response)
}

export const addBookmark = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { question_id } = req.body as { question_id: string }
  const { data, error } = await supabaseAdmin
    .from('bookmarks').insert({ user_id: req.user?.id, question_id }).select().single()

  if (error) { res.status(400).json({ success: false, error: error.message }); return }
  res.status(201).json({ success: true, data })
}

export const removeBookmark = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { question_id } = req.params as { question_id: string }
  const { error } = await supabaseAdmin
    .from('bookmarks').delete().eq('user_id', req.user?.id).eq('question_id', question_id)

  if (error) { res.status(400).json({ success: false, error: error.message }); return }
  res.status(200).json({ success: true, message: 'Bookmark removed' })
}