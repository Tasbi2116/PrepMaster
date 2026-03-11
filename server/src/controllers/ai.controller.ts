import { GoogleGenerativeAI } from '@google/generative-ai'
import { Response } from 'express'
import { AuthenticatedRequest } from '../middleware/auth.middleware'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

export const getAIHint = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { title, content, difficulty } = req.body

  // Validate input
  if (!title || !content) {
    res.status(400).json({ error: 'Question title and content are required' })
    return
  }

  try {
    // Set headers for Server-Sent Events (real-time streaming)
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()

    // ✅ Correct model name for current Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' })

    const prompt = `You are a friendly computer science tutor helping a student understand interview concepts.

Question: "${title}"
Topic: "${content}"
Difficulty: ${difficulty}

Please explain this concept simply and clearly. Structure your response as:

## Simple Explanation
Explain like I am a beginner. Use an analogy if possible.

## Key Points to Remember
- 3 to 5 bullet points of the most important concepts

## Quick Interview Tip
One practical tip for answering this in an interview.

Keep it concise, encouraging, and easy to understand.`

    // Stream the response chunk by chunk
    const result = await model.generateContentStream(prompt)

    for await (const chunk of result.stream) {
      const text = chunk.text()
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`)
      }
    }

    // Signal completion to frontend
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
    res.end()

  } catch (err: any) {
    console.error('AI hint error:', err?.message ?? err)

    // Handle rate limit specifically
    if (err?.status === 429) {
      res.write(`data: ${JSON.stringify({
        error: 'Rate limit reached. Please wait a moment and try again.'
      })}\n\n`)
    } else {
      res.write(`data: ${JSON.stringify({
        error: 'Failed to get AI hint. Please try again.'
      })}\n\n`)
    }
    res.end()
  }
}