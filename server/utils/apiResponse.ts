import { Response } from 'express';

export interface ApiResponseData<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class ApiResponse {
  static success<T>(res: Response, data?: T, message = 'Success', statusCode = 200): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res: Response, message = 'Error', statusCode = 500, error?: any): Response {
    const response: ApiResponseData = {
      success: false,
      message
    };

    if (process.env.NODE_ENV === 'development' && error) {
      response.error = error.message || error;
    }

    return res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response, 
    data: T[], 
    page: number, 
    limit: number, 
    total: number, 
    message = 'Success'
  ): Response {
    const pages = Math.ceil(total / limit);
    
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    });
  }

  static created<T>(res: Response, data?: T, message = 'Resource created successfully'): Response {
    return this.success(res, data, message, 201);
  }

  static updated<T>(res: Response, data?: T, message = 'Resource updated successfully'): Response {
    return this.success(res, data, message, 200);
  }

  static deleted(res: Response, message = 'Resource deleted successfully'): Response {
    return this.success(res, null, message, 200);
  }

  static notFound(res: Response, message = 'Resource not found'): Response {
    return this.error(res, message, 404);
  }

  static unauthorized(res: Response, message = 'Unauthorized access'): Response {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message = 'Access forbidden'): Response {
    return this.error(res, message, 403);
  }

  static badRequest(res: Response, message = 'Bad request', error?: any): Response {
    return this.error(res, message, 400, error);
  }

  static validation(res: Response, errors: any, message = 'Validation failed'): Response {
    return res.status(422).json({
      success: false,
      message,
      errors
    });
  }
}

export default ApiResponse;