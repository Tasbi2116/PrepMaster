import type { Request, Response } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import type { ApiResponse, Topic } from '../types/index'

export const getAllTopics = async (_req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabaseAdmin
    .from('topics').select('*').eq('is_active', true).order('order_index')

  if (error) { res.status(500).json({ success: false, error: error.message }); return }
  const response: ApiResponse<Topic[]> = { success: true, data: data as Topic[] }
  res.status(200).json(response)
}

export const getTopicBySlug = async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params as { slug: string }
  const { data, error } = await supabaseAdmin
    .from('topics').select('*').eq('slug', slug).eq('is_active', true).single()

  if (error ?? !data) { res.status(404).json({ success: false, error: 'Topic not found' }); return }
  res.status(200).json({ success: true, data })
}

export const createTopic = async (req: Request, res: Response): Promise<void> => {
  const { data, error } = await supabaseAdmin
    .from('topics').insert(req.body as Partial<Topic>).select().single()

  if (error) { res.status(400).json({ success: false, error: error.message }); return }
  res.status(201).json({ success: true, data })
}

export const updateTopic = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string }
  const { data, error } = await supabaseAdmin
    .from('topics').update(req.body as Partial<Topic>).eq('id', id).select().single()

  if (error) { res.status(400).json({ success: false, error: error.message }); return }
  res.status(200).json({ success: true, data })
}

export const deleteTopic = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params as { id: string }
  const { error } = await supabaseAdmin.from('topics').update({ is_active: false }).eq('id', id)

  if (error) { res.status(400).json({ success: false, error: error.message }); return }
  res.status(200).json({ success: true, message: 'Topic deleted' })
}