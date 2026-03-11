import { Response } from 'express'
import { AuthenticatedRequest } from '../middleware/auth.middleware'

// ─── Groq API — Free, fast, stable ───────────────────────────────────────────
// Free tier: no credit card, very generous limits, fastest inference available
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'

export const getAIHint = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { title, content, difficulty } = req.body

    // ── Validate input ──────────────────────────────────────────────────────────
    if (!title || !content) {
        res.status(400).json({ error: 'Question title and content are required' })
        return
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
        console.error('GROQ_API_KEY is not set in environment variables')
        res.status(500).json({ error: 'AI service is not configured on the server' })
        return
    }

    // ── Set SSE headers for real-time streaming ─────────────────────────────────
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders()

    const prompt = `You are a friendly computer science tutor helping a student understand interview concepts.

Question: "${title}"
Topic description: "${content}"
Difficulty level: ${difficulty}

Please explain this concept simply and clearly using this structure:

## Simple Explanation
Explain like I am a beginner. Use a real-world analogy if possible.

## Key Points to Remember
- List 3 to 5 bullet points of the most important concepts

## Quick Interview Tip
One practical tip for answering this type of question in a real interview.

Keep it concise, encouraging, and easy to understand.`

    try {
        // ── Call Groq API with streaming ────────────────────────────────────────────
        const groqRes = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1024,
                temperature: 0.7,
                stream: true,   // enable SSE streaming
            }),
        })

        // ── Handle non-200 from Groq ────────────────────────────────────────────────
        if (!groqRes.ok) {
            const errBody = await groqRes.text()
            console.error(`Groq API error ${groqRes.status}:`, errBody)

            const userMessage =
                groqRes.status === 429
                    ? 'Rate limit reached. Please wait a moment and try again.'
                    : groqRes.status === 401
                        ? 'AI service authentication failed. Please contact support.'
                        : `AI service error (${groqRes.status}). Please try again.`

            res.write(`data: ${JSON.stringify({ error: userMessage })}\n\n`)
            res.end()
            return
        }

        if (!groqRes.body) {
            res.write(`data: ${JSON.stringify({ error: 'No response from AI service' })}\n\n`)
            res.end()
            return
        }

        // ── Stream Groq SSE response to client ──────────────────────────────────────
        // Groq uses OpenAI-compatible SSE format
        const reader = groqRes.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const raw = decoder.decode(value, { stream: true })
            const lines = raw.split('\n')

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue

                // OpenAI/Groq SSE signals end of stream with [DONE]
                if (line.trim() === 'data: [DONE]') {
                    res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
                    continue
                }

                try {
                    const parsed = JSON.parse(line.slice(6))

                    // Extract text from OpenAI-compatible delta format
                    const text: string =
                        parsed?.choices?.[0]?.delta?.content ?? ''

                    if (text) {
                        res.write(`data: ${JSON.stringify({ text })}\n\n`)
                    }

                    // Check finish reason
                    const finishReason: string =
                        parsed?.choices?.[0]?.finish_reason ?? ''

                    if (finishReason === 'stop') {
                        res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
                    }
                } catch {
                    // Skip malformed SSE chunks — normal in streaming
                }
            }
        }

        res.end()

    } catch (err: any) {
        console.error('AI hint unexpected error:', err?.message ?? err)
        if (!res.writableEnded) {
            res.write(`data: ${JSON.stringify({
                error: 'Unexpected error. Please try again.'
            })}\n\n`)
            res.end()
        }
    }
}