"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuthStore } from "@/lib/store/auth-store"

export function AdminHeader() {
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="flex items-center justify-between p-6 border-b border-border bg-card">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        <LogOut size={16} className="mr-2" /> Logout
      </Button>
    </div>
  )
}
