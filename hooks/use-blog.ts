"use client"

import { useState, useCallback } from "react"
import { apiClient } from "@/lib/api-client"
import type { Blog } from "@/lib/schemas"

interface UseBlogOptions {
  onSuccess?: (message: string) => void
  onError?: (error: string) => void
}

export function useBlog(options?: UseBlogOptions) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAll = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get<Blog[]>("/blogs")
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch blog posts")
      }
      return response?.data?.data || []
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch blog posts"
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
        const response = await apiClient.get<Blog>(`/blogs/${id}`)
        if (!response.success) {
          throw new Error(response.error || "Failed to fetch blog post")
        }
        return response?.data?.data
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch blog post"
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
    async (data: Blog) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.post<Blog>("/blogs", data)
        if (!response.success) {
          throw new Error(response.error || "Failed to create blog post")
        }
        options?.onSuccess?.("Blog post created successfully")
        return response?.data?.data
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create blog post"
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
    async (id: string, data: Partial<Blog>) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.put<Blog>(`/blogs/${id}`, data)
        if (!response.success) {
          throw new Error(response.error || "Failed to update blog post")
        }
        options?.onSuccess?.("Blog post updated successfully")
        return response?.data?.data
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update blog post"
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
        const response = await apiClient.delete<{ success: boolean }>(`/blogs/${id}`)
        if (!response.success) {
          throw new Error(response.error || "Failed to delete blog post")
        }
        options?.onSuccess?.("Blog post deleted successfully")
        return true
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete blog post"
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
