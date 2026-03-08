import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuestions, type Filters } from '../hooks/useQuestions'
import { useTopics } from '../hooks/useTopics'
import { Badge } from '../components/ui/Badge'
import { Spinner } from '../components/ui/Spinner'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

export const QuestionsPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const { topics } = useTopics()
  const topic = topics.find(t => t.slug === slug)

  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')

  const filters: Filters = { page }
  if (topic?.id) filters.topic_id = topic.id
  if (difficulty) filters.difficulty = difficulty
  if (search) filters.search = search

  const { questions, total, totalPages, loading } = useQuestions(filters)


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-surface pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/topics" className="text-slate-400 hover:text-white transition-colors text-sm">← Topics</Link>
          <span className="text-surface-muted">/</span>
          <div className="flex items-center gap-2">
            {topic && <span className="text-xl">{topic.icon}</span>}
            <h1 className="font-display text-2xl font-bold text-white">
              {topic?.title ?? 'All Questions'}
            </h1>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text" placeholder="Search questions..."
                className="input pl-9"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary px-4">Search</button>
          </form>

          <select
            className="input w-full sm:w-44"
            value={difficulty}
            onChange={e => { setDifficulty(e.target.value); setPage(1) }}
          >
            <option value="">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Count */}
        <p className="text-slate-400 text-sm mb-4">{total} questions found</p>

        {/* Questions List */}
        {loading
          ? <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          : questions.length === 0
            ? (
              <div className="card text-center py-16">
                <p className="text-slate-400">No questions found. Try adjusting your filters.</p>
              </div>
            )
            : (
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <Link
                    key={q.id}
                    to={`/questions/${q.id}`}
                    className="card flex items-start justify-between gap-4 hover:border-brand-500/40 transition-all group"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-slate-500 text-sm mt-0.5 w-6 flex-shrink-0">
                        {(page - 1) * 20 + i + 1}.
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium group-hover:text-brand-400 transition-colors truncate">
                          {q.title}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {q.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs bg-surface text-slate-400 px-2 py-0.5 rounded-full border border-surface-border">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Badge
                      label={q.difficulty}
                      variant={q.difficulty as 'easy' | 'medium' | 'hard'}
                    />
                  </Link>
                ))}
              </div>
            )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-ghost px-3 py-2 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-slate-400 text-sm">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-ghost px-3 py-2 disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}