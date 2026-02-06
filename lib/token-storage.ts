const ACCESS_TOKEN_KEY = "auth_token"
const REFRESH_TOKEN_KEY = "auth_refresh_token"
const TOKEN_EXPIRES_KEY = "auth_token_expires"

export interface AuthTokens {
  token: string
  refreshToken: string
  tokenExpires: number
}

/**
 * Save all auth tokens
 */
export function saveAuthTokens(tokens: AuthTokens) {
  if (typeof window === "undefined") return

  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.token)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
  localStorage.setItem(TOKEN_EXPIRES_KEY, String(tokens.tokenExpires))
}

/**
 * Get access token
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

/**
 * Get refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/**
 * Get token expiry (timestamp)
 */
export function getTokenExpires(): number | null {
  if (typeof window === "undefined") return null
  const value = localStorage.getItem(TOKEN_EXPIRES_KEY)
  return value ? Number(value) : null
}

/**
 * Clear all auth tokens
 */
export function clearAuthTokens() {
  if (typeof window === "undefined") return

  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(TOKEN_EXPIRES_KEY)
}
