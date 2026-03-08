import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/axios'
import { Badge } from '../components/ui/Badge'
import { Spinner } from '../components/ui/Spinner'
import type { ApiResponse, Bookmark } from '../types'
import { Trash2, BookmarkIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookmarks = (): void => {
    api.get<ApiResponse<Bookmark[]>>('/bookmarks')
      .then(res => setBookmarks(res.data.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBookmarks() }, [])

  const removeBookmark = async (questionId: string): Promise<void> => {
    try {
      await api.delete(`/bookmarks/${questionId}`)
      setBookmarks(prev => prev.filter(b => b.question_id !== questionId))
      toast.success('Bookmark removed')
    } catch {
      toast.error('Failed to remove bookmark')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-surface pt-20 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )

  return (
    <div className="min-h-screen bg-surface pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <BookmarkIcon size={24} className="text-brand-400" />
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Bookmarks</h1>
            <p className="text-slate-400 mt-0.5">{bookmarks.length} saved questions</p>
          </div>
        </div>

        {bookmarks.length === 0 ? (
          <div className="card text-center py-16">
            <BookmarkIcon size={40} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">No bookmarks yet.</p>
            <Link to="/topics" className="btn-primary inline-flex">Browse Questions</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map(bookmark => (
              <div key={bookmark.id} className="card flex items-center justify-between gap-4 group">
                <Link
                  to={`/questions/${bookmark.question_id}`}
                  className="flex-1 min-w-0"
                >
                  <p className="text-white font-medium group-hover:text-brand-400 transition-colors truncate">
                    {bookmark.questions?.title ?? 'Question'}
                  </p>
                  <div className="mt-2">
                    {bookmark.questions && (
                      <Badge
                        label={bookmark.questions.difficulty}
                        variant={bookmark.questions.difficulty}
                      />
                    )}
                  </div>
                </Link>
                <button
                  onClick={() => { void removeBookmark(bookmark.question_id) }}
                  className="text-slate-500 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}