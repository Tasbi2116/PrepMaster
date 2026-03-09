import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, BookOpen, HelpCircle, ClipboardList, ArrowLeft } from 'lucide-react'

export const AdminLayout = () => {
  const links = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={16} />, end: true },
    { to: '/admin/topics', label: 'Topics', icon: <BookOpen size={16} />, end: false },
    { to: '/admin/questions', label: 'Questions', icon: <HelpCircle size={16} />, end: false },
    { to: '/admin/tests', label: 'Mock Tests', icon: <ClipboardList size={16} />, end: false },
  ]

  return (
    <div className="min-h-screen bg-surface pt-16 flex">
      {/* Sidebar */}
      <aside className="w-56 fixed left-0 top-16 bottom-0 bg-surface-card border-r border-surface-border p-4 flex flex-col gap-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
          Admin Panel
        </p>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${isActive
                ? 'bg-brand-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-surface-border'}`
            }
          >
            {link.icon} {link.label}
          </NavLink>
        ))}
        <div className="mt-auto">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-surface-border transition-all"
          >
            <ArrowLeft size={16} /> Back to App
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-56 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}