import { useEffect, useState } from 'react'
import api from '../../lib/axios'
import type { ApiResponse, MockTest, Topic, Question, PaginatedResponse } from '../../types'
import { Spinner } from '../../components/ui/Spinner'
import { Badge } from '../../components/ui/Badge'
import { Plus, Trash2, X, Check, Clock, Target, ListChecks, Search } from 'lucide-react'
import toast from 'react-hot-toast'

interface TestForm {
  topic_id: string
  title: string
  description: string
  duration_min: number
  total_marks: number
}

const empty: TestForm = {
  topic_id: '', title: '', description: '', duration_min: 30, total_marks: 100,
}

export const AdminMockTests = () => {
  const [tests, setTests] = useState<MockTest[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<TestForm>(empty)
  const [saving, setSaving] = useState(false)

  // Question management
  const [managingTest, setManagingTest] = useState<MockTest | null>(null)
  const [allQuestions, setAllQuestions] = useState<Question[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [qLoading, setQLoading] = useState(false)
  const [qSearch, setQSearch] = useState('')
  const [qFilterTopic, setQFilterTopic] = useState('')
  const [savingQuestions, setSavingQuestions] = useState(false)

  const fetchTests = (): void => {
    api.get<ApiResponse<MockTest[]>>('/tests')
      .then(res => setTests(res.data.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    api.get<ApiResponse<Topic[]>>('/topics').then(res => setTopics(res.data.data ?? []))
    fetchTests()
  }, [])

  const loadQuestions = async (topicId?: string): Promise<void> => {
    setQLoading(true)
    try {
      const params = new URLSearchParams({ limit: '100' })
      if (topicId) params.set('topic_id', topicId)
      const res = await api.get<ApiResponse<PaginatedResponse<Question>>>(`/questions?${params.toString()}`)
      setAllQuestions(res.data.data?.data ?? [])
    } catch {
      toast.error('Failed to load questions')
    } finally {
      setQLoading(false)
    }
  }

  const openManageQuestions = async (test: MockTest): Promise<void> => {
    setManagingTest(test)
    setQSearch('')
    setQFilterTopic(test.topic_id ?? '')
    setQLoading(true)
    try {
      const params = new URLSearchParams({ limit: '100' })
      if (test.topic_id) params.set('topic_id', test.topic_id)
      const qRes = await api.get<ApiResponse<PaginatedResponse<Question>>>(`/questions?${params.toString()}`)
      setAllQuestions(qRes.data.data?.data ?? [])

      const selRes = await api.get<ApiResponse<Array<{ question_id: string }>>>(`/tests/${test.id}/questions`)
      const existingIds = (selRes.data.data ?? []).map((q: { question_id: string }) => q.question_id)
      setSelectedIds(new Set(existingIds))
    } catch {
      toast.error('Failed to load questions')
    } finally {
      setQLoading(false)
    }
  }

  const filteredQuestions = allQuestions.filter(q => {
    const matchSearch = q.title.toLowerCase().includes(qSearch.toLowerCase())
    const matchTopic = qFilterTopic ? q.topic_id === qFilterTopic : true
    return matchSearch && matchTopic
  })

  const toggleQuestion = (id: string): void => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const saveQuestions = async (): Promise<void> => {
    if (!managingTest) return
    setSavingQuestions(true)
    try {
      await api.post(`/tests/${managingTest.id}/questions`, {
        question_ids: Array.from(selectedIds),
      })
      toast.success(`${selectedIds.size} questions saved to test!`)
      setManagingTest(null)
    } catch {
      toast.error('Failed to save questions')
    } finally {
      setSavingQuestions(false)
    }
  }

  useEffect(() => {
    if (managingTest) {
      void loadQuestions(qFilterTopic || undefined)
    }
  }, [qFilterTopic])

  const handleSave = async (): Promise<void> => {
    if (!form.title) { toast.error('Title is required'); return }
    setSaving(true)
    try {
      await api.post('/tests', { ...form, topic_id: form.topic_id || null })
      toast.success('Mock test created!')
      setShowForm(false)
      fetchTests()
    } catch {
      toast.error('Failed to create test')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm('Delete this mock test?')) return
    try {
      await api.delete(`/tests/${id}`)
      toast.success('Test deleted')
      fetchTests()
    } catch {
      toast.error('Failed to delete')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Mock Tests</h1>
          <p className="text-slate-400 mt-1">{tests.length} tests total</p>
        </div>
        <button onClick={() => { setForm(empty); setShowForm(true) }} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Create Test
        </button>
      </div>

      {/* Create Test Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-card border border-surface-border rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">New Mock Test</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Test Title *</label>
                <input className="input" placeholder="e.g. DSA Fundamentals Test"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Topic (optional)</label>
                <select className="input" value={form.topic_id}
                  onChange={e => setForm(p => ({ ...p, topic_id: e.target.value }))}>
                  <option value="">General / Mixed</option>
                  {topics.map(t => <option key={t.id} value={t.id}>{t.icon} {t.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Description</label>
                <textarea className="input resize-none" rows={2}
                  placeholder="Brief description..."
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Duration (minutes)</label>
                  <input type="number" className="input" min={5} max={180}
                    value={form.duration_min}
                    onChange={e => setForm(p => ({ ...p, duration_min: parseInt(e.target.value, 10) }))} />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Total Marks</label>
                  <input type="number" className="input" min={10}
                    value={form.total_marks}
                    onChange={e => setForm(p => ({ ...p, total_marks: parseInt(e.target.value, 10) }))} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { void handleSave() }}
                className="btn-primary flex items-center gap-2 flex-1 justify-center" disabled={saving}>
                {saving ? <Spinner size="sm" /> : <><Check size={16} /> Create Test</>}
              </button>
              <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Questions Modal */}
      {managingTest && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-card border border-surface-border rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-surface-border">
              <div>
                <h2 className="font-display text-xl font-bold text-white">Manage Questions</h2>
                <p className="text-slate-400 text-sm mt-0.5">{managingTest.title}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-brand-400 font-medium">{selectedIds.size} selected</span>
                <button onClick={() => setManagingTest(null)} className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 p-4 border-b border-surface-border">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="input pl-9 py-2 text-sm"
                  placeholder="Search questions..."
                  value={qSearch}
                  onChange={e => setQSearch(e.target.value)}
                />
              </div>
              <select
                className="input w-48 py-2 text-sm"
                value={qFilterTopic}
                onChange={e => setQFilterTopic(e.target.value)}
              >
                <option value="">All Topics</option>
                {topics.map(t => <option key={t.id} value={t.id}>{t.icon} {t.title}</option>)}
              </select>
            </div>

            {/* Questions List */}
            <div className="overflow-y-auto flex-1 p-4 space-y-2">
              {qLoading ? (
                <div className="flex justify-center py-10"><Spinner /></div>
              ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-400">No questions found.</p>
                  <p className="text-slate-500 text-sm mt-1">Try selecting "All Topics" or add questions first in the Questions section.</p>
                </div>
              ) : (
                filteredQuestions.map(q => {
                  const isSelected = selectedIds.has(q.id)
                  return (
                    <div
                      key={q.id}
                      onClick={() => toggleQuestion(q.id)}
                      className={`flex items-center justify-between gap-4 p-4 rounded-xl border cursor-pointer transition-all select-none
                        ${isSelected
                          ? 'bg-brand-500/10 border-brand-500/50'
                          : 'bg-surface border-surface-border hover:border-slate-500'}`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                          ${isSelected ? 'bg-brand-600 border-brand-600' : 'border-surface-muted'}`}>
                          {isSelected && <Check size={12} className="text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isSelected ? 'text-brand-300' : 'text-white'}`}>
                            {q.title}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {q.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="text-xs text-slate-500 bg-surface px-1.5 py-0.5 rounded border border-surface-border">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Badge label={q.difficulty} variant={q.difficulty} />
                    </div>
                  )
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between gap-3 p-4 border-t border-surface-border">
              <p className="text-sm text-slate-400">
                {selectedIds.size === 0 ? 'Click questions to select them' : `${selectedIds.size} question${selectedIds.size > 1 ? 's' : ''} selected`}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setManagingTest(null)} className="btn-ghost text-sm">Cancel</button>
                <button
                  onClick={() => { void saveQuestions() }}
                  className="btn-primary flex items-center gap-2 text-sm"
                  disabled={savingQuestions || selectedIds.size === 0}
                >
                  {savingQuestions ? <Spinner size="sm" /> : <><Check size={14} /> Save {selectedIds.size} Questions</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tests Grid */}
      {tests.length === 0 ? (
        <div className="card text-center py-16">
          <Target size={40} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">No mock tests yet.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> Create First Test
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map(test => (
            <div key={test.id} className="card hover:border-brand-500/40 transition-all flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{test.topics?.icon ?? '📝'}</span>
                  <span className="text-xs text-slate-400">{test.topics?.title ?? 'General'}</span>
                </div>
                <button onClick={() => { void handleDelete(test.id) }}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                  <Trash2 size={14} />
                </button>
              </div>

              <h3 className="font-display font-semibold text-white mb-2">{test.title}</h3>
              {test.description && (
                <p className="text-slate-400 text-sm mb-3 line-clamp-2">{test.description}</p>
              )}

              <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                <span className="flex items-center gap-1"><Clock size={13} /> {test.duration_min} min</span>
                <span className="flex items-center gap-1"><Target size={13} /> {test.total_marks} marks</span>
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => { void openManageQuestions(test) }}
                  className="btn-ghost w-full flex items-center justify-center gap-2 text-sm py-2.5"
                >
                  <ListChecks size={15} /> Manage Questions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}