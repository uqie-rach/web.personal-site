"use client"

import { useState, useCallback } from "react"
import { apiClient } from "@/lib/api-client"

interface FileResponse {
    file: {
        id: string;
        path: string;
        publicUrl: string;
    }
}

interface UseFileOptions {
    onSuccess?: (message: string) => void
    onError?: (error: string) => void
}

export function useFile(options?: UseFileOptions) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getById = useCallback(
        async (id: string) => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await apiClient.get<File>(`/files/${id}`)
                if (!response.ok) {
                    throw new Error(response.message || "Failed to fetch file item")
                }
                return response.data
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to fetch file item"
                setError(message)
                options?.onError?.(message)
                return null
            } finally {
                setIsLoading(false)
            }
        },
        [options],
    )

    const upload = useCallback(
        async (data: File) => {
            setIsLoading(true)
            setError(null)
            try {
                const formData = new FormData()
                formData.append("file", data)

                const response = await apiClient.post<FileResponse>(
                    "/files/upload",
                    formData
                )
                if (!response.ok) {
                    throw new Error(response.message || "Failed to create file item")
                }
                options?.onSuccess?.("File item uploaded successfully")
                return response.data
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to create file item"
                setError(message)
                options?.onError?.(message)
                return null
            } finally {
                setIsLoading(false)
            }
        },
        [options],
    )

    const _delete = useCallback(
        async (path: string) => {
            try {
                const response = await apiClient.delete<boolean>(
                    "/files/delete",
                    {
                        path
                    },
                )
                if (!response.ok) {
                    throw new Error(response.message || "Failed to delete file" )
                }

                options?.onSuccess?.("File deleted!")
                return response.data
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to create file item"
                setError(message)
                options?.onError?.(message)
                return null
            } finally {
                setIsLoading(false)
            }
        },
        [options]
    )

    return {
        getById,
        upload,
        _delete,
        isLoading,
        error,
    }
}
