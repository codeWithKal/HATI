'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Language } from '@/lib/types'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, record: Record<Language, string>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null
    if (saved && ['en', 'am', 'om'].includes(saved)) {
      setLanguageState(saved)
    }
    setMounted(true)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }
  }

  const t = (key: string, record: Record<Language, string>) => {
    return record[language] || record['en'] || ''
  }

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language: 'en', setLanguage, t }}>
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
