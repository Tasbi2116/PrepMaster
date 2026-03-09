import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../hooks/useProgress'
import api from '../lib/axios'
import { Spinner } from '../components/ui/Spinner'
import { User, Mail, Edit2, Check, X, Flame, TrendingUp, BookOpen, ClipboardList } from 'lucide-react'
import toast from 'react-hot-toast'
import type { ApiResponse, Profile } from '../types'

export const ProfilePage = () => {
    const { user } = useAuth()
    const { stats, loading: statsLoading } = useProgress()
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        full_name: user?.full_name ?? '',
        avatar_url: user?.avatar_url ?? '',
    })

    const handleSave = async (): Promise<void> => {
        setSaving(true)
        try {
            await api.patch<ApiResponse<Profile>>('/auth/profile', form)
            toast.success('Profile updated!')
            setEditing(false)
            // Refresh user data
            window.location.reload()
        } catch {
            toast.error('Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    const statCards = [
        { label: 'Solved', value: stats.solved, icon: <TrendingUp size={18} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Attempted', value: stats.attempted, icon: <BookOpen size={18} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: 'Viewed', value: stats.viewed, icon: <ClipboardList size={18} />, color: 'text-brand-400', bg: 'bg-brand-500/10' },
        { label: 'Streak', value: user?.streak ?? 0, icon: <Flame size={18} />, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    ]

    const solvedPct = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0

    return (
        <div className="min-h-screen bg-surface pt-20 pb-12 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Profile Card */}
                <div className="card mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-5">
                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-2xl bg-brand-500/20 border-2 border-brand-500/30 flex items-center justify-center text-3xl overflow-hidden">
                                {user?.avatar_url
                                    ? <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                                    : <User size={32} className="text-brand-400" />
                                }
                            </div>

                            <div>
                                <h1 className="font-display text-2xl font-bold text-white">
                                    {user?.full_name ?? user?.username}
                                </h1>
                                <p className="text-slate-400 text-sm mt-0.5">@{user?.username}</p>
                                <span className={`inline-flex items-center gap-1 mt-2 text-xs px-2.5 py-0.5 rounded-full font-medium
                  ${user?.role === 'admin'
                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                        : 'bg-brand-500/20 text-brand-400 border border-brand-500/30'}`}>
                                    {user?.role === 'admin' ? '🔐 Admin' : '🎓 Student'}
                                </span>
                            </div>
                        </div>

                        {!editing && (
                            <button
                                onClick={() => setEditing(true)}
                                className="btn-ghost flex items-center gap-2 text-sm"
                            >
                                <Edit2 size={14} /> Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Edit Form */}
                    {editing && (
                        <div className="bg-surface rounded-xl p-4 mb-4 space-y-4">
                            <div>
                                <label className="block text-sm text-slate-300 mb-1.5">Full Name</label>
                                <input
                                    className="input"
                                    placeholder="Your full name"
                                    value={form.full_name}
                                    onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-300 mb-1.5">Avatar URL</label>
                                <input
                                    className="input"
                                    placeholder="https://example.com/avatar.jpg"
                                    value={form.avatar_url}
                                    onChange={e => setForm(p => ({ ...p, avatar_url: e.target.value }))}
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { void handleSave() }}
                                    className="btn-primary flex items-center gap-2 text-sm"
                                    disabled={saving}
                                >
                                    {saving ? <Spinner size="sm" /> : <><Check size={14} /> Save Changes</>}
                                </button>
                                <button
                                    onClick={() => setEditing(false)}
                                    className="btn-ghost flex items-center gap-2 text-sm"
                                >
                                    <X size={14} /> Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Mail size={15} />
                        <span>Account created {new Date(user?.created_at ?? '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {statsLoading
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="card h-20 animate-pulse" />
                        ))
                        : statCards.map((s, i) => (
                            <div key={i} className="card flex items-center gap-3 p-4">
                                <div className={`${s.bg} ${s.color} p-2.5 rounded-xl`}>{s.icon}</div>
                                <div>
                                    <p className="text-xl font-display font-bold text-white">{s.value}</p>
                                    <p className="text-xs text-slate-400">{s.label}</p>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Progress */}
                {stats.total > 0 && (
                    <div className="card">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="font-semibold text-white">Overall Progress</h2>
                            <span className="text-sm text-slate-400">{stats.solved}/{stats.total} solved</span>
                        </div>
                        <div className="w-full bg-surface rounded-full h-3 mb-2">
                            <div
                                className="bg-gradient-to-r from-brand-600 to-brand-400 h-3 rounded-full transition-all duration-700"
                                style={{ width: `${solvedPct}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-400">{solvedPct}% of tracked questions solved</p>
                    </div>
                )}
            </div>
        </div>
    )
}