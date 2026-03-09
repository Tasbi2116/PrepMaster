import type { Request, Response } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import type { ApiResponse, MockTest, TestAttempt } from '../types/index'
import type { AuthenticatedRequest } from '../middleware/auth.middleware'

// GET /api/tests
export const getAllTests = async (_req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabaseAdmin
        .from('mock_tests')
        .select('*, topics(title, slug, icon, color)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    if (error) { res.status(500).json({ success: false, error: error.message }); return }
    const response: ApiResponse<MockTest[]> = { success: true, data: data as MockTest[] }
    res.status(200).json(response)
}

// GET /api/tests/:id
export const getTestById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string }

    const { data: test, error } = await supabaseAdmin
        .from('mock_tests')
        .select('*, topics(title, slug, icon, color)')
        .eq('id', id)
        .single()

    if (error ?? !test) { res.status(404).json({ success: false, error: 'Test not found' }); return }

    const { data: testQuestions } = await supabaseAdmin
        .from('mock_test_questions')
        .select('*, questions(id, title, content, difficulty, tags)')
        .eq('test_id', id)
        .order('order_index')

    res.status(200).json({
        success: true,
        data: { ...test, questions: testQuestions ?? [] },
    })
}

// POST /api/tests (admin only)
export const createTest = async (req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabaseAdmin
        .from('mock_tests')
        .insert(req.body as Partial<MockTest>)
        .select()
        .single()

    if (error) { res.status(400).json({ success: false, error: error.message }); return }
    res.status(201).json({ success: true, data })
}

// DELETE /api/tests/:id (admin only)
export const deleteTest = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string }
    const { error } = await supabaseAdmin
        .from('mock_tests')
        .update({ is_active: false })
        .eq('id', id)

    if (error) { res.status(400).json({ success: false, error: error.message }); return }
    res.status(200).json({ success: true, message: 'Test deleted' })
}

// GET /api/tests/:id/questions (admin only)
export const getTestQuestions = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string }

    const { data, error } = await supabaseAdmin
        .from('mock_test_questions')
        .select('*, questions(id, title, difficulty, topic_id, tags)')
        .eq('test_id', id)
        .order('order_index')

    if (error) { res.status(500).json({ success: false, error: error.message }); return }
    res.status(200).json({ success: true, data })
}

// POST /api/tests/:id/questions (admin only)
export const addQuestionsToTest = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string }
    const { question_ids } = req.body as { question_ids: string[] }

    if (!question_ids?.length) {
        res.status(400).json({ success: false, error: 'No questions provided' })
        return
    }

    // Remove existing questions first to avoid duplicates
    await supabaseAdmin.from('mock_test_questions').delete().eq('test_id', id)

    // Insert new ones
    const rows = question_ids.map((qid, index) => ({
        test_id: id,
        question_id: qid,
        marks: 1,
        order_index: index,
    }))

    const { error } = await supabaseAdmin.from('mock_test_questions').insert(rows)

    if (error) { res.status(400).json({ success: false, error: error.message }); return }
    res.status(200).json({ success: true, message: `${rows.length} questions added to test` })
}

// POST /api/tests/:id/attempt
export const startAttempt = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params as { id: string }
    const { data, error } = await supabaseAdmin
        .from('test_attempts')
        .insert({ user_id: req.user?.id, test_id: id })
        .select()
        .single()

    if (error) { res.status(400).json({ success: false, error: error.message }); return }
    res.status(201).json({ success: true, data })
}

// PATCH /api/tests/attempt/:attempt_id
export const submitAttempt = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { attempt_id } = req.params as { attempt_id: string }
    const { answers, time_taken } = req.body as {
        answers: Array<{ question_id: string; answer_given: string; is_correct: boolean; marks_earned: number }>
        time_taken: number
    }

    const score = answers.reduce((sum, a) => sum + a.marks_earned, 0)
    await supabaseAdmin.from('test_attempt_answers').insert(answers.map(a => ({ ...a, attempt_id })))

    const { data, error } = await supabaseAdmin
        .from('test_attempts')
        .update({ score, time_taken, completed: true, completed_at: new Date().toISOString() })
        .eq('id', attempt_id)
        .eq('user_id', req.user?.id)
        .select()
        .single()

    if (error) { res.status(400).json({ success: false, error: error.message }); return }
    const response: ApiResponse<TestAttempt> = { success: true, data: data as TestAttempt }
    res.status(200).json(response)
}

// GET /api/tests/attempts/my
export const getMyAttempts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { data, error } = await supabaseAdmin
        .from('test_attempts')
        .select('*, mock_tests(title, duration_min, total_marks)')
        .eq('user_id', req.user?.id)
        .order('started_at', { ascending: false })

    if (error) { res.status(500).json({ success: false, error: error.message }); return }
    res.status(200).json({ success: true, data })
}