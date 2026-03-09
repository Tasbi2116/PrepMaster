import { useEffect, useState } from 'react'
import api from '../../lib/axios'
import type { ApiResponse, Topic } from '../../types'
import { BookOpen, HelpCircle, ClipboardList, Users } from 'lucide-react'
import { Spinner } from '../../components/ui/Spinner'

export const AdminDashboard = () => {
  const [topicCount, setTopicCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<ApiResponse<Topic[]>>('/topics')
      .then(res => setTopicCount(res.data.data?.length ?? 0))
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Total Topics', value: topicCount, icon: <BookOpen size={22} />, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { label: 'Questions', value: '—', icon: <HelpCircle size={22} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Mock Tests', value: '—', icon: <ClipboardList size={22} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Users', value: '—', icon: <Users size={22} />, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  ]

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1">Manage all content from here</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c, i) => (
          <div key={i} className="card flex items-center gap-4">
            <div className={`${c.bg} ${c.color} p-3 rounded-xl`}>{c.icon}</div>
            <div>
              <p className="text-2xl font-display font-bold text-white">{c.value}</p>
              <p className="text-xs text-slate-400">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="font-display font-semibold text-white mb-2">Quick Guide</h2>
        <ul className="text-slate-400 text-sm space-y-2 mt-3">
          <li>📌 Go to <strong className="text-slate-300">Topics</strong> to add or edit subjects</li>
          <li>📌 Go to <strong className="text-slate-300">Questions</strong> to add interview questions with answers</li>
          <li>📌 Go to <strong className="text-slate-300">Mock Tests</strong> to create timed tests</li>
          <li>📌 Questions support <strong className="text-slate-300">Markdown</strong> formatting</li>
        </ul>
      </div>
    </div>
  )
}