import type { Request, Response } from 'express'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '../lib/supabase'
import type { ApiResponse, Profile } from '../types/index'
import type { AuthenticatedRequest } from '../middleware/auth.middleware'

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, username, full_name } = req.body as {
    email: string; password: string; username: string; full_name?: string
  }

  if (!email || !password || !username) {
    res.status(400).json({ success: false, error: 'Email, password and username are required' })
    return
  }

  const { data: existing } = await supabaseAdmin
    .from('profiles').select('id').eq('username', username).single()

  if (existing) {
    res.status(409).json({ success: false, error: 'Username already taken' })
    return
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email, password, email_confirm: true,
    user_metadata: { username, full_name: full_name ?? '' },
  })

  if (error ?? !data.user) {
    res.status(400).json({ success: false, error: error?.message ?? 'Registration failed' })
    return
  }

  res.status(201).json({
    success: true,
    message: 'Registration successful! You can now log in.',
    data: { id: data.user.id, email: data.user.email ?? '' },
  })
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string }

  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Email and password are required' })
    return
  }

  const client = createClient(
    process.env['SUPABASE_URL'] ?? '',
    process.env['SUPABASE_ANON_KEY'] ?? ''
  )

  const { data, error } = await client.auth.signInWithPassword({ email, password })

  if (error ?? !data.session) {
    res.status(401).json({ success: false, error: 'Invalid email or password' })
    return
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles').select('*').eq('id', data.user.id).single()

  res.status(200).json({
    success: true,
    data: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      profile,
    },
  })
}

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { data: profile, error } = await supabaseAdmin
    .from('profiles').select('*').eq('id', req.user?.id).single()

  if (error ?? !profile) {
    res.status(404).json({ success: false, error: 'Profile not found' })
    return
  }

  const response: ApiResponse<Profile> = { success: true, data: profile as Profile }
  res.status(200).json(response)
}

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { full_name, avatar_url } = req.body as { full_name?: string; avatar_url?: string }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update({ full_name, avatar_url })
    .eq('id', req.user?.id)
    .select().single()

  if (error) {
    res.status(400).json({ success: false, error: error.message })
    return
  }

  res.status(200).json({ success: true, data })
}