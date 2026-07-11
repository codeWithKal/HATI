export type Language = 'en' | 'am' | 'om'

export interface Product {
  id: string
  name: Record<Language, string>
  description: Record<Language, string>
  category: string
  image?: string
  price?: number
}

export interface Service {
  id: string
  name: Record<Language, string>
  description: Record<Language, string>
  icon?: string
}

export interface Project {
  id: string
  title: Record<Language, string>
  description: Record<Language, string>
  image?: string
  location: Record<Language, string>
  startDate: string
  endDate?: string
  status: 'completed' | 'ongoing' | 'planned'
}

export interface NewsArticle {
  id: string
  title: Record<Language, string>
  content: Record<Language, string>
  excerpt: Record<Language, string>
  image?: string
  date: string
  author: string
}

export interface Tender {
  id: string
  title: Record<Language, string>
  description: Record<Language, string>
  deadline: string
  budget?: number
  status: 'open' | 'closed' | 'awarded'
  document?: string
}

export interface Testimonial {
  id: string
  name: string
  title: string
  content: Record<Language, string>
  image?: string
}

export interface TeamMember {
  id: string
  name: string
  position: Record<Language, string>
  image?: string
  email?: string
  phone?: string
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor'
  createdAt: string
}
