import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTopics } from '../hooks/useTopics'
import { useProgress } from '../hooks/useProgress'
import { Spinner } from '../components/ui/Spinner'
import { BookOpen, TrendingUp, Bookmark, ClipboardList, ArrowRight, Flame } from 'lucide-react'

export const DashboardPage = () => {
  const { user } = useAuth()
  const { topics, loading: topicsLoading } = useTopics()
  const { stats, loading: statsLoading } = useProgress()

  const statCards = [
    { label: 'Questions Solved', value: stats.solved, icon: <TrendingUp size={20} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Attempted', value: stats.attempted, icon: <BookOpen size={20} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Total Tracked', value: stats.total, icon: <ClipboardList size={20} />, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { label: 'Day Streak', value: user?.streak ?? 0, icon: <Flame size={20} />, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ]

  return (
    <div className="min-h-screen bg-surface pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white">
            Hey, {user?.full_name ?? user?.username} 👋
          </h1>
          <p className="text-slate-400 mt-1">Ready to level up your interview game?</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statsLoading
            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="card h-24 animate-pulse bg-surface-card" />)
            : statCards.map((s, i) => (
              <div key={i} className="card flex items-center gap-4">
                <div className={`${s.bg} ${s.color} p-3 rounded-xl`}>{s.icon}</div>
                <div>
                  <p className="text-2xl font-display font-bold text-white">{s.value}</p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              </div>
            ))}
        </div>

        {/* Progress Bar */}
        {stats.total > 0 && (
          <div className="card mb-10">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-white">Overall Progress</span>
              <span className="text-sm text-slate-400">{stats.solved}/{stats.total} solved</span>
            </div>
            <div className="w-full bg-surface rounded-full h-3">
              <div
                className="bg-gradient-to-r from-brand-600 to-brand-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.round((stats.solved / stats.total) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {Math.round((stats.solved / stats.total) * 100)}% complete
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Link to="/topics" className="card hover:border-brand-500/50 transition-all group flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Browse Topics</p>
              <p className="text-sm text-slate-400 mt-0.5">Pick a subject to study</p>
            </div>
            <ArrowRight size={18} className="text-slate-500 group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
          </Link>
          <Link to="/bookmarks" className="card hover:border-brand-500/50 transition-all group flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">My Bookmarks</p>
              <p className="text-sm text-slate-400 mt-0.5">Review saved questions</p>
            </div>
            <Bookmark size={18} className="text-slate-500 group-hover:text-brand-400 transition-colors" />
          </Link>
          <Link to="/tests" className="card hover:border-brand-500/50 transition-all group flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Mock Tests</p>
              <p className="text-sm text-slate-400 mt-0.5">Test yourself under pressure</p>
            </div>
            <ClipboardList size={18} className="text-slate-500 group-hover:text-brand-400 transition-colors" />
          </Link>
        </div>

        {/* Topics Grid */}
        <div>
          <h2 className="font-display text-xl font-bold text-white mb-4">All Topics</h2>
          {topicsLoading
            ? <div className="flex justify-center py-10"><Spinner /></div>
            : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {topics.map(topic => (
                  <Link
                    key={topic.id}
                    to={`/topics/${topic.slug}`}
                    className="card flex flex-col items-center gap-2 py-6 hover:scale-105 transition-all duration-200 cursor-pointer text-center"
                    style={{ borderColor: `${topic.color ?? '#6366f1'}40` }}
                  >
                    <span className="text-3xl">{topic.icon}</span>
                    <span className="text-sm font-medium text-slate-200">{topic.title}</span>
                  </Link>
                ))}
              </div>
            )}
        </div>
      </div>
    </div>
  )
}