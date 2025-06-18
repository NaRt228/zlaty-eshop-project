"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
// Upravit importy pro novou strukturu API
import { login as apiLogin, logout as apiLogout, is_admin } from "@/apis_reqests/auth"

interface User {
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Změnit volání funkcí v useEffect
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const adminStatus = await is_admin()
        if (adminStatus.isAdmin) {
          setIsAuthenticated(true)
          setUser({ username: "Admin", email: "admin@example.com" }) // Placeholder, replace with actual user data
        }
      } catch (error) {
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin(email, password)
      setIsAuthenticated(true)
      setUser({ username: "Admin", email }) // Placeholder, replace with actual user data
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiLogout()
      setIsAuthenticated(false)
      setUser(null)
    } catch (error) {
      console.error("Chyba při odhlášení:", error)
      throw error
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Načítání...</div>
  }

  return <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}
