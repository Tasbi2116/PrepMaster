import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import api from '../lib/axios'
import { Badge } from '../components/ui/Badge'
import { Spinner } from '../components/ui/Spinner'
import { useProgress } from '../hooks/useProgress'
import { useAuth } from '../context/AuthContext'
import type { ApiResponse, Question } from '../types'
import { Bookmark, BookmarkCheck, Eye, CheckCircle, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import NotesPanel from '../components/NotesPanel'
import AIHintPanel from '../components/AIHintPanel'

export const QuestionDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { markProgress } = useProgress()
  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAnswer, setShowAnswer] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    api.get<ApiResponse<Question>>(`/questions/${id}`)
      .then(res => {
        setQuestion(res.data.data ?? null)
        if (user) void markProgress(id, 'viewed')
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleShowAnswer = (): void => {
    setShowAnswer(true)
    if (user && id) void markProgress(id, 'attempted')
  }

  const handleMarkSolved = (): void => {
    if (user && id) {
      void markProgress(id, 'solved')
      toast.success('Marked as solved! 🎉')
    }
  }

  const toggleBookmark = async (): Promise<void> => {
    if (!user || !id) return
    setBookmarkLoading(true)
    try {
      if (bookmarked) {
        await api.delete(`/bookmarks/${id}`)
        setBookmarked(false)
        toast.success('Bookmark removed')
      } else {
        await api.post('/bookmarks', { question_id: id })
        setBookmarked(true)
        toast.success('Bookmarked!')
      }
    } catch {
      toast.error('Failed to update bookmark')
    } finally {
      setBookmarkLoading(false)
    }
  }

  // ─── Loading state ────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-surface pt-20 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )

  // ─── Not found state ──────────────────────────────────────────────────────
  if (!question) return (
    <div className="min-h-screen bg-surface pt-20 flex items-center justify-center">
      <p className="text-slate-400">Question not found.</p>
    </div>
  )

  // ─── Main render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link to="/topics" className="hover:text-white transition-colors">Topics</Link>
          <span>/</span>
          <span className="text-white">{question.title}</span>
        </div>

        {/* Question Card */}
        <div className="card mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="font-display text-xl font-bold text-white leading-snug flex-1">
              {question.title}
            </h1>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge label={question.difficulty} variant={question.difficulty} />
              {user && (
                <button
                  onClick={() => { void toggleBookmark() }}
                  disabled={bookmarkLoading}
                  className="text-slate-400 hover:text-brand-400 transition-colors"
                >
                  {bookmarked
                    ? <BookmarkCheck size={20} className="text-brand-400" />
                    : <Bookmark size={20} />}
                </button>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {question.tags.map(tag => (
              <span
                key={tag}
                className="text-xs bg-surface text-slate-400 px-2 py-0.5 rounded-full border border-surface-border"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Question Content */}
          <div className="prose prose-invert prose-sm max-w-none text-slate-300">
            <ReactMarkdown>{question.content}</ReactMarkdown>
          </div>
        </div>

        {/* Answer Section */}
        {!showAnswer ? (
          <button
            onClick={handleShowAnswer}
            className="btn-ghost w-full flex items-center justify-center gap-2 py-4 mb-6"
          >
            <Eye size={18} /> Show Answer <ChevronDown size={16} />
          </button>
        ) : (
          <div className="card border-brand-500/30 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-brand-400" />
              <h2 className="font-display font-semibold text-white">Answer</h2>
            </div>

            <div className="prose prose-invert prose-sm max-w-none text-slate-300">
              <ReactMarkdown>{question.answer}</ReactMarkdown>
            </div>

            {user && (
              <div className="mt-6 pt-4 border-t border-surface-border flex flex-col gap-4">

                {/* Mark as Solved */}
                <button
                  onClick={handleMarkSolved}
                  className="flex items-center gap-2 text-sm text-emerald-400
                 hover:text-emerald-300 transition-colors w-fit"
                >
                  <CheckCircle size={16} /> Mark as Solved
                </button>

                {/* AI Hint — only shows after answer is revealed */}
                <AIHintPanel
                  questionTitle={question.title}
                  questionContent={question.content}
                  difficulty={question.difficulty}
                />

              </div>
            )}

            {/* Notes Section — only visible to logged-in users */}
            {user && id && (
              <div className="card mt-2">
                <NotesPanel questionId={id} />
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}