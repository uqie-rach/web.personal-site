interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface ApiError {
  message: string
  status: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export class ApiClient {
  private static instance: ApiClient

  private constructor() {}

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient()
    }
    return ApiClient.instance
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw {
          message: errorData.error || `HTTP Error: ${response.status}`,
          status: response.status,
        } as ApiError
      }

      const data = await response.json()
      return {
        success: true,
        data,
      }
    } catch (error) {
      const apiError = error instanceof Error ? error.message : "Unknown error"
      console.error("[API Error]", apiError)
      return {
        success: false,
        error: apiError,
      }
    }
  }

  get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = ApiClient.getInstance()
