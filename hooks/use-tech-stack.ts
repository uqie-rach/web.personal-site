"use client"

import { useState, useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import type { TechStack } from "@/lib/schemas"

interface UseTechStackOptions {
  onSuccess?: (message: string) => void
  onError?: (error: string) => void
}

export function useTechStack(options?: UseTechStackOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<TechStack[]>("/tech-stack")
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch tech stack items")
      }
      return response.data || []
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch tech stack items"
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
        const response = await apiClient.get<TechStack>(`/tech-stack/${id}`)
        if (!response.success) {
          throw new Error(response.error || "Failed to fetch tech stack item")
        }
        return response.data
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch tech stack item"
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
    async (data: TechStack) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.post<TechStack>("/tech-stack", data)
        if (!response.success) {
          throw new Error(response.error || "Failed to create tech stack item")
        }
        options?.onSuccess?.("Tech stack item created successfully")
        return response.data
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create tech stack item"
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
    async (id: string, data: Partial<TechStack>) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.put<TechStack>(`/tech-stack/${id}`, data)
        if (!response.success) {
          throw new Error(response.error || "Failed to update tech stack item")
        }
        options?.onSuccess?.("Tech stack item updated successfully")
        return response.data
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update tech stack item"
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
        const response = await apiClient.delete<{ success: boolean }>(`/tech-stack/${id}`)
        if (!response.success) {
          throw new Error(response.error || "Failed to delete tech stack item")
        }
        options?.onSuccess?.("Tech stack item deleted successfully")
        return true
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete tech stack item"
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
