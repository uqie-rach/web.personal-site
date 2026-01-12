"use client"

import { useState, useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import type { Portfolio } from "@/lib/schemas"

interface UsePortfolioOptions {
  onSuccess?: (message: string) => void
  onError?: (error: string) => void
}

export function usePortfolio(options?: UsePortfolioOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<Portfolio[]>("/portfolio")
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch portfolio items")
      }
      return response.data || []
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch portfolio items"
      setError(message)
      options?.onError?.(message)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [options])

  const getById = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.get<Portfolio>(`/portfolio/${id}`)
        if (!response.success) {
          throw new Error(response.error || "Failed to fetch portfolio item")
        }
        return response.data
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch portfolio item"
        setError(message)
        options?.onError?.(message)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [options],
  )

  const create = useCallback(
    async (data: Portfolio) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.post<Portfolio>("/portfolio", data)
        if (!response.success) {
          throw new Error(response.error || "Failed to create portfolio item")
        }
        options?.onSuccess?.("Portfolio item created successfully")
        return response.data
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create portfolio item"
        setError(message)
        options?.onError?.(message)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [options],
  )

  const update = useCallback(
    async (id: string, data: Partial<Portfolio>) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.put<Portfolio>(`/portfolio/${id}`, data)
        if (!response.success) {
          throw new Error(response.error || "Failed to update portfolio item")
        }
        options?.onSuccess?.("Portfolio item updated successfully")
        return response.data
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update portfolio item"
        setError(message)
        options?.onError?.(message)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [options],
  )

  const delete_ = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.delete<{ success: boolean }>(`/portfolio/${id}`)
        if (!response.success) {
          throw new Error(response.error || "Failed to delete portfolio item")
        }
        options?.onSuccess?.("Portfolio item deleted successfully")
        return true
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete portfolio item"
        setError(message)
        options?.onError?.(message)
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [options],
  )

  return {
    getAll,
    getById,
    create,
    update,
    delete: delete_,
    isLoading,
    error,
  }
}
