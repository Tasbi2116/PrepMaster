import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import authRoutes from './routes/auth.routes'
import topicRoutes from './routes/topic.routes'
import questionRoutes from './routes/question.routes'
import mocktestRoutes from './routes/mocktest.routes'
import { progressRouter, bookmarkRouter } from './routes/progress.routes'
import { errorHandler, notFound } from './middleware/error.middleware'

const app = express()
const PORT = process.env['PORT'] ?? 5000

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://prep-master-umber.vercel.app',
    process.env.CLIENT_URL || '',
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', message: 'PrepMaster API is running 🚀' })
})

app.use('/api/auth', authRoutes)
app.use('/api/topics', topicRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/tests', mocktestRoutes)
app.use('/api/progress', progressRouter)
app.use('/api/bookmarks', bookmarkRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => { console.info(`✅ Server running on http://localhost:${PORT}`) })

export default app