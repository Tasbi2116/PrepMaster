import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware'
import { getAIHint } from '../controllers/ai.controller'

const router = Router()

// Protected — only logged in users can use AI hints
router.post('/hint', authenticate, getAIHint)

export default router