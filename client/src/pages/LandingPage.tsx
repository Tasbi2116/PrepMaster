import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Brain, ClipboardList, TrendingUp } from 'lucide-react'

export const LandingPage = () => {
  const features = [
    { icon: <BookOpen size={24} />, title: 'Topic-wise Questions', desc: 'DSA, OS, DBMS, Networks, System Design and more' },
    { icon: <Brain size={24} />, title: 'Detailed Answers', desc: 'Every question comes with a thorough explanation' },
    { icon: <ClipboardList size={24} />, title: 'Mock Tests', desc: 'Timed tests to simulate real interview pressure' },
    { icon: <TrendingUp size={24} />, title: 'Track Progress', desc: 'Know exactly where you stand and what to improve' },
  ]

  return (
    <div className="min-h-screen bg-surface">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <span className="font-display font-bold text-2xl">
          <span className="text-brand-400">Prep</span>Master
        </span>
        <div className="flex gap-3">
          <Link to="/login" className="btn-ghost text-sm">Login</Link>
          <Link to="/register" className="btn-primary text-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm px-4 py-1.5 rounded-full mb-6">
          🚀 Built for CSE Graduates
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
          Crack Your Next<br />
          <span className="text-brand-400">Tech Interview</span>
        </h1>
        <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
          A complete preparation platform covering DSA, OS, DBMS, Networks, System Design
          and more — with mock tests and progress tracking.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-3">
            Start Preparing Free <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-ghost flex items-center justify-center gap-2 text-base px-8 py-3">
            Already have account
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="card hover:border-brand-500/50 transition-all duration-300 group">
              <div className="text-brand-400 mb-4 group-hover:scale-110 transition-transform duration-200 w-fit">
                {f.icon}
              </div>
              <h3 className="font-display font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Topics Preview */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="font-display text-3xl font-bold text-white text-center mb-12">
          Everything You Need
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { icon: '🧮', label: 'DSA', color: '#6366f1' },
            { icon: '💻', label: 'OS', color: '#f59e0b' },
            { icon: '🗄️', label: 'DBMS', color: '#10b981' },
            { icon: '🌐', label: 'Networks', color: '#3b82f6' },
            { icon: '🏗️', label: 'System Design', color: '#8b5cf6' },
            { icon: '🧱', label: 'OOP', color: '#ec4899' },
            { icon: '📊', label: 'SQL', color: '#14b8a6' },
            { icon: '🕸️', label: 'Web Dev', color: '#f97316' },
            { icon: '⚙️', label: 'Architecture', color: '#64748b' },
            { icon: '🧠', label: 'Aptitude', color: '#ef4444' },
          ].map((t, i) => (
            <div
              key={i}
              className="card flex flex-col items-center gap-2 py-6 hover:scale-105 transition-transform cursor-pointer"
              style={{ borderColor: `${t.color}40` }}
            >
              <span className="text-3xl">{t.icon}</span>
              <span className="text-sm font-medium text-slate-300">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto text-center px-6 pb-24">
        <div className="card border-brand-500/30 bg-brand-500/5 py-12">
          <h2 className="font-display text-3xl font-bold text-white mb-4">Ready to Get Hired?</h2>
          <p className="text-slate-400 mb-8">Join thousands of CSE students preparing smarter.</p>
          <Link to="/register" className="btn-primary text-base px-10 py-3 inline-flex items-center gap-2">
            Start for Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}