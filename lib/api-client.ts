import { normalizeResponse } from "./normalize-response"

export interface ApiSuccess<T> {
  ok: true
  data: T
  meta?: Record<string, any>
}

export interface ApiFailure {
  ok: false
  message: string
  status?: number
}

export function isSuccess<T>(
  res: ApiResult<T>
): res is { ok: true; data: T; meta?: any } {
  return res.ok === true
}


export type ApiResult<T> = ApiSuccess<T> | ApiFailure

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'

export class ApiClient {
  private static instance: ApiClient
  private constructor() { }

  static getInstance() {
    if (!this.instance) this.instance = new ApiClient()
    return this.instance
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResult<T>> {
    const headers = new Headers(options.headers)
    const body = options.body

    if (body && !isFormData(body)) {
      headers.set('Content-Type', 'application/json')
    }

    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('auth_token')
        : null

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      })

      const raw = await res.json().catch(() => null)

      if (!res.ok) {
        console.log('from apiclient', raw)
        
        let errorMessage= raw?.message || 'Request failed'
        
        // Handle field-specific errors
        if (raw?.errors && typeof raw.errors === 'object') {
          const fieldErrors = Object.entries(raw.errors)
            .map(([field, error]) => `${field}: ${error}`)
            .join(', ')
          errorMessage = fieldErrors || errorMessage
        }
        
        return {
          ok: false,
          message: errorMessage,
          status: res.status,
        }
      }

      const normalized = normalizeResponse<T>(raw)

      return {
        ok: true,
        ...normalized,
      }
    } catch (err) {
      return {
        ok: false,
        message:
          err instanceof Error ? err.message : 'Unknown error',
      }
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  post<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData
        ? body
        : body
          ? JSON.stringify(body)
          : undefined,
    })
  }

  put<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body instanceof FormData
        ? body
        : body
          ? JSON.stringify(body)
          : undefined,
    })
  }

  patch<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body instanceof FormData
        ? body
        : body
          ? JSON.stringify(body)
          : undefined,
    })
  }

  delete<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint,
      {
        method: 'DELETE',
        body: body ? JSON.stringify(body) : undefined
      })
  }
}

export const apiClient = ApiClient.getInstance()


function isFormData(body: unknown): body is FormData {
  return typeof FormData !== 'undefined' && body instanceof FormData
}
