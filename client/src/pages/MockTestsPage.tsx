import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/axios'
import { Spinner } from '../components/ui/Spinner'
import type { ApiResponse, MockTest } from '../types'
import { Clock, Target, ArrowRight } from 'lucide-react'

export const MockTestsPage = () => {
  const [tests, setTests] = useState<MockTest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<ApiResponse<MockTest[]>>('/tests')
      .then(res => setTests(res.data.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-surface pt-20 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )

  return (
    <div className="min-h-screen bg-surface pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white">Mock Tests</h1>
          <p className="text-slate-400 mt-1">Simulate real interview conditions</p>
        </div>

        {tests.length === 0 ? (
          <div className="card text-center py-16">
            <Target size={40} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No mock tests available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map(test => (
              <div key={test.id} className="card hover:border-brand-500/40 transition-all group">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{test.topics?.icon ?? '📝'}</span>
                  <span className="text-xs text-slate-400 font-medium">{test.topics?.title ?? 'General'}</span>
                </div>
                <h3 className="font-display font-semibold text-white mb-2">{test.title}</h3>
                {test.description && (
                  <p className="text-slate-400 text-sm mb-4">{test.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-5">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {test.duration_min} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Target size={14} /> {test.total_marks} marks
                  </span>
                </div>
                <Link
                  to={`/tests/${test.id}`}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                >
                  Start Test <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}