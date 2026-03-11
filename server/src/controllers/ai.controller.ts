import { Response } from 'express'
import { AuthenticatedRequest } from '../middleware/auth.middleware'

// ─── Gemini REST API — no SDK, no version mismatch issues ────────────────────
const GEMINI_API_URL =
    'https://generativelanguage.googleapis.com/v1/models/gemini-pro:streamGenerateContent'

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

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        res.status(500).json({ error: 'AI service is not configured' })
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

Keep your response concise, encouraging, and easy to understand.`

    try {
        // ── Call Gemini REST API ────────────────────────────────────────────────────
        const geminiRes = await fetch(
            `${GEMINI_API_URL}?key=${apiKey}&alt=sse`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024,
                    },
                }),
            }
        )

        // ── Handle non-200 from Gemini ──────────────────────────────────────────────
        if (!geminiRes.ok) {
            const errBody = await geminiRes.text()
            console.error(`Gemini API error ${geminiRes.status}:`, errBody)

            const userMessage =
                geminiRes.status === 429
                    ? 'Rate limit reached. Please wait a moment and try again.'
                    : geminiRes.status === 400
                        ? 'Invalid request to AI service. Please try again.'
                        : geminiRes.status === 403
                            ? 'AI service API key is invalid. Please contact support.'
                            : `AI service error (${geminiRes.status}). Please try again.`

            res.write(`data: ${JSON.stringify({ error: userMessage })}\n\n`)
            res.end()
            return
        }

        if (!geminiRes.body) {
            res.write(`data: ${JSON.stringify({ error: 'No response from AI service' })}\n\n`)
            res.end()
            return
        }

        // ── Stream Gemini response to client ────────────────────────────────────────
        const reader = geminiRes.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const raw = decoder.decode(value, { stream: true })
            const lines = raw.split('\n')

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue

                // Gemini sends "[DONE]" at the end
                if (line === 'data: [DONE]') {
                    res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
                    continue
                }

                try {
                    const parsed = JSON.parse(line.slice(6))

                    // Extract text from Gemini response structure
                    const text =
                        parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

                    if (text) {
                        res.write(`data: ${JSON.stringify({ text })}\n\n`)
                    }

                    // Check if Gemini signals finish
                    const finishReason = parsed?.candidates?.[0]?.finishReason
                    if (finishReason === 'STOP') {
                        res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
                    }
                } catch {
                    // Skip malformed chunks — normal in SSE streams
                }
            }
        }

        res.end()

    } catch (err: any) {
        console.error('AI hint error:', err?.message ?? err)
        res.write(`data: ${JSON.stringify({
            error: 'Failed to get AI hint. Please try again.'
        })}\n\n`)
        res.end()
    }
}