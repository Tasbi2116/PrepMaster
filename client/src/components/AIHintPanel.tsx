import { useState, useRef } from 'react'
import { Sparkles, Loader2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Props {
  questionTitle:   string
  questionContent: string
  difficulty:      string
}

export default function AIHintPanel({
  questionTitle,
  questionContent,
  difficulty,
}: Props) {
  const [hint, setHint]       = useState('')
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [error, setError]     = useState('')
  const readerRef             = useRef<ReadableStreamDefaultReader | null>(null)

  const fetchHint = async (): Promise<void> => {
    // Toggle visibility if already fetched — no extra API call
    if (fetched) {
      setVisible(prev => !prev)
      return
    }

    setLoading(true)
    setVisible(true)
    setHint('')
    setError('')

    try {
      const token   = localStorage.getItem('token') ?? ''
      const baseURL = import.meta.env.VITE_API_URL ?? ''

      const response = await fetch(`${baseURL}/ai/hint`, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title:      questionTitle,
          content:    questionContent,
          difficulty,
        }),
      })

      if (!response.ok || !response.body) {
        throw new Error('Failed to connect to AI service')
      }

      const reader  = response.body.getReader()
      const decoder = new TextDecoder()
      readerRef.current = reader

      // Read SSE stream chunk by chunk
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const raw   = decoder.decode(value, { stream: true })
        const lines = raw.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue

          try {
            const parsed = JSON.parse(line.slice(6))

            if (parsed.text) {
              setHint(prev => prev + parsed.text)
            }
            if (parsed.done) {
              setFetched(true)
            }
            if (parsed.error) {
              setError(parsed.error)
            }
          } catch {
            // Skip malformed SSE chunks
          }
        }
      }
    } catch (err) {
      setError('Could not reach AI service. Please check your connection.')
      console.error('AIHintPanel error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = (): void => {
    // Cancel the stream if still in progress
    readerRef.current?.cancel()
    setVisible(false)
  }

  return (
    <div className="flex flex-col gap-3">

      {/* Trigger button */}
      <button
        onClick={() => { void fetchHint() }}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl w-fit
                   bg-gradient-to-r from-violet-600 to-purple-600
                   hover:from-violet-500 hover:to-purple-500
                   text-white text-sm font-medium
                   disabled:opacity-60 disabled:cursor-not-allowed
                   transition-all duration-200 shadow-lg shadow-violet-900/30"
      >
        {loading
          ? <Loader2 size={16} className="animate-spin" />
          : <Sparkles size={16} />
        }
        {loading
          ? 'Thinking...'
          : fetched
            ? visible ? 'Hide AI Hint' : 'Show AI Hint'
            : '✨ Get AI Hint'
        }
        {fetched && !loading && (
          visible
            ? <ChevronUp size={14} />
            : <ChevronDown size={14} />
        )}
      </button>

      {/* Hint panel */}
      {visible && (
        <div className="rounded-xl border border-violet-500/30 bg-violet-950/20 p-5">

          {/* Panel header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-violet-400" />
              <span className="text-sm font-semibold text-violet-300">
                AI Explanation
              </span>
              <span className="text-xs text-slate-500 bg-slate-800
                               px-2 py-0.5 rounded-full">
                Gemini Flash · Free
              </span>
            </div>
            <button
              onClick={handleClose}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              close
            </button>
          </div>

          {/* Error state */}
          {error && (
            <div className="flex items-start gap-2 text-sm text-red-400
                            bg-red-950/30 border border-red-500/20 rounded-lg p-3">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading state before first chunk arrives */}
          {loading && !hint && !error && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 size={14} className="animate-spin text-violet-400" />
              <span>Gemini is thinking...</span>
            </div>
          )}

          {/* Streamed markdown content */}
          {hint && (
            <div className="prose prose-invert prose-sm max-w-none text-slate-300">
              <ReactMarkdown>{hint}</ReactMarkdown>
              {/* Blinking cursor while still streaming */}
              {loading && (
                <span className="inline-block w-1.5 h-4 bg-violet-400
                                 animate-pulse ml-0.5 align-middle rounded-sm" />
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer note */}
      <p className="text-xs text-slate-600">
        Powered by Google Gemini · Free tier · For learning purposes only
      </p>
    </div>
  )
}