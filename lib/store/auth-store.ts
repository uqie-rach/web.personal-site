import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { apiClient } from "../api-client"
import { LoginResponse, User } from "../types"
import { saveAuthTokens } from "../token-storage"

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, password: string) => Promise<LoginResponse | null | undefined>
  logout: () => void
  hasHydrated: boolean
  setHasHydrated: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (email: string, password: string) => {
        const res = await apiClient.post<LoginResponse>(
          '/auth/email/login',
          {
            email,
            password
          }
        )
        if (!res.ok) throw new Error(res.message)

        set({
          user: res.data?.user,
          isAuthenticated: true
        })

        // simpan refreshToken, token, dan tokenexpires ke localstorage
        saveAuthTokens({
          token: res.data.token,
          refreshToken: res.data.refreshToken,
          tokenExpires: parseInt(res.data.tokenExpires),
        })

        return res.data
      },
      logout: () => {
        set({ isAuthenticated: false, user: null })
      },
      hasHydrated: false,
      setHasHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated()
      },
    },
  ),
)
