import { Response } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import { AuthenticatedRequest } from '../middleware/auth.middleware'

// GET /api/notes/:question_id
export const getNote = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { question_id } = req.params
        const user_id = req.user?.id

        const { data, error } = await supabaseAdmin
            .from('notes')
            .select('*')
            .eq('user_id', user_id)
            .eq('question_id', question_id)
            .single()

        if (error && error.code !== 'PGRST116') {
            return res.status(500).json({ error: error.message })
        }

        return res.json({ note: data ?? null })
    } catch (err) {
        return res.status(500).json({ error: 'Server error' })
    }
}

// POST /api/notes/:question_id  (create or update)
export const upsertNote = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { question_id } = req.params
        const user_id = req.user?.id
        const { content } = req.body

        if (content === undefined) {
            return res.status(400).json({ error: 'Content is required' })
        }

        const { data, error } = await supabaseAdmin
            .from('notes')
            .upsert(
                { user_id, question_id, content },
                { onConflict: 'user_id,question_id' }
            )
            .select()
            .single()

        if (error) return res.status(500).json({ error: error.message })

        return res.json({ note: data })
    } catch (err) {
        return res.status(500).json({ error: 'Server error' })
    }
}

// DELETE /api/notes/:question_id
export const deleteNote = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { question_id } = req.params
        const user_id = req.user?.id

        const { error } = await supabaseAdmin
            .from('notes')
            .delete()
            .eq('user_id', user_id)
            .eq('question_id', question_id)

        if (error) return res.status(500).json({ error: error.message })

        return res.json({ success: true })
    } catch (err) {
        return res.status(500).json({ error: 'Server error' })
    }
}

// GET /api/notes  (all notes for current user)
export const getAllNotes = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user_id = req.user?.id

        const { data, error } = await supabaseAdmin
            .from('notes')
            .select('*, questions(title, topic_id)')
            .eq('user_id', user_id)
            .order('updated_at', { ascending: false })

        if (error) return res.status(500).json({ error: error.message })

        return res.json({ notes: data })
    } catch (err) {
        return res.status(500).json({ error: 'Server error' })
    }
}