import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/axios'
import { Spinner } from '../components/ui/Spinner'
import { Badge } from '../components/ui/Badge'
import type { ApiResponse, MockTest, Question, TestAttempt } from '../types'
import { Clock, ChevronLeft, ChevronRight, Send, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

interface TestWithQuestions extends MockTest {
    questions: Array<{
        id: string
        marks: number
        order_index: number
        questions: Question
    }>
}

interface Answer {
    question_id: string
    answer_given: string
    is_correct: boolean
    marks_earned: number
}

export const MockTestTakingPage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()

    const [test, setTest] = useState<TestWithQuestions | null>(null)
    const [attempt, setAttempt] = useState<TestAttempt | null>(null)
    const [loading, setLoading] = useState(true)
    const [started, setStarted] = useState(false)
    const [currentIdx, setCurrentIdx] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [timeLeft, setTimeLeft] = useState(0)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [score, setScore] = useState(0)
    const [showConfirm, setShowConfirm] = useState(false)

    useEffect(() => {
        if (!id) return
        api.get<ApiResponse<TestWithQuestions>>(`/tests/${id}`)
            .then(res => {
                setTest(res.data.data ?? null)
                setTimeLeft((res.data.data?.duration_min ?? 30) * 60)
            })
            .finally(() => setLoading(false))
    }, [id])

    const handleSubmit = useCallback(async (): Promise<void> => {
        if (!attempt || !test) return
        setSubmitting(true)

        const answerPayload: Answer[] = test.questions.map(q => ({
            question_id: q.questions.id,
            answer_given: answers[q.questions.id] ?? '',
            is_correct: false,
            marks_earned: 0,
        }))

        const elapsed = (test.duration_min * 60) - timeLeft

        try {
            await api.patch(`/tests/attempt/${attempt.id}`, {
                answers: answerPayload,
                time_taken: elapsed,
            })

            const attempted = Object.values(answers).filter(a => a.trim() !== '').length
            setScore(attempted)
            setSubmitted(true)
            toast.success('Test submitted!')
        } catch {
            toast.error('Failed to submit test')
        } finally {
            setSubmitting(false)
        }
    }, [attempt, test, answers, timeLeft])

    // Countdown timer
    useEffect(() => {
        if (!started || submitted || timeLeft <= 0) return
        if (timeLeft === 0) { void handleSubmit(); return }

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) { clearInterval(timer); void handleSubmit(); return 0 }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [started, submitted, timeLeft, handleSubmit])

    const startTest = async (): Promise<void> => {
        if (!id) return
        try {
            const res = await api.post<ApiResponse<TestAttempt>>(`/tests/${id}/attempt`)
            setAttempt(res.data.data ?? null)
            setStarted(true)
        } catch {
            toast.error('Failed to start test')
        }
    }

    const formatTime = (seconds: number): string => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0')
        const s = (seconds % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    const isWarning = timeLeft < 120 // last 2 minutes

    if (loading) return (
        <div className="min-h-screen bg-surface pt-20 flex items-center justify-center">
            <Spinner size="lg" />
        </div>
    )

    if (!test) return (
        <div className="min-h-screen bg-surface pt-20 flex items-center justify-center">
            <p className="text-slate-400">Test not found.</p>
        </div>
    )

    // ── Results Screen ──
    if (submitted) {
        const total = test.questions.length
        const attempted = score   // ← now reads the score state
        const pct = total > 0 ? Math.round((attempted / total) * 100) : 0

        return (
            <div className="min-h-screen bg-surface pt-20 pb-12 px-4 flex items-center justify-center">
                <div className="max-w-lg w-full text-center">
                    <div className="card">
                        <div className="text-6xl mb-4">🎉</div>
                        <h1 className="font-display text-3xl font-bold text-white mb-2">Test Submitted!</h1>
                        <p className="text-slate-400 mb-8">{test.title}</p>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-surface rounded-xl p-4">
                                <p className="text-2xl font-display font-bold text-brand-400">{total}</p>
                                <p className="text-xs text-slate-400 mt-1">Total Questions</p>
                            </div>
                            <div className="bg-surface rounded-xl p-4">
                                <p className="text-2xl font-display font-bold text-emerald-400">{attempted}</p>
                                <p className="text-xs text-slate-400 mt-1">Attempted</p>
                            </div>
                            <div className="bg-surface rounded-xl p-4">
                                <p className="text-2xl font-display font-bold text-amber-400">{pct}%</p>
                                <p className="text-xs text-slate-400 mt-1">Completion</p>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-surface rounded-full h-3 mb-8">
                            <div
                                className="bg-gradient-to-r from-brand-600 to-brand-400 h-3 rounded-full transition-all duration-1000"
                                style={{ width: `${pct}%` }}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => navigate('/tests')} className="btn-ghost flex-1">
                                Back to Tests
                            </button>
                            <button onClick={() => navigate('/dashboard')} className="btn-primary flex-1">
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ── Pre-start Screen ──
    if (!started) {
        return (
            <div className="min-h-screen bg-surface pt-20 pb-12 px-4 flex items-center justify-center">
                <div className="max-w-lg w-full">
                    <div className="card text-center">
                        <div className="text-5xl mb-4">{test.topics?.icon ?? '📝'}</div>
                        <h1 className="font-display text-2xl font-bold text-white mb-2">{test.title}</h1>
                        {test.description && <p className="text-slate-400 mb-6">{test.description}</p>}

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="bg-surface rounded-xl p-4">
                                <p className="text-xl font-display font-bold text-white">{test.questions.length}</p>
                                <p className="text-xs text-slate-400 mt-1">Questions</p>
                            </div>
                            <div className="bg-surface rounded-xl p-4">
                                <p className="text-xl font-display font-bold text-white">{test.duration_min} min</p>
                                <p className="text-xs text-slate-400 mt-1">Duration</p>
                            </div>
                            <div className="bg-surface rounded-xl p-4">
                                <p className="text-xl font-display font-bold text-white">{test.total_marks}</p>
                                <p className="text-xs text-slate-400 mt-1">Total Marks</p>
                            </div>
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 text-left">
                            <div className="flex items-center gap-2 text-amber-400 font-medium mb-2">
                                <AlertTriangle size={16} /> Instructions
                            </div>
                            <ul className="text-slate-400 text-sm space-y-1">
                                <li>• Timer starts as soon as you click Start</li>
                                <li>• You can navigate between questions freely</li>
                                <li>• Test auto-submits when time runs out</li>
                                <li>• Write your answers in the text box provided</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => { void startTest() }}
                            className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
                        >
                            <Clock size={18} /> Start Test
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // ── Test Taking Screen ──
    const currentQ = test.questions[currentIdx]
    const question = currentQ?.questions
    const answered = Object.values(answers).filter(a => a.trim() !== '').length

    return (
        <div className="min-h-screen bg-surface pt-16 pb-12">

            {/* Top bar */}
            <div className={`fixed top-16 left-0 right-0 z-40 border-b px-4 py-3 flex items-center justify-between
        ${isWarning ? 'bg-red-500/10 border-red-500/30' : 'bg-surface-card border-surface-border'}`}>
                <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-sm hidden sm:block">{test.title}</span>
                    <span className="text-xs text-slate-500">{answered}/{test.questions.length} answered</span>
                </div>

                <div className={`flex items-center gap-2 font-mono text-lg font-bold
          ${isWarning ? 'text-red-400' : 'text-white'}`}>
                    <Clock size={18} className={isWarning ? 'animate-pulse' : ''} />
                    {formatTime(timeLeft)}
                </div>

                <button
                    onClick={() => setShowConfirm(true)}
                    className="btn-primary flex items-center gap-2 text-sm py-2"
                >
                    <Send size={14} /> Submit
                </button>
            </div>

            <div className="flex h-full pt-14">

                {/* Question Panel */}
                <div className="flex-1 px-4 max-w-3xl mx-auto py-6">

                    {/* Progress */}
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-slate-400">
                            Question {currentIdx + 1} of {test.questions.length}
                        </span>
                        {question && <Badge label={question.difficulty} variant={question.difficulty} />}
                    </div>

                    {/* Question */}
                    {question && (
                        <div className="card mb-6">
                            <h2 className="font-display text-lg font-semibold text-white mb-4">
                                {question.title}
                            </h2>
                            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {question.content.replace(/^#+ /gm, '').split('\n')[0]}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-4">
                                {question.tags.map(tag => (
                                    <span key={tag} className="text-xs bg-surface text-slate-400 px-2 py-0.5 rounded-full border border-surface-border">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Answer box */}
                    {question && (
                        <div className="card">
                            <label className="block text-sm font-medium text-slate-300 mb-3">
                                Your Answer
                            </label>
                            <textarea
                                className="input resize-none font-mono text-sm"
                                rows={8}
                                placeholder="Write your answer here..."
                                value={answers[question.id] ?? ''}
                                onChange={e => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                            />
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-6">
                        <button
                            onClick={() => setCurrentIdx(p => Math.max(0, p - 1))}
                            disabled={currentIdx === 0}
                            className="btn-ghost flex items-center gap-2 disabled:opacity-40"
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>

                        <div className="flex items-center gap-1">
                            {test.questions.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIdx(i)}
                                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all
                    ${i === currentIdx
                                            ? 'bg-brand-600 text-white'
                                            : answers[test.questions[i]?.questions.id ?? '']?.trim()
                                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                : 'bg-surface text-slate-400 border border-surface-border hover:border-brand-500/50'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentIdx(p => Math.min(test.questions.length - 1, p + 1))}
                            disabled={currentIdx === test.questions.length - 1}
                            className="btn-ghost flex items-center gap-2 disabled:opacity-40"
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirm Submit Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-surface-card border border-surface-border rounded-2xl p-6 w-full max-w-sm text-center">
                        <Send size={32} className="text-brand-400 mx-auto mb-4" />
                        <h3 className="font-display text-xl font-bold text-white mb-2">Submit Test?</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            You have answered <strong className="text-white">{answered}</strong> out of{' '}
                            <strong className="text-white">{test.questions.length}</strong> questions.
                            This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowConfirm(false)} className="btn-ghost flex-1">
                                Continue
                            </button>
                            <button
                                onClick={() => { setShowConfirm(false); void handleSubmit() }}
                                className="btn-primary flex-1 flex items-center justify-center gap-2"
                                disabled={submitting}
                            >
                                {submitting ? <Spinner size="sm" /> : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}