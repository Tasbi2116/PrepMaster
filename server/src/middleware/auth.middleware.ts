import type { Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import type { ApiResponse, AuthUser } from '../types/index'

export interface AuthenticatedRequest extends Request {
  user?: AuthUser
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    const response: ApiResponse<null> = { success: false, error: 'No token provided' }
    res.status(401).json(response)
    return
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    const response: ApiResponse<null> = { success: false, error: 'Invalid token format' }
    res.status(401).json(response)
    return
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token)

  if (error ?? !data.user) {
    const response: ApiResponse<null> = { success: false, error: 'Invalid or expired token' }
    res.status(401).json(response)
    return
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  req.user = {
    id: data.user.id,
    email: data.user.email ?? '',
    role: (profile?.role as 'user' | 'admin') ?? 'user',
  }

  next()
}

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'admin') {
    const response: ApiResponse<null> = { success: false, error: 'Admin access required' }
    res.status(403).json(response)
    return
  }
  next()
}