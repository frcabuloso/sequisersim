"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { apiClient } from "./api-client"

interface User {
  id: string
  email: string
  name: string
  picture: string
  cpf: string
  telefone: string
  saldo: number
  pin: string | null
  twoFactorEnabled: boolean
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (userData: Partial<User>, token?: string) => void
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const PROTECTED_ROUTES = ["/dashboard"]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("frcabuloso_token")
        const storedUser = localStorage.getItem("frcabuloso_user")
        if (token && storedUser) {
          const res = await apiClient.get('/usuario/perfil')
          if (res.success && res.data) {
            const userData = JSON.parse(storedUser)
            setUser({ ...userData, name: res.data.nome, email: res.data.email, cpf: res.data.cpf, telefone: res.data.telefone, picture: res.data.foto, twoFactorEnabled: res.data.twoFactorEnabled })
          } else {
            localStorage.removeItem("frcabuloso_token")
            localStorage.removeItem("frcabuloso_user")
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      if (PROTECTED_ROUTES.some(route => pathname?.startsWith(route)) && !user) {
        router.push("/login")
      }
    }
  }, [isLoading, user, pathname, router])

  const login = useCallback((userData: any, token?: string) => {
    const newUser: User = { id: userData.id || "", email: userData.email || "", name: userData.name || userData.nome || "", picture: userData.picture || "", cpf: userData.cpf || "", telefone: userData.telefone || "", saldo: userData.saldo ?? 0, pin: null, twoFactorEnabled: userData.twoFactorEnabled || false, createdAt: userData.createdAt || new Date().toISOString() }
    setUser(newUser)
    localStorage.setItem("frcabuloso_user", JSON.stringify(newUser))
    if (token) localStorage.setItem("frcabuloso_token", token)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("frcabuloso_user")
    localStorage.removeItem("frcabuloso_token")
    router.push("/")
  }, [router])

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null
      const updated = { ...prev, ...data }
      localStorage.setItem("frcabuloso_user", JSON.stringify(updated))
      return updated
    })
  }, [])

  return <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout, updateUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error("AuthProvider não encontrado")
  return context
}
