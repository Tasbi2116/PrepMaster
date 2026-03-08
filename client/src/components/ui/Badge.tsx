interface BadgeProps {
  label: string
  variant?: 'easy' | 'medium' | 'hard' | 'default'
}

const variants = {
  easy: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  medium: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  hard: 'bg-red-500/20 text-red-400 border border-red-500/30',
  default: 'bg-brand-500/20 text-brand-400 border border-brand-500/30',
}

export const Badge = ({ label, variant = 'default' }: BadgeProps) => (
  <span className={`badge ${variants[variant]}`}>{label}</span>
)