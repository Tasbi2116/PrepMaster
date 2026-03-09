import { useEffect, useState } from 'react'
import api from '../../lib/axios'
import type { ApiResponse, Topic } from '../../types'
import { Spinner } from '../../components/ui/Spinner'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface TopicForm {
  slug: string
  title: string
  description: string
  icon: string
  color: string
  order_index: number
}

const empty: TopicForm = { slug: '', title: '', description: '', icon: '📚', color: '#6366f1', order_index: 0 }

export const AdminTopics = () => {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<TopicForm>(empty)
  const [saving, setSaving] = useState(false)

  const fetchTopics = (): void => {
    api.get<ApiResponse<Topic[]>>('/topics')
      .then(res => setTopics(res.data.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchTopics() }, [])

  const openCreate = (): void => {
    setForm(empty)
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (topic: Topic): void => {
    setForm({
      slug: topic.slug,
      title: topic.title,
      description: topic.description ?? '',
      icon: topic.icon ?? '📚',
      color: topic.color ?? '#6366f1',
      order_index: topic.order_index,
    })
    setEditingId(topic.id)
    setShowForm(true)
  }

  const handleSave = async (): Promise<void> => {
    if (!form.title || !form.slug) { toast.error('Title and slug are required'); return }
    setSaving(true)
    try {
      if (editingId) {
        await api.patch(`/topics/${editingId}`, form)
        toast.success('Topic updated!')
      } else {
        await api.post('/topics', form)
        toast.success('Topic created!')
      }
      setShowForm(false)
      fetchTopics()
    } catch {
      toast.error('Failed to save topic')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm('Delete this topic?')) return
    try {
      await api.delete(`/topics/${id}`)
      toast.success('Topic deleted')
      fetchTopics()
    } catch {
      toast.error('Failed to delete topic')
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Topics</h1>
          <p className="text-slate-400 mt-1">{topics.length} topics total</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Topic
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-card border border-surface-border rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">
                {editingId ? 'Edit Topic' : 'New Topic'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Title *</label>
                  <input className="input" placeholder="e.g. Data Structures"
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Slug *</label>
                  <input className="input" placeholder="e.g. dsa"
                    value={form.slug}
                    onChange={e => setForm(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1.5">Description</label>
                <textarea className="input resize-none" rows={2} placeholder="Short description..."
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Icon (emoji)</label>
                  <input className="input text-center text-xl" placeholder="📚"
                    value={form.icon}
                    onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Color</label>
                  <input type="color" className="w-full h-10 rounded-xl border border-surface-border bg-surface cursor-pointer"
                    value={form.color}
                    onChange={e => setForm(p => ({ ...p, color: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Order</label>
                  <input type="number" className="input"
                    value={form.order_index}
                    onChange={e => setForm(p => ({ ...p, order_index: parseInt(e.target.value, 10) }))} />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => { void handleSave() }} className="btn-primary flex items-center gap-2 flex-1 justify-center" disabled={saving}>
                {saving ? <Spinner size="sm" /> : <><Check size={16} /> Save Topic</>}
              </button>
              <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Topics Table */}
      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-border">
              <th className="text-left text-xs text-slate-400 font-medium px-6 py-4">Topic</th>
              <th className="text-left text-xs text-slate-400 font-medium px-6 py-4">Slug</th>
              <th className="text-left text-xs text-slate-400 font-medium px-6 py-4">Order</th>
              <th className="text-right text-xs text-slate-400 font-medium px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic, i) => (
              <tr key={topic.id} className={`border-b border-surface-border last:border-0 ${i % 2 === 0 ? '' : 'bg-surface/30'}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${topic.color ?? '#6366f1'}20` }}>
                      {topic.icon}
                    </div>
                    <span className="text-white font-medium">{topic.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-400 font-mono text-sm">{topic.slug}</td>
                <td className="px-6 py-4 text-slate-400">{topic.order_index}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(topic)}
                      className="p-2 text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-all">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => { void handleDelete(topic.id) }}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}