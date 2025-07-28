export interface Question {
  id: string
  question: string
  subject: string
  timestamp: string
  answer?: string
  inputMode: "text" | "image"
  hasImage?: boolean
  userId?: string
}

export interface VideoResult {
  id: string
  title: string
  channel: string
  thumbnail: string
  duration: string
  views: string
  publishedAt: string
  url?: string
}

export interface Stats {
  questionsAnswered: number
  studyTime: number
  lastActive?: string
  totalSessions?: number
}

export interface Subject {
  id: string
  name: string
  emoji: string
  icon: any
  featured?: boolean
}

export interface Quote {
  text: string
  author: string
}

export interface ApiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
  }>
  error?: {
    message: string
  }
}
