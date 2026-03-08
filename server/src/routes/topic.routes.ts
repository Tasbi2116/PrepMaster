import { Router } from 'express'
import { getAllTopics, getTopicBySlug, createTopic, updateTopic, deleteTopic } from '../controllers/topic.controller'
import { authenticate, requireAdmin } from '../middleware/auth.middleware'

const router = Router()

router.get('/', getAllTopics)
router.get('/:slug', getTopicBySlug)
router.post('/', authenticate, requireAdmin, createTopic)
router.patch('/:id', authenticate, requireAdmin, updateTopic)
router.delete('/:id', authenticate, requireAdmin, deleteTopic)

export default router