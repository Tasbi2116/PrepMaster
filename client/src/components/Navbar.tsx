import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen, LayoutDashboard, BookmarkIcon, ClipboardList, LogOut, Shield } from 'lucide-react'

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const { pathname } = useLocation()

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/topics', label: 'Topics', icon: <BookOpen size={16} /> },
    { to: '/bookmarks', label: 'Bookmarks', icon: <BookmarkIcon size={16} /> },
    { to: '/tests', label: 'Mock Tests', icon: <ClipboardList size={16} /> },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-card/80 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/dashboard" className="font-display font-bold text-xl text-white flex items-center gap-2">
          <span className="text-brand-400">Prep</span>Master
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${pathname.startsWith(link.to)
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-surface-border'}`}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${pathname.startsWith('/admin')
                  ? 'bg-amber-600 text-white'
                  : 'text-amber-400 hover:text-white hover:bg-surface-border'}`}
            >
              <Shield size={16} /> Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400 hidden md:block">
            👋 {user?.username}
          </span>
          <button onClick={logout} className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition-colors text-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </nav>
  )
}