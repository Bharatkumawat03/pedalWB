import { Request, Response } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
  select?: string;
}

export interface QueryOptions extends PaginationOptions {
  search?: string;
  filter?: Record<string, any>;
}