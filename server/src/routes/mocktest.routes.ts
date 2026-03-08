import { Router } from 'express'
import { getAllTests, getTestById, startAttempt, submitAttempt, getMyAttempts } from '../controllers/mocktest.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.get('/', getAllTests)
router.get('/attempts/my', authenticate, getMyAttempts)
router.get('/:id', getTestById)
router.post('/:id/attempt', authenticate, startAttempt)
router.patch('/attempt/:attempt_id', authenticate, submitAttempt)

export default router