import { useEffect, useState } from 'react'
import api from '../../lib/axios'
import type { ApiResponse, Question, Topic, PaginatedResponse } from '../../types'
import { Spinner } from '../../components/ui/Spinner'
import { Badge } from '../../components/ui/Badge'
import { Plus, Pencil, Trash2, X, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

interface QuestionForm {
  topic_id: string
  title: string
  content: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string
}

const empty: QuestionForm = {
  topic_id: '', title: '', content: '', answer: '', difficulty: 'easy', tags: '',
}

export const AdminQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<QuestionForm>(empty)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [filterTopic, setFilterTopic] = useState('')
  const [activeTab, setActiveTab] = useState<'content' | 'answer'>('content')

  const fetchQuestions = (): void => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '15' })
    if (filterTopic) params.set('topic_id', filterTopic)
    api.get<ApiResponse<PaginatedResponse<Question>>>(`/questions?${params.toString()}`)
      .then(res => {
        setQuestions(res.data.data?.data ?? [])
        setTotalPages(res.data.data?.totalPages ?? 1)
        setTotal(res.data.data?.total ?? 0)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    api.get<ApiResponse<Topic[]>>('/topics').then(res => setTopics(res.data.data ?? []))
  }, [])

  useEffect(() => { fetchQuestions() }, [page, filterTopic])

  const openCreate = (): void => {
    setForm(empty)
    setEditingId(null)
    setActiveTab('content')
    setShowForm(true)
  }

  const openEdit = (q: Question): void => {
    setForm({
      topic_id: q.topic_id,
      title: q.title,
      content: q.content,
      answer: q.answer,
      difficulty: q.difficulty,
      tags: q.tags.join(', '),
    })
    setEditingId(q.id)
    setActiveTab('content')
    setShowForm(true)
  }

  const handleSave = async (): Promise<void> => {
    if (!form.title || !form.topic_id || !form.content || !form.answer) {
      toast.error('Please fill all required fields')
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    try {
      if (editingId) {
        await api.patch(`/questions/${editingId}`, payload)
        toast.success('Question updated!')
      } else {
        await api.post('/questions', payload)
        toast.success('Question created!')
      }
      setShowForm(false)
      fetchQuestions()
    } catch {
      toast.error('Failed to save question')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm('Delete this question?')) return
    try {
      await api.delete(`/questions/${id}`)
      toast.success('Question deleted')
      fetchQuestions()
    } catch {
      toast.error('Failed to delete')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Questions</h1>
          <p className="text-slate-400 mt-1">{total} questions total</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Question
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-6">
        <select className="input w-56" value={filterTopic}
          onChange={e => { setFilterTopic(e.target.value); setPage(1) }}>
          <option value="">All Topics</option>
          {topics.map(t => <option key={t.id} value={t.id}>{t.icon} {t.title}</option>)}
        </select>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-card border border-surface-border rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-border">
              <h2 className="font-display text-xl font-bold text-white">
                {editingId ? 'Edit Question' : 'New Question'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-4 flex-1">
              {/* Topic + Difficulty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Topic *</label>
                  <select className="input" value={form.topic_id}
                    onChange={e => setForm(p => ({ ...p, topic_id: e.target.value }))}>
                    <option value="">Select topic</option>
                    {topics.map(t => <option key={t.id} value={t.id}>{t.icon} {t.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Difficulty *</label>
                  <select className="input" value={form.difficulty}
                    onChange={e => setForm(p => ({ ...p, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Question Title *</label>
                <input className="input" placeholder="e.g. What is a Binary Search Tree?"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Tags (comma separated)</label>
                <input className="input" placeholder="e.g. tree, binary-search, recursion"
                  value={form.tags}
                  onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
              </div>

              {/* Content / Answer Tabs */}
              <div>
                <div className="flex gap-1 mb-3 bg-surface p-1 rounded-xl w-fit">
                  {(['content', 'answer'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize
                        ${activeTab === tab ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                      {tab === 'content' ? '📋 Question Body' : '✅ Answer'}
                    </button>
                  ))}
                </div>

                {activeTab === 'content' ? (
                  <div>
                    <label className="block text-sm text-slate-300 mb-1.5">Question Content * (Markdown supported)</label>
                    <textarea className="input font-mono text-sm resize-none" rows={8}
                      placeholder="Write the full question here... Markdown is supported&#10;&#10;Example:&#10;## What is a BST?&#10;A Binary Search Tree is..."
                      value={form.content}
                      onChange={e => setForm(p => ({ ...p, content: e.target.value }))} />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm text-slate-300 mb-1.5">Answer * (Markdown supported)</label>
                    <textarea className="input font-mono text-sm resize-none" rows={8}
                      placeholder="Write the detailed answer here... Markdown is supported&#10;&#10;Example:&#10;## Answer&#10;A BST is a tree data structure where..."
                      value={form.answer}
                      onChange={e => setForm(p => ({ ...p, answer: e.target.value }))} />
                  </div>
                )}
                <p className="text-xs text-slate-500 mt-1.5">
                  💡 Tip: Use **bold**, `code`, ## headings, and - lists for rich formatting
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-surface-border">
              <button onClick={() => { void handleSave() }}
                className="btn-primary flex items-center gap-2 flex-1 justify-center" disabled={saving}>
                {saving ? <Spinner size="sm" /> : <><Check size={16} /> Save Question</>}
              </button>
              <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Questions Table */}
      {loading
        ? <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        : (
          <div className="card overflow-hidden p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="text-left text-xs text-slate-400 font-medium px-6 py-4">Question</th>
                  <th className="text-left text-xs text-slate-400 font-medium px-6 py-4">Topic</th>
                  <th className="text-left text-xs text-slate-400 font-medium px-6 py-4">Difficulty</th>
                  <th className="text-right text-xs text-slate-400 font-medium px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.length === 0
                  ? (
                    <tr>
                      <td colSpan={4} className="text-center text-slate-400 py-12">
                        No questions yet. Click "Add Question" to get started!
                      </td>
                    </tr>
                  )
                  : questions.map((q, i) => (
                    <tr key={q.id} className={`border-b border-surface-border last:border-0 ${i % 2 === 0 ? '' : 'bg-surface/30'}`}>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-white font-medium truncate">{q.title}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {q.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs text-slate-500 bg-surface px-1.5 py-0.5 rounded border border-surface-border">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-300 text-sm">
                          {topics.find(t => t.id === q.topic_id)?.title ?? '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge label={q.difficulty} variant={q.difficulty} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(q)}
                            className="p-2 text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-all">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => { void handleDelete(q.id) }}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 p-4 border-t border-surface-border">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="btn-ghost px-3 py-2 disabled:opacity-40"><ChevronLeft size={16} /></button>
                <span className="text-slate-400 text-sm">Page {page} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="btn-ghost px-3 py-2 disabled:opacity-40"><ChevronRight size={16} /></button>
              </div>
            )}
          </div>
        )}
    </div>
  )
}