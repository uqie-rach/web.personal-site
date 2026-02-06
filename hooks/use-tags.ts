"use client"

import { useState, useCallback } from "react"
import { apiClient } from "@/lib/api-client"

export interface Tag {
  id: string
  name: string
  slug: string
  createdAt?: Date
  updatedAt?: Date
}

interface UseTagsOptions {
  onSuccess?: (message: string) => void
  onError?: (error: string) => void
}

export function useTags(options?: UseTagsOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAll = useCallback(async (limit = 50, page = 1, search?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : ""
      const response = await apiClient.get<Tag[]>(`/tags?limit=${limit}&page=${page}${searchParam}`)
      if (!response.ok) {
        throw new Error(response.message || "Failed to fetch tags")
      }
      return {
        data: response.data || [],
        hasNextPage: response?.meta?.hasNextPage || false,
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch tags"
      setError(message)
      options?.onError?.(message)
      return { data: [], hasNextPage: false }
    } finally {
      setIsLoading(false)
    }
  }, [options])

  return {
    getAll,
    isLoading,
    error,
  }
}

