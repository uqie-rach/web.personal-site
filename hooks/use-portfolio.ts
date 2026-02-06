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

  const getAll = useCallback(async (limit = 10, page = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<Portfolio[]>(`/portfolios?limit=${limit}&page=${page}`)
      if (!response.ok) {
        throw new Error(response.message || "Failed to fetch portfolio items")
      }
      return {
        data: response.data || [],
        hasNextPage: (response.meta as any)?.hasNextPage || false,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch portfolio items"
      setError(message)
      options?.onError?.(message)
      return { data: [], hasNextPage: false }
    } finally {
      setIsLoading(false)
    }
  }, [options])

  const getById = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.get<Portfolio>(`/portfolios/${id}`)
        if (!response.ok) {
          throw new Error(response.message || "Failed to fetch portfolio item")
        }
        return response?.data
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
    async (data: Portfolio & {
      ownedBy: {
        id: string | undefined
      }
    }) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.post<Portfolio>("/portfolios", data)
        if (!response.ok) {
          throw new Error(response.message || "Failed to create portfolio item")
        }
        options?.onSuccess?.("Portfolio item created successfully")
        return response?.data
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
        const response = await apiClient.patch<Portfolio>(`/portfolios/${id}`, data)
        if (!response.ok) {
          throw new Error(response.message || "Failed to update portfolio item")
        }
        options?.onSuccess?.("Portfolio item updated successfully")
        return response?.data
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

        const response = await apiClient.delete<{ success: boolean }>(`/portfolios/${id}`)
        if (!response.ok) {
          throw new Error(response.message || "Failed to delete portfolio item")
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
