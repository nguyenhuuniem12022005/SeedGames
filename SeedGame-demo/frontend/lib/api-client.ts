// API Client Utilities
import type { ApiResponse, ApiError } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error: ApiError = {
          message: data.message || data.error || `HTTP ${response.status}`,
          code: data.code,
          status: response.status,
          details: data.details,
        };
        return { error };
      }

      return { data: data as T };
    } catch (error) {
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Network error occurred',
        code: 'NETWORK_ERROR',
      };
      return { error: apiError };
    }
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  // GET request
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  // POST request
  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // PUT request
  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  // PATCH request
  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Specific API methods
export const problemsApi = {
  getAll: () => apiClient.get<{ problems: import('@/types/api').Problem[] }>('/problems'),
  getById: (id: string | number) => apiClient.get<{ problem: import('@/types/api').Problem }>(`/problems/${id}`),
  getUserSubmissions: (problemId: string | number, userId: string | number) =>
    apiClient.get<{ submissions: import('@/types/api').Submission[] }>(
      `/problems/${problemId}/submissions/${userId}`
    ),
};

export const runApi = {
  // Map "Run" action to backend submission endpoint
  execute: (request: import('@/types/api').RunRequest) => 
    apiClient.post<{ submission: unknown }>('/problems/submit', {
      userId: null,
      problemId: request.problemId,
      codeContent: request.code,
      status: 'PENDING',
      judgeResult: null
    }),
};

export const coursesApi = {
  getAll: () => apiClient.get<{ courses: import('@/types/api').Course[] }>('/courses'),
  getById: (id: string | number) => apiClient.get<{ course: import('@/types/api').Course }>(`/courses/${id}`),
  getModule: (courseId: string | number, moduleId: string | number) =>
    apiClient.get<{ module: import('@/types/api').Module }>(`/courses/${courseId}/modules/${moduleId}`),
};

export const contestsApi = {
  getAll: () => apiClient.get<{ contests: import('@/types/api').Contest[] }>('/contests'),
  getById: (id: string | number) => apiClient.get<{ contest: import('@/types/api').Contest }>(`/contests/${id}`),
  getRankings: (contestId: string | number) =>
    apiClient.get<{ rankings: import('@/types/api').Ranking[] }>(`/contests/${contestId}/rankings`),
  register: (contestId: string | number) =>
    apiClient.post<{ success: boolean }>(`/contests/${contestId}/register`),
};

export const sandboxApi = {
  getAll: () => apiClient.get<{ projects: import('@/types/api').SandboxProject[] }>('/sandbox'),
  getById: (id: string | number) => apiClient.get<{ project: import('@/types/api').SandboxProject }>(`/sandbox/${id}`),
  create: (project: Omit<import('@/types/api').SandboxProject, 'id' | 'createdAt'>) =>
    apiClient.post<{ project: import('@/types/api').SandboxProject }>('/sandbox', project),
  update: (id: string | number, project: Partial<import('@/types/api').SandboxProject>) =>
    apiClient.put<{ project: import('@/types/api').SandboxProject }>(`/sandbox/${id}`, project),
  delete: (id: string | number) => apiClient.delete<{ success: boolean }>(`/sandbox/${id}`),
};

export const authApi = {
  login: (credentials: import('@/types/api').LoginRequest) =>
    apiClient.post<import('@/types/api').AuthResponse>('/auth/login', credentials),
  register: (data: import('@/types/api').RegisterRequest) =>
    apiClient.post<import('@/types/api').AuthResponse>('/auth/register', data),
  logout: () => apiClient.post<{ message: string }>('/auth/logout'),
  resetPassword: (params: { email: string; id: number; password: string }) =>
    apiClient.patch<{ message: string }>(`/auth/${encodeURIComponent(params.email)}/reset-password`, {
      id: params.id,
      password: params.password,
    }),
};

