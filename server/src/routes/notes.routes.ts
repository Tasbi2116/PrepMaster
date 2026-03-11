import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware'
import {
  getNote,
  upsertNote,
  deleteNote,
  getAllNotes
} from '../controllers/notes.controller'

const router = Router()

router.get('/', authenticate, getAllNotes)
router.get('/:question_id', authenticate, getNote)
router.post('/:question_id', authenticate, upsertNote)
router.delete('/:question_id', authenticate, deleteNote)

export default router