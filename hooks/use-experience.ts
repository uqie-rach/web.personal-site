"use client"

import { useState, useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import type { Experience } from "@/lib/schemas"

interface UseExperienceOptions {
  onSuccess?: (message: string) => void
  onError?: (error: string) => void
}

export function useExperience(options?: UseExperienceOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<Experience[]>("/experience")
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch experience items")
      }
      return response.data || []
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch experience items"
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
        const response = await apiClient.get<Experience>(`/experience/${id}`)
        if (!response.success) {
          throw new Error(response.error || "Failed to fetch experience item")
        }
        return response.data
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch experience item"
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
    async (data: Experience) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.post<Experience>("/experience", data)
        if (!response.success) {
          throw new Error(response.error || "Failed to create experience item")
        }
        options?.onSuccess?.("Experience item created successfully")
        return response.data
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create experience item"
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
    async (id: string, data: Partial<Experience>) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.put<Experience>(`/experience/${id}`, data)
        if (!response.success) {
          throw new Error(response.error || "Failed to update experience item")
        }
        options?.onSuccess?.("Experience item updated successfully")
        return response.data
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update experience item"
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
        const response = await apiClient.delete<{ success: boolean }>(`/experience/${id}`)
        if (!response.success) {
          throw new Error(response.error || "Failed to delete experience item")
        }
        options?.onSuccess?.("Experience item deleted successfully")
        return true
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete experience item"
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
