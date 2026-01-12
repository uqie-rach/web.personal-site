import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export interface AuthState {
  isAuthenticated: boolean
  user: { email: string } | null
  login: (email: string, password: string) => boolean
  logout: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (email: string, password: string) => {
        // Demo credentials validation
        if (email === "admin@portfolio.com" && password === "admin123") {
          set({ isAuthenticated: true, user: { email } })
          return true
        }
        return false
      },
      logout: () => {
        set({ isAuthenticated: false, user: null })
      },
      hydrate: () => {
        // This is called on app startup to restore persisted state
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
