import { Router } from 'express'
import { getProgress, getProgressStats, upsertProgress, getBookmarks, addBookmark, removeBookmark } from '../controllers/progress.controller'
import { authenticate } from '../middleware/auth.middleware'

const progressRouter = Router()
const bookmarkRouter = Router()

progressRouter.get('/', authenticate, getProgress)
progressRouter.get('/stats', authenticate, getProgressStats)
progressRouter.post('/', authenticate, upsertProgress)

bookmarkRouter.get('/', authenticate, getBookmarks)
bookmarkRouter.post('/', authenticate, addBookmark)
bookmarkRouter.delete('/:question_id', authenticate, removeBookmark)

export { progressRouter, bookmarkRouter }