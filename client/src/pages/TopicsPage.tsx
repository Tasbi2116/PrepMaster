import { Link } from 'react-router-dom'
import { useTopics } from '../hooks/useTopics'
import { Spinner } from '../components/ui/Spinner'
import { ArrowRight } from 'lucide-react'

export const TopicsPage = () => {
  const { topics, loading } = useTopics()

  if (loading) return (
    <div className="min-h-screen bg-surface pt-20 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )

  return (
    <div className="min-h-screen bg-surface pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white">Topics</h1>
          <p className="text-slate-400 mt-1">Choose a subject to start practicing</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map(topic => (
            <Link
              key={topic.id}
              to={`/topics/${topic.slug}`}
              className="card hover:border-opacity-60 hover:scale-[1.02] transition-all duration-200 group"
              style={{ borderColor: `${topic.color ?? '#6366f1'}40` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${topic.color ?? '#6366f1'}20` }}
                >
                  {topic.icon}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-white">{topic.title}</h3>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-4">{topic.description}</p>
              <div className="flex items-center text-sm font-medium group-hover:text-brand-400 transition-colors"
                style={{ color: topic.color ?? '#6366f1' }}>
                Start Practicing <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}