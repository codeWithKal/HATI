'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor'
}

interface AdminContextType {
  user: AdminUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const stored = localStorage.getItem('admin_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (err) {
        localStorage.removeItem('admin_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    // Simulate API call - in production, this would verify credentials
    // For demo purposes, allow specific test credentials
    if (email === 'admin@hati.com' && password === 'demo123') {
      const adminUser: AdminUser = {
        id: '1',
        email,
        name: 'Admin User',
        role: 'admin',
      }
      setUser(adminUser)
      localStorage.setItem('admin_user', JSON.stringify(adminUser))
    } else {
      throw new Error('Invalid credentials')
    }
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('admin_user')
  }

  return (
    <AdminContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
