import { Link } from 'react-router-dom'
import {
  ArrowRight, BookOpen, Brain, ClipboardList, TrendingUp,
  Sparkles, CheckCircle, ChevronRight, Zap, Shield, Target
} from 'lucide-react'

export const LandingPage = () => {

  const features = [
    {
      icon: <BookOpen size={22} />,
      title: 'Topic-wise Questions',
      desc: 'DSA, OS, DBMS, Networks, System Design and more — structured for deep learning.',
      accent: '#6366f1',
    },
    {
      icon: <Brain size={22} />,
      title: 'Detailed Answers',
      desc: 'Every question comes with a thorough explanation and key takeaways.',
      accent: '#8b5cf6',
    },
    {
      icon: <ClipboardList size={22} />,
      title: 'Mock Tests',
      desc: 'Timed tests to simulate real interview pressure with instant scoring.',
      accent: '#a78bfa',
    },
    {
      icon: <TrendingUp size={22} />,
      title: 'Track Progress',
      desc: 'Know exactly where you stand and what to improve next.',
      accent: '#7c3aed',
    },
    {
      icon: <Sparkles size={22} />,
      title: 'AI-Powered Hints',
      desc: 'Stuck on a concept? Get instant AI explanations tailored to your level.',
      accent: '#c4b5fd',
    },
    {
      icon: <Target size={22} />,
      title: 'Personal Notes',
      desc: 'Write and save notes on any question. Revise anytime, anywhere.',
      accent: '#818cf8',
    },
  ]

  const topics = [
    { icon: '🧮', label: 'DSA',           color: '#6366f1' },
    { icon: '💻', label: 'OS',            color: '#f59e0b' },
    { icon: '🗄️', label: 'DBMS',         color: '#10b981' },
    { icon: '🌐', label: 'Networks',      color: '#3b82f6' },
    { icon: '🏗️', label: 'System Design', color: '#8b5cf6' },
    { icon: '🧱', label: 'OOP',           color: '#ec4899' },
    { icon: '📊', label: 'SQL',           color: '#14b8a6' },
    { icon: '🕸️', label: 'Web Dev',      color: '#f97316' },
    { icon: '⚙️', label: 'Architecture',  color: '#64748b' },
    { icon: '🧠', label: 'Aptitude',      color: '#ef4444' },
  ]

  const steps = [
    {
      step: '01', icon: <Shield size={20} />,
      title: 'Create your account',
      desc: 'Sign up free in under 30 seconds. No card required.',
    },
    {
      step: '02', icon: <BookOpen size={20} />,
      title: 'Pick a topic',
      desc: 'Choose from 10 core CSE subjects with 50+ questions each.',
    },
    {
      step: '03', icon: <Brain size={20} />,
      title: 'Learn & practice',
      desc: 'Read answers, take notes, and get AI hints when stuck.',
    },
    {
      step: '04', icon: <Zap size={20} />,
      title: 'Take mock tests',
      desc: 'Simulate real interview pressure with timed tests.',
    },
  ]

  const stats = [
    { value: '500+', label: 'Questions'    },
    { value: '10',   label: 'Core Topics'  },
    { value: 'AI',   label: 'Hint Engine'  },
    { value: '100%', label: 'Free'         },
  ]

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#080b14' }}>

      {/* ── Ambient background glows + grid ──────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', top: '-10%', right: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '30%',
          width: '700px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }} />
      </div>

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid rgba(99,102,241,0.1)',
        backdropFilter: 'blur(20px)',
        background: 'rgba(8,11,20,0.85)',
      }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.03em' }}>
            <span style={{ color: '#818cf8' }}>Prep</span>
            <span style={{ color: '#f1f5f9' }}>Master</span>
          </span>
          <div className="hidden md:flex items-center gap-8" style={{ fontSize: '0.875rem', color: '#64748b' }}>
            <a href="#features" className="hover:text-white transition-colors" style={{ color: 'inherit' }}>Features</a>
            <a href="#topics"   className="hover:text-white transition-colors" style={{ color: 'inherit' }}>Topics</a>
            <a href="#how"      className="hover:text-white transition-colors" style={{ color: 'inherit' }}>How it works</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" style={{ fontSize: '0.875rem', color: '#64748b', padding: '0.5rem 1rem' }}
              className="hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/register"
              className="transition-all duration-200"
              style={{
                fontSize: '0.875rem', fontWeight: 600,
                padding: '0.5rem 1.25rem', borderRadius: '0.6rem',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', boxShadow: '0 0 20px rgba(99,102,241,0.3)',
              }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative max-w-5xl mx-auto text-center px-6 pt-28 pb-24">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8"
          style={{
            fontSize: '0.75rem', fontWeight: 600,
            padding: '0.4rem 1rem', borderRadius: '999px',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            color: '#a5b4fc',
          }}>
          <Sparkles size={13} />
          Now with AI-Powered Hints · Completely Free
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          fontWeight: 800, lineHeight: 1.1,
          letterSpacing: '-0.03em', color: '#fff',
          marginBottom: '1.5rem',
        }}>
          Crack Your Next<br />
          <span style={{
            background: 'linear-gradient(135deg, #818cf8 0%, #c4b5fd 50%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Tech Interview
          </span>
        </h1>

        {/* Subheadline */}
        <p style={{
          color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.75,
          maxWidth: '580px', margin: '0 auto 2.5rem',
        }}>
          500+ curated CSE questions, AI-powered hints, mock tests,
          personal notes, and progress tracking — all free, forever.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link to="/register"
            className="flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              fontWeight: 700, fontSize: '1rem',
              padding: '0.875rem 2.5rem', borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', boxShadow: '0 0 30px rgba(99,102,241,0.35)',
            }}>
            Get Started Today <ArrowRight size={18} />
          </Link>
          <Link to="/login"
            className="flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              fontSize: '1rem', padding: '0.875rem 2.5rem', borderRadius: '0.75rem',
              border: '1px solid rgba(99,102,241,0.25)',
              color: '#a5b4fc', background: 'rgba(99,102,241,0.05)',
            }}>
            Already have an account <ChevronRight size={16} />
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-10">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#e2e8f0', letterSpacing: '-0.02em' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '2px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="max-w-6xl mx-auto px-6 pb-28">
        <div className="text-center mb-14">
          <p style={{ color: '#6366f1', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Everything you need
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            Built for serious preparation
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i}
              className="p-6 rounded-2xl transition-all duration-300"
              style={{
                background: 'rgba(15,20,35,0.8)',
                border: '1px solid rgba(99,102,241,0.1)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.border = `1px solid ${f.accent}45`
                el.style.background = 'rgba(20,26,48,0.9)'
                el.style.transform = 'translateY(-3px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.border = '1px solid rgba(99,102,241,0.1)'
                el.style.background = 'rgba(15,20,35,0.8)'
                el.style.transform = 'translateY(0)'
              }}
            >
              <div className="mb-4 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${f.accent}18`, color: f.accent }}>
                {f.icon}
              </div>
              <h3 style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
                {f.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.65 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI Hint Showcase ──────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.07) 100%)',
            border: '1px solid rgba(99,102,241,0.18)',
          }}>
          <div className="grid md:grid-cols-2">

            {/* Text side */}
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 mb-6 w-fit"
                style={{
                  fontSize: '0.7rem', fontWeight: 700,
                  padding: '0.35rem 0.85rem', borderRadius: '999px',
                  background: 'rgba(139,92,246,0.15)',
                  border: '1px solid rgba(139,92,246,0.2)',
                  color: '#c4b5fd', letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>
                <Sparkles size={11} /> New Feature
              </div>
              <h2 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                fontWeight: 800, color: '#f1f5f9',
                letterSpacing: '-0.02em', lineHeight: 1.2,
                marginBottom: '1rem',
              }}>
                Stuck on a concept?<br />Ask AI for a hint.
              </h2>
              <p style={{ color: '#64748b', lineHeight: 1.75, marginBottom: '2rem', fontSize: '0.9rem' }}>
                Every question has an AI-powered explanation. Get a simple
                breakdown, key points to remember, and interview tips — instantly and free.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  'Simple explanation with real-world analogies',
                  'Key bullet points to remember',
                  'Practical tips for your interview',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3" style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                    <CheckCircle size={16} style={{ color: '#6366f1', marginTop: '2px', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mock UI side */}
            <div className="p-8 lg:p-10 flex items-center justify-center">
              <div className="w-full max-w-xs rounded-2xl overflow-hidden"
                style={{ background: 'rgba(8,11,20,0.9)', border: '1px solid rgba(99,102,241,0.15)' }}>

                <div className="px-5 py-3.5 flex items-center gap-2"
                  style={{ borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
                  <Sparkles size={13} style={{ color: '#a78bfa' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#a78bfa' }}>AI Explanation</span>
                  <span style={{
                    marginLeft: 'auto', fontSize: '0.65rem', color: '#475569',
                    background: 'rgba(71,85,105,0.2)', padding: '2px 8px', borderRadius: '999px',
                  }}>
                    Groq · Free
                  </span>
                </div>

                <div className="p-5 flex flex-col gap-4">
                  {/* Simple explanation skeleton */}
                  <div>
                    <p style={{ fontSize: '0.65rem', color: '#6366f1', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Simple Explanation
                    </p>
                    {[100, 88, 72].map((w, i) => (
                      <div key={i} style={{ height: '7px', background: `rgba(99,102,241,${0.15 - i * 0.03})`, borderRadius: '4px', width: `${w}%`, marginBottom: '6px' }} />
                    ))}
                  </div>
                  {/* Key points skeleton */}
                  <div>
                    <p style={{ fontSize: '0.65rem', color: '#6366f1', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Key Points
                    </p>
                    {[95, 85, 75].map((w, i) => (
                      <div key={i} className="flex items-center gap-2 mb-2">
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />
                        <div style={{ height: '6px', background: 'rgba(99,102,241,0.1)', borderRadius: '4px', width: `${w}%` }} />
                      </div>
                    ))}
                  </div>
                  {/* Tip box */}
                  <div style={{
                    background: 'rgba(99,102,241,0.08)',
                    border: '1px solid rgba(99,102,241,0.15)',
                    borderRadius: '10px', padding: '10px 12px',
                  }}>
                    <p style={{ fontSize: '0.65rem', color: '#818cf8', fontWeight: 700, marginBottom: '6px' }}>
                      💡 Interview Tip
                    </p>
                    <div style={{ height: '6px', background: 'rgba(99,102,241,0.15)', borderRadius: '4px', width: '90%' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Topics Preview ────────────────────────────────────────────────── */}
      <section id="topics" className="max-w-6xl mx-auto px-6 pb-28">
        <div className="text-center mb-14">
          <p style={{ color: '#6366f1', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            10 subjects covered
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            All the topics that matter
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {topics.map((t, i) => (
            <div key={i}
              className="flex flex-col items-center gap-3 py-7 rounded-2xl transition-all duration-300"
              style={{ background: 'rgba(15,20,35,0.8)', border: `1px solid ${t.color}20`, cursor: 'default' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.border = `1px solid ${t.color}50`
                el.style.transform = 'translateY(-4px)'
                el.style.background = 'rgba(20,26,48,0.9)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.border = `1px solid ${t.color}20`
                el.style.transform = 'translateY(0)'
                el.style.background = 'rgba(15,20,35,0.8)'
              }}
            >
              <span style={{ fontSize: '2rem' }}>{t.icon}</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1' }}>{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how" className="max-w-5xl mx-auto px-6 pb-28">
        <div className="text-center mb-14">
          <p style={{ color: '#6366f1', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Simple process
          </p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            How it works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <div key={i} className="relative p-6 rounded-2xl"
              style={{ background: 'rgba(15,20,35,0.8)', border: '1px solid rgba(99,102,241,0.1)' }}>
              {/* Big faded step number */}
              <div style={{
                fontSize: '3.5rem', fontWeight: 900, lineHeight: 1,
                color: 'rgba(99,102,241,0.1)',
                marginBottom: '0.5rem',
              }}>
                {s.step}
              </div>
              <div className="mb-3 w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}>
                {s.icon}
              </div>
              <h3 style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                {s.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.6 }}>
                {s.desc}
              </p>
              {/* Connector */}
              {i < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10
                                items-center justify-center w-6 h-6 rounded-full"
                  style={{ background: 'rgba(99,102,241,0.1)', color: 'rgba(99,102,241,0.5)' }}>
                  <ChevronRight size={14} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-28 text-center">
        <div className="relative rounded-3xl px-10 py-16 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)',
            border: '1px solid rgba(99,102,241,0.22)',
          }}>
          {/* Glow */}
          <div style={{
            position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)',
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 800, color: '#f1f5f9',
              letterSpacing: '-0.02em', marginBottom: '1rem',
            }}>
              Ready to get hired?
            </h2>
            <p style={{ color: '#64748b', marginBottom: '2.5rem', fontSize: '0.975rem', lineHeight: 1.75 }}>
              Join students who prepare smarter with PrepMaster.<br />
              Free forever. No credit card required.
            </p>
            <Link to="/register"
              className="inline-flex items-center gap-2 transition-all duration-200"
              style={{
                fontWeight: 700, fontSize: '1rem',
                padding: '0.9rem 2.75rem', borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', boxShadow: '0 0 40px rgba(99,102,241,0.4)',
              }}>
              Get Started Today <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Creator / About Section ───────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="rounded-3xl p-8 md:p-12"
          style={{
            background: 'rgba(15,20,35,0.8)',
            border: '1px solid rgba(99,102,241,0.12)',
          }}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">

            {/* Avatar / Initials */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
                  border: '1px solid rgba(99,102,241,0.3)',
                }}>
                <span style={{
                  fontSize: '1.75rem', fontWeight: 800,
                  background: 'linear-gradient(135deg, #818cf8, #c4b5fd)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  MTH
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              {/* Label */}
              <p style={{
                fontSize: '0.7rem', fontWeight: 700,
                color: '#6366f1', letterSpacing: '0.15em',
                textTransform: 'uppercase', marginBottom: '0.5rem',
              }}>
                Created & Developed by
              </p>

              {/* Name */}
              <h3 style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                fontWeight: 800, color: '#f1f5f9',
                letterSpacing: '-0.02em', marginBottom: '0.75rem',
              }}>
                Md Tasbi Hassan
              </h3>

              {/* Education badges */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{
                    background: 'rgba(99,102,241,0.08)',
                    border: '1px solid rgba(99,102,241,0.18)',
                  }}>
                  <span style={{ fontSize: '0.9rem' }}>🎓</span>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c7d2fe', lineHeight: 1.3 }}>
                      BSc (Engg.) in CSE
                    </p>
                    <p style={{ fontSize: '0.68rem', color: '#475569', lineHeight: 1.3 }}>
                      Khulna University, Khulna-9208
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{
                    background: 'rgba(139,92,246,0.08)',
                    border: '1px solid rgba(139,92,246,0.18)',
                  }}>
                  <span style={{ fontSize: '0.9rem' }}>📚</span>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ddd6fe', lineHeight: 1.3 }}>
                      MSc (Engg.) in CSE — Scholar
                    </p>
                    <p style={{ fontSize: '0.68rem', color: '#475569', lineHeight: 1.3 }}>
                      Khulna University, Khulna-9208
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side — ownership note */}
            <div className="flex-shrink-0 text-right hidden md:block">
              <p style={{ fontSize: '0.75rem', color: '#334155', lineHeight: 1.7 }}>
                © 2026 PrepMaster<br />
                All rights reserved
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid rgba(99,102,241,0.06)',
        padding: '1.5rem',
        textAlign: 'center',
      }}>
        <p style={{ color: '#1e293b', fontSize: '0.75rem' }}>
          © 2026 PrepMaster · Designed & Built by Md Tasbi Hassan · Khulna University · All rights reserved
        </p>
      </footer>

    </div>
  )
}
