const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface HttpResponse<T = any> {
  data: T;
  status: number;
}

export const http = {
  async get<T = any>(endpoint: string, options?: RequestInit): Promise<HttpResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      ...options,
    });
    return {
      data: await response.json().catch(() => null),
      status: response.status,
    };
  },

  async post<T = any>(endpoint: string, body: any, options?: RequestInit): Promise<HttpResponse<T>> {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json', ...options?.headers },
      body: isFormData ? body : JSON.stringify(body),
      ...options,
    });
    return {
      data: await response.json().catch(() => null),
      status: response.status,
    };
  },

  async patch<T = any>(endpoint: string, body: any, options?: RequestInit): Promise<HttpResponse<T>> {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: isFormData ? {} : { 'Content-Type': 'application/json', ...options?.headers },
      body: isFormData ? body : JSON.stringify(body),
      ...options,
    });
    return {
      data: await response.json().catch(() => null),
      status: response.status,
    };
  },

  async delete<T = any>(endpoint: string, options?: RequestInit): Promise<HttpResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      ...options,
    });
    return {
      data: await response.json().catch(() => null),
      status: response.status,
    };
  },
};
