import { Router } from 'express'
import { getQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion } from '../controllers/question.controller'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'

const router = Router()

router.get('/', getQuestions)
router.get('/:id', getQuestionById)
router.post('/', authenticate, requireAdmin, createQuestion)
router.patch('/:id', authenticate, requireAdmin, updateQuestion)
router.delete('/:id', authenticate, requireAdmin, deleteQuestion)

export default router