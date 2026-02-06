// normalize-response.ts
export function normalizeResponse<T>(
  raw: any
): { data: T; meta?: { hasNextPage?: boolean } } {
  // CASE 1: infinity pagination
  if (
    raw &&
    typeof raw === 'object' &&
    Array.isArray(raw.data) &&
    typeof raw.hasNextPage === 'boolean'
  ) {

    return {
      data: raw.data as T,
      meta: {
        hasNextPage: raw.hasNextPage,
      },
    }
  }
  
  // CASE 2: normal single response (login, create, update, get by id)
  return {
    data: raw as T,
  }
}
