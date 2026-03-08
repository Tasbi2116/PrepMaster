export interface Profile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  role: 'user' | 'admin'
  streak: number
  last_active: string | null
  created_at: string
  updated_at: string
}

export interface Topic {
  id: string
  slug: string
  title: string
  description: string | null
  icon: string | null
  color: string | null
  order_index: number
  is_active: boolean
  created_at: string
}

export interface Question {
  id: string
  topic_id: string
  title: string
  content: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  is_active: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface MockTest {
  id: string
  topic_id: string | null
  title: string
  description: string | null
  duration_min: number
  total_marks: number
  is_active: boolean
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  question_id: string
  status: 'viewed' | 'attempted' | 'solved'
  solved_at: string | null
  created_at: string
  updated_at: string
}

export interface Bookmark {
  id: string
  user_id: string
  question_id: string
  created_at: string
}

export interface TestAttempt {
  id: string
  user_id: string
  test_id: string
  score: number | null
  total_marks: number | null
  time_taken: number | null
  completed: boolean
  started_at: string
  completed_at: string | null
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AuthUser {
  id: string
  email: string
  role: 'user' | 'admin'
}