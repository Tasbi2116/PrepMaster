import { Router } from 'express'
import {
    getAllTests,
    getTestById,
    startAttempt,
    submitAttempt,
    getMyAttempts,
    createTest,
    deleteTest,
    addQuestionsToTest,
    getTestQuestions,
} from '../controllers/mocktest.controller'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'

const router = Router()

// ── Static routes FIRST (before any /:id routes) ──
router.get('/', getAllTests)
router.get('/attempts/my', authenticate, getMyAttempts)

// ── Routes with sub-paths BEFORE /:id ──
router.get('/:id/questions', authenticate, requireAdmin, getTestQuestions)
router.post('/:id/questions', authenticate, requireAdmin, addQuestionsToTest)
router.post('/:id/attempt', authenticate, startAttempt)
router.patch('/attempt/:attempt_id', authenticate, submitAttempt)

// ── Generic /:id routes LAST ──
router.get('/:id', getTestById)
router.post('/', authenticate, requireAdmin, createTest)
router.delete('/:id', authenticate, requireAdmin, deleteTest)

export default router