import { Trash2, Save, Loader2 } from 'lucide-react'
import { useNote } from '../hooks/useNote'

interface Props {
  questionId: string
}

export default function NotesPanel({ questionId }: Props) {
  const { content, setContent, saving, saved, loading, deleteNote } = useNote(questionId)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin text-brand-400" size={24} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">📝 My Notes</h3>
        <div className="flex items-center gap-3">
          {saving && (
            <span className="flex items-center gap-1 text-xs text-brand-400">
              <Loader2 size={12} className="animate-spin" /> Saving...
            </span>
          )}
          {saved && !saving && (
            <span className="flex items-center gap-1 text-xs text-green-400">
              <Save size={12} /> Saved
            </span>
          )}
          {content && (
            <button
              onClick={deleteNote}
              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 size={12} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Textarea — using inline styles to guarantee visibility */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your notes here... They auto-save as you type."
        rows={8}
        style={{
          backgroundColor: '#1e293b',
          color: '#f1f5f9',
          caretColor: '#f1f5f9',
        }}
        className="w-full rounded-xl border border-slate-600 p-4 text-sm
                   font-mono resize-y focus:outline-none focus:ring-2
                   focus:ring-brand-500 transition-all"
      />

      <p className="text-xs text-slate-500">
        Notes are private and auto-saved to your account.
      </p>
    </div>
  )
}