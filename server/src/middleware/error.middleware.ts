import type { Request, Response, NextFunction } from 'express'
import type { ApiResponse } from '../types/index'

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Unhandled error:', err.message)
  const response: ApiResponse<null> = {
    success: false,
    error: process.env['NODE_ENV'] === 'production'
      ? 'Internal server error'
      : err.message,
  }
  res.status(500).json(response)
}

export const notFound = (_req: Request, res: Response): void => {
  const response: ApiResponse<null> = { success: false, error: 'Route not found' }
  res.status(404).json(response)
}