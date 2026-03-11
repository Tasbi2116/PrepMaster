import { useState, useEffect, useCallback } from 'react'
import api from '../lib/axios'

export const useNote = (questionId: string) => {
  const [content, setContent]   = useState('')
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [loading, setLoading]   = useState(true)

  // Load existing note
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${questionId}`)
        if (res.data.note) {
          setContent(res.data.note.content)
        }
      } catch (err) {
        // no note yet — that's fine
      } finally {
        setLoading(false)
      }
    }
    fetchNote()
  }, [questionId])

  // Auto-save with debounce (saves 1 second after user stops typing)
  useEffect(() => {
    if (loading) return
    setSaved(false)
    const timer = setTimeout(async () => {
      try {
        setSaving(true)
        await api.post(`/notes/${questionId}`, { content })
        setSaved(true)
      } catch (err) {
        console.error('Failed to save note')
      } finally {
        setSaving(false)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [content, questionId, loading])

  const deleteNote = useCallback(async () => {
    await api.delete(`/notes/${questionId}`)
    setContent('')
    setSaved(false)
  }, [questionId])

  return { content, setContent, saving, saved, loading, deleteNote }
}