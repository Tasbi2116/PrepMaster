import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env['PORT'] ?? 5000

/* ── Middleware ── */
app.use(cors({
  origin: process.env['CLIENT_URL'] ?? 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* ── Health Check ── */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'PrepMaster API is running 🚀' })
})

/* ── Routes (to be added) ── */
// import authRoutes from './routes/auth.routes'
// import topicRoutes from './routes/topic.routes'
// import questionRoutes from './routes/question.routes'
// app.use('/api/auth', authRoutes)
// app.use('/api/topics', topicRoutes)
// app.use('/api/questions', questionRoutes)

/* ── Start ── */
app.listen(PORT, () => {
  console.info(`✅ Server running on http://localhost:${PORT}`)
})

export default app