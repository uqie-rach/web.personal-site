// backend-raw.types.ts
export type BackendListResponse<T> = {
  data: T[]
  hasNextPage: boolean
}

export type BackendSingleResponse<T> = T
