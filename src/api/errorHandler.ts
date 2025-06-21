// errorHandler.ts
import axios, { AxiosError } from "axios";

interface ErrorResponse {
  message?: string;
  error?: string;
  detail?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    
    // Handle network errors
    if (!axiosError.response) {
      throw new ApiError('Network error. Please check your connection.');
    }

    // Handle specific status codes
    switch (axiosError.response.status) {
      case 400:
        throw new ApiError(
          axiosError.response.data?.message || 
          axiosError.response.data?.error || 
          axiosError.response.data?.detail || 
          'Invalid request data',
          400
        );
      case 401:
        // Let the interceptor handle this
        throw error;
      case 403:
        throw new ApiError('You do not have permission to perform this action', 403);
      case 404:
        throw new ApiError('The requested resource was not found', 404);
      case 500:
        throw new ApiError('Server error. Please try again later', 500);
      default:
        throw new ApiError(
          axiosError.response.data?.message || 
          axiosError.response.data?.error || 
          axiosError.response.data?.detail || 
          'An unexpected error occurred',
          axiosError.response.status
        );
    }
  }
  
  // Handle non-Axios errors
  if (error instanceof Error) {
    throw new ApiError(error.message);
  }
  
  throw new ApiError('An unexpected error occurred');
};
