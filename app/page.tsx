"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Moon,
  Sun,
  Upload,
  Copy,
  Share,
  Trash2,
  FlameIcon as Fire,
  Keyboard,
  ImageIcon,
  Calculator,
  Atom,
  TestTube,
  Dna,
  BookOpen,
  Languages,
  GraduationCap,
  Lightbulb,
  LineChartIcon as ChartLine,
  RefreshCw,
  Rocket,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Palette,
  Globe,
  Code,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import Image from "next/image"
import { compressImage as clientCompressImage } from "@/lib/utils" // Import client-side compressImage
import { askGeminiAI } from "@/app/actions" // Import the server action

// Types
interface Question {
  id: string
  question: string
  subject: string
  timestamp: string
  answer?: string
  level: string
}

interface Stats {
  questionsAnswered: number
  studyTime: number
}

// Enhanced subjects for all students
const SUBJECTS = [
  // Core Academic Subjects
  { id: "Mathematics", name: "Mathematics", emoji: "📐", icon: Calculator, color: "bg-blue-500" },
  { id: "Physics", name: "Physics", emoji: "⚛️", icon: Atom, color: "bg-purple-500" },
  { id: "Chemistry", name: "Chemistry", emoji: "🧪", icon: TestTube, color: "bg-green-500" },
  { id: "Biology", name: "Biology", emoji: "🧬", icon: Dna, color: "bg-emerald-500" },
  { id: "English", name: "English", emoji: "📚", icon: BookOpen, color: "bg-red-500" },
  { id: "Hindi", name: "Hindi", emoji: "🇮🇳", icon: Languages, color: "bg-orange-500" },

  // Additional Subjects
  { id: "History", name: "History", emoji: "🏛️", icon: Globe, color: "bg-amber-500" },
  { id: "Geography", name: "Geography", emoji: "🌍", icon: Globe, color: "bg-teal-500" },
  { id: "Economics", name: "Economics", emoji: "💰", icon: TrendingUp, color: "bg-yellow-500" },
  { id: "Political Science", name: "Political Science", emoji: "🏛️", icon: Users, color: "bg-indigo-500" },
  { id: "Computer Science", name: "Computer Science", emoji: "💻", icon: Code, color: "bg-cyan-500" },
  { id: "Arts", name: "Arts & Drawing", emoji: "🎨", icon: Palette, color: "bg-pink-500" },

  // Special Categories
  { id: "General", name: "General Knowledge", emoji: "🧠", icon: Brain, color: "bg-slate-500" },
  {
    id: "College",
    name: "College Level",
    emoji: "🎓",
    icon: GraduationCap,
    color: "bg-gradient-to-r from-blue-600 to-purple-600",
    featured: true,
  },
]

const EDUCATION_LEVELS = [
  { id: "primary", name: "Primary (1-5)", emoji: "🌱" },
  { id: "middle", name: "Middle (6-8)", emoji: "🌿" },
  { id: "secondary", name: "Secondary (9-10)", emoji: "🌳" },
  { id: "senior", name: "Senior (11-12)", emoji: "🎯" },
  { id: "college", name: "College/University", emoji: "🎓" },
  { id: "competitive", name: "Competitive Exams", emoji: "🏆" },
]

const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "Mathematics is the language in which God has written the universe.", author: "Galileo Galilei" },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
]

export default function StudentBrainBooster() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Core state
  const [selectedSubject, setSelectedSubject] = useState("General")
  const [selectedLevel, setSelectedLevel] = useState("secondary")
  const [inputMode, setInputMode] = useState<"text" | "image">("text")
  const [question, setQuestion] = useState("")
  const [imageContext, setImageContext] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [answer, setAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(QUOTES[0])
  const [stats, setStats] = useState<Stats>({ questionsAnswered: 0, studyTime: 0 })
  const [popularQuestions, setPopularQuestions] = useState<Question[]>([])
  const [showPopularQuestions, setShowPopularQuestions] = useState(false)

  // Animation states
  const [isCardHovered, setIsCardHovered] = useState<string | null>(null)
  const [buttonClicked, setButtonClicked] = useState<string | null>(null)
  const [typingEffect, setTypingEffect] = useState("")
  const [showParticles, setShowParticles] = useState(false)
  const [progressAnimation, setProgressAnimation] = useState(0)
  const [shakeError, setShakeError] = useState(false)
  const [hasCelebrationBeenShown, setHasCelebrationBeenShown] = useState(false) // New state for one-time celebration

  // Timer state
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isBreakTime, setIsBreakTime] = useState(false)
  const timerRef = useRef<NodeJS.Timeout>()

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State variables for messages
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  // Initialize theme and load data
  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark)

    setIsDarkMode(shouldBeDark)
    updateTheme(shouldBeDark)

    loadStats()
    loadPopularQuestions()

    // Load celebration flag from localStorage
    const celebrationFlag = localStorage.getItem("hasCelebrationBeenShown")
    if (celebrationFlag === "true") {
      setHasCelebrationBeenShown(true)
    }

    // Rotate quotes every 30 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])
    }, 30000)

    return () => clearInterval(quoteInterval)
  }, [])

  // Update theme in DOM
  const updateTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    updateTheme(newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
  }

  // Auto-hide messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isTimerRunning, timeLeft])

  // Enhanced animations and interactions
  const handleButtonClick = (buttonId: string) => {
    setButtonClicked(buttonId)
    setTimeout(() => setButtonClicked(null), 200)
  }

  const createRippleEffect = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (!e) return

    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const ripple = document.createElement("span")
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    ripple.style.width = ripple.style.height = size + "px"
    ripple.style.left = x + "px"
    ripple.style.top = y + "px"
    ripple.classList.add("ripple")

    button.appendChild(ripple)
    setTimeout(() => ripple.remove(), 600)
  }

  const typeWriterEffect = (text: string, callback: () => void) => {
    let i = 0
    setTypingEffect("")
    const timer = setInterval(() => {
      if (i < text.length) {
        setTypingEffect(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
        callback()
      }
    }, 50)
  }

  const triggerSuccessAnimation = () => {
    if (!hasCelebrationBeenShown) {
      setShowParticles(true)
      setTimeout(() => setShowParticles(false), 2000)
      setHasCelebrationBeenShown(true)
      localStorage.setItem("hasCelebrationBeenShown", "true")
    }
  }

  const animateProgress = (duration: number) => {
    setProgressAnimation(0)
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      setProgressAnimation(progress * 100)
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }

  const triggerErrorShake = () => {
    setShakeError(true)
    setTimeout(() => setShakeError(false), 500)
  }

  // Enhanced question asking with real AI
  const askQuestionClient = async () => {
    const questionText = inputMode === "text" ? question.trim() : imageContext.trim()

    if (inputMode === "text" && !questionText) {
      setError("Please enter your question.")
      triggerErrorShake()
      return
    }

    if (inputMode === "image" && !uploadedImage) {
      setError("Please upload an image for your question.")
      triggerErrorShake()
      return
    }

    setIsLoading(true)
    setError("")
    setShowAnswer(false)
    animateProgress(15000) // 15 second animation

    try {
      let prompt: string
      let imageData: string | undefined

      if (inputMode === "text") {
        const levelInfo = EDUCATION_LEVELS.find((l) => l.id === selectedLevel)?.name || "General"
        prompt = `You are a friendly tutor helping a student at ${levelInfo} level with ${selectedSubject}.

Question: ${questionText}

Please provide a clear, concise answer in exactly 100-200 words using this structure:

SOLUTION:
[Main answer in simple language]

KEY POINTS:
• [Important point 1]
• [Important point 2]
• [Important point 3]

REMEMBER:
[One helpful tip to remember this concept]

Keep it simple, friendly, and easy to understand for ${levelInfo} students. No markdown formatting like ** or ##.`
      } else {
        const levelInfo = EDUCATION_LEVELS.find((l) => l.id === selectedLevel)?.name || "General"
        try {
          imageData = await clientCompressImage(uploadedImage!)
        } catch (error) {
          console.error("Image compression failed:", error)
          imageData = uploadedImage! // Use original if compression fails
        }

        prompt = `You are a friendly tutor helping a student at ${levelInfo} level with ${selectedSubject}.

Please analyze this image and solve the question. Additional context: ${questionText || "No additional context provided"}

Provide a clear answer in exactly 100-200 words using this structure:

WHAT I SEE:
[Brief description of the image/problem]

SOLUTION:
[Step-by-step solution in simple language]

KEY POINTS:
• [Important concept 1]
• [Important concept 2]

REMEMBER:
[One helpful tip for similar problems]

Keep it simple and easy to understand for ${levelInfo} students. No markdown formatting like ** or ##.`
      }

      const aiAnswer = await askGeminiAI(prompt, imageData) // Call the server action

      // Set answer directly without typewriter effect to avoid issues
      setAnswer(aiAnswer)
      setShowAnswer(true)
      triggerSuccessAnimation() // This will now only run once per user

      // Save question and update stats
      saveQuestion(inputMode === "text" ? questionText : "Image Question", aiAnswer, selectedSubject)
      updateStats("question")

      setSuccess("Answer generated successfully! 🎉")
    } catch (error) {
      console.error("Error asking question:", error)
      setError(`Error getting AI response: ${error instanceof Error ? error.message : "Unknown error"}`)
      triggerErrorShake()
    } finally {
      setIsLoading(false)
      setProgressAnimation(0)
    }
  }

  // Utility functions (reverted to localStorage)
  const loadStats = () => {
    const savedStats = localStorage.getItem("studentBrainBoosterStats")
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
  }

  const updateStats = (type: "question" | "study") => {
    setStats((prev) => {
      const newStats = {
        ...prev,
        questionsAnswered: type === "question" ? prev.questionsAnswered + 1 : prev.questionsAnswered,
        studyTime: type === "study" ? prev.studyTime + 25 : prev.studyTime,
      }
      localStorage.setItem("studentBrainBoosterStats", JSON.stringify(newStats))
      return newStats
    })
  }

  const resetStats = () => {
    const newStats = { questionsAnswered: 0, studyTime: 0 }
    setStats(newStats)
    localStorage.setItem("studentBrainBoosterStats", JSON.stringify(newStats))
    setSuccess("Stats reset successfully! 📊")
  }

  const loadPopularQuestions = () => {
    const saved = localStorage.getItem("studentBrainBoosterQuestions")
    if (saved) {
      const questions = JSON.parse(saved)
      setPopularQuestions(questions.slice(0, 5))
    }
  }

  const saveQuestion = (questionText: string, answerText: string, subject: string) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: questionText,
      subject,
      level: selectedLevel,
      timestamp: new Date().toISOString(),
      answer: answerText,
    }

    const saved = localStorage.getItem("studentBrainBoosterQuestions")
    const questions = saved ? JSON.parse(saved) : []
    questions.unshift(newQuestion)

    const trimmed = questions.slice(0, 50)
    localStorage.setItem("studentBrainBoosterQuestions", JSON.stringify(trimmed))

    loadPopularQuestions()
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (PNG, JPG, JPEG)")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setUploadedImage(e.target.result as string)
        setSuccess("Image uploaded successfully! 📸")
      }
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setUploadedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const copyAnswer = async () => {
    try {
      await navigator.clipboard.writeText(answer)
      setSuccess("Answer copied to clipboard! 📋")
    } catch {
      setError("Failed to copy answer")
    }
  }

  const shareAnswer = async () => {
    const questionText = inputMode === "text" ? question : "Image Question"
    const shareText = `Question: ${questionText}\n\nAnswer: ${answer}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Student Brain Booster Answer",
          text: shareText,
        })
        setSuccess("Answer shared successfully! 📤")
      } catch {
        copyAnswer()
      }
    } else {
      copyAnswer()
    }
  }

  const clearAnswer = () => {
    setShowAnswer(false)
    setShowPopularQuestions(false)
    setQuestion("")
    setImageContext("")
    removeImage()
    setError("")
  }

  const usePopularQuestion = (q: Question) => {
    setInputMode("text")
    setQuestion(q.question)
    setSelectedSubject(q.subject)
    setSelectedLevel(q.level)
    setShowPopularQuestions(false)
    setSuccess('Question loaded! Click "Get AI Answer" to proceed 🚀')
  }

  // Timer functions
  const startTimer = () => setIsTimerRunning(true)
  const pauseTimer = () => setIsTimerRunning(false)
  const resetTimer = () => {
    setIsTimerRunning(false)
    setTimeLeft(25 * 60)
    setIsBreakTime(false)
  }

  const handleTimerComplete = () => {
    setIsTimerRunning(false)
    if (isBreakTime) {
      setTimeLeft(25 * 60)
      setIsBreakTime(false)
      setSuccess("Break time over! Ready to focus! 🎯")
    } else {
      setTimeLeft(5 * 60)
      setIsBreakTime(true)
      updateStats("study")
      setSuccess("Focus session complete! Time for a break! 😌")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getTimerStatus = () => {
    if (!isTimerRunning && timeLeft === 25 * 60) return "Ready to Focus 🎯"
    if (!isTimerRunning) return "Paused ⏸️"
    return isBreakTime ? "Break Time! 😌" : "Focus Mode! 🎯"
  }

  // Particle Effect Component
  const ParticleEffect = () => {
    if (!showParticles) return null

    return (
      <div className="fixed inset-0 pointer-events-none z-40">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    )
  }

  // Enhanced Timer Display
  const EnhancedTimer = () => {
    const totalSessionTime = isBreakTime ? 5 * 60 : 25 * 60
    const progressRatio = (totalSessionTime - timeLeft) / totalSessionTime // 0 to 1

    return (
      <div className="flex items-center justify-center gap-4 w-full">
        {" "}
        {/* Changed to justify-center and added gap */}
        {/* Timer Display */}
        <div className="text-center">
          {" "}
          {/* Removed flex-1 and sm:text-left */}
          <div
            className={`text-4xl font-bold transition-all duration-300 ${
              isDarkMode
                ? "bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            }`}
          >
            {formatTime(timeLeft)}
          </div>
        </div>
        {/* Circular Progress on the right */}
        <div className="relative">
          {" "}
          {/* Removed ml-0 sm:ml-4 mt-4 sm:mt-0 mx-auto sm:mx-0 */}
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke={isDarkMode ? "#374151" : "#e5e7eb"} strokeWidth="6" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={isBreakTime ? "#f59e0b" : "#3b82f6"}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressRatio)}`}
              className="transition-all duration-1000 ease-in-out"
            />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 left-20 w-72 h-72 rounded-full opacity-20 animate-float ${isDarkMode ? "bg-blue-500" : "bg-blue-300"}`}
        ></div>
        <div
          className={`absolute top-40 right-20 w-96 h-96 rounded-full opacity-15 animate-float-delayed ${isDarkMode ? "bg-purple-500" : "bg-purple-300"}`}
        ></div>
        <div
          className={`absolute bottom-20 left-1/3 w-64 h-64 rounded-full opacity-10 animate-float-slow ${isDarkMode ? "bg-indigo-500" : "bg-indigo-300"}`}
        ></div>
      </div>

      {/* Theme Toggle */}
      <Button
        variant="outline"
        size="icon"
        className={`fixed top-4 right-4 z-50 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          isDarkMode
            ? "bg-gray-800 border-gray-600 text-yellow-400 hover:bg-gray-700"
            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
        }`}
        onClick={toggleTheme}
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      {/* Success/Error Messages */}
      {success && (
        <div
          className={`fixed top-16 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-[calc(100%-2rem)] sm:max-w-sm animate-slide-in ${
            isDarkMode
              ? "bg-green-900 text-green-200 border border-green-700"
              : "bg-green-100 text-green-800 border border-green-200"
          }`}
        >
          <CheckCircle className="h-4 w-4" />
          {success}
        </div>
      )}

      {error && (
        <div
          className={`fixed top-16 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-[calc(100%-2rem)] sm:max-w-sm animate-slide-in ${
            isDarkMode
              ? "bg-red-900 text-red-200 border border-red-700"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1
            className={`text-4xl sm:text-5xl font-bold mb-4 animate-glow ${
              isDarkMode
                ? "bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            }`}
          >
            🎓 Student Brain Booster
          </h1>
          <p className={`text-base sm:text-lg font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Your Smart Study Buddy - Get Quick Help with Any Subject! 📚✨
          </p>
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-4">
            <Badge variant="secondary" className="animate-pulse bg-green-100 text-green-800">
              <Zap className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              <Users className="h-3 w-3 mr-1" />
              All Students Welcome
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Input */}
            <Card
              className={`shadow-xl border-0 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl animate-slide-up transform hover:scale-[1.02] ${
                isDarkMode ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
              } ${shakeError ? "animate-shake" : ""}`}
              onMouseEnter={() => setIsCardHovered("main")}
              onMouseLeave={() => setIsCardHovered(null)}
            >
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-t-lg">
                <CardTitle className={`flex items-center gap-2 text-lg ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  <Brain className="h-6 w-6 animate-pulse text-blue-500" />
                  What would you like to learn today? 🤔
                </CardTitle>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Don't worry, I'm here to help you understand everything step by step! 😊
                </p>
              </CardHeader>
              <CardContent className="space-y-6 p-4 sm:p-6">
                {" "}
                {/* Adjusted padding */}
                {/* Input Mode Toggle */}
                <div
                  className={`flex rounded-lg p-1 transition-all duration-300 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <Button
                    variant={inputMode === "text" ? "default" : "ghost"}
                    className="flex-1 transition-all duration-300 text-sm sm:text-base"
                    onClick={() => setInputMode("text")}
                  >
                    <Keyboard className="h-4 w-4 mr-2" />
                    Text Question
                  </Button>
                  <Button
                    variant={inputMode === "image" ? "default" : "ghost"}
                    className="flex-1 transition-all duration-300 text-sm sm:text-base"
                    onClick={() => setInputMode("image")}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Image Question
                  </Button>
                </div>
                {/* Education Level Selection */}
                <div>
                  <Label
                    className={`text-base font-medium mb-3 block ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                  >
                    Ask questions of any education level
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {EDUCATION_LEVELS.map((level) => (
                      <Button
                        key={level.id}
                        variant={selectedLevel === level.id ? "default" : "outline"}
                        size="sm"
                        className="transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
                        onClick={() => setSelectedLevel(level.id)}
                      >
                        <span className="mr-2">{level.emoji}</span>
                        {level.name}
                      </Button>
                    ))}
                  </div>
                </div>
                {/* Subject Selection */}
                <div>
                  <Label
                    className={`text-base font-medium mb-3 block ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                  >
                    Get answers for all these subjects
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {SUBJECTS.map((subject) => {
                      const IconComponent = subject.icon
                      return (
                        <Button
                          key={subject.id}
                          variant={selectedSubject === subject.id ? "default" : "outline"}
                          className={`h-auto p-3 sm:p-4 flex flex-col gap-1 sm:gap-2 transition-all duration-300 hover:scale-110 hover:rotate-1 transform-gpu relative overflow-hidden group ${
                            subject.featured ? "col-span-2" : "" // Changed to col-span-2 for all sizes to ensure it always takes 2 columns
                          } ${selectedSubject === subject.id ? subject.color : ""}`}
                          onClick={(e) => {
                            createRippleEffect(e)
                            setSelectedSubject(subject.id)
                            handleButtonClick(`subject-${subject.id}`)
                          }}
                          onMouseEnter={() => setIsCardHovered(`subject-${subject.id}`)}
                          onMouseLeave={() => setIsCardHovered(null)}
                        >
                          <IconComponent
                            className={`h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300 ${
                              isCardHovered === `subject-${subject.id}` ? "animate-bounce scale-125" : ""
                            }`}
                          />
                          <span className="text-xs sm:text-sm font-medium text-center transition-all duration-300 group-hover:text-lg">
                            {subject.name}
                          </span>

                          {/* Hover glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                        </Button>
                      )
                    })}
                  </div>
                </div>
                {/* Text Input */}
                {inputMode === "text" && (
                  <div className="animate-fade-in">
                    <Label htmlFor="question" className={isDarkMode ? "text-gray-200" : "text-gray-700"}>
                      Your Question
                    </Label>
                    <Textarea
                      id="question"
                      placeholder="Type your academic question here... Be specific for better answers! ✨"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      rows={4}
                      className={`mt-2 transition-all duration-300 focus:scale-[1.02] ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>
                )}
                {/* Image Input */}
                {inputMode === "image" && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <Label className={isDarkMode ? "text-gray-200" : "text-gray-700"}>Upload Question Image</Label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 hover:scale-[1.02] mt-2 ${
                          isDarkMode
                            ? "border-gray-600 hover:border-gray-500 bg-gray-800/50"
                            : "border-gray-300 hover:border-gray-400 bg-gray-50/50"
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload
                          className={`h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 animate-bounce ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                        />
                        <p
                          className={`font-medium text-sm sm:text-base ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}
                        >
                          Click to upload or drag and drop
                        </p>
                        <p className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          PNG, JPG, JPEG up to 5MB
                        </p>
                      </div>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />

                      {uploadedImage && (
                        <div className="mt-4 animate-fade-in text-center">
                          {" "}
                          {/* Added text-center */}
                          <Image
                            src={uploadedImage || "/placeholder.svg"}
                            alt="Uploaded question"
                            width={300}
                            height={200}
                            className="rounded-lg shadow-md transition-all duration-300 hover:scale-105 inline-block" // Changed to inline-block
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={removeImage}
                            className="mt-2 transition-all duration-300 hover:scale-105 bg-transparent"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Image
                          </Button>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="imageContext" className={isDarkMode ? "text-gray-200" : "text-gray-700"}>
                        Additional Context (Optional)
                      </Label>
                      <Textarea
                        id="imageContext"
                        placeholder="Add any additional context about the image question..."
                        value={imageContext}
                        onChange={(e) => setImageContext(e.target.value)}
                        rows={2}
                        className={`mt-2 transition-all duration-300 focus:scale-[1.02] ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                  </div>
                )}
                <Button
                  onClick={() => {
                    handleButtonClick("main-submit")
                    askQuestionClient() // Call the client-side wrapper
                  }}
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 disabled:hover:scale-100 relative overflow-hidden ${
                    buttonClicked === "main-submit" ? "animate-pulse-fast" : ""
                  }`}
                  size="lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
                      </div>
                      <span>AI is analyzing...</span>
                      <div className="ml-2 flex space-x-1">
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                        <div
                          className="w-1 h-1 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1 h-1 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4 mr-2 transition-transform group-hover:rotate-12" />
                      Get AI Answer
                    </>
                  )}

                  {/* Progress bar */}
                  {isLoading && (
                    <div
                      className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-300"
                      style={{ width: `${progressAnimation}%` }}
                    ></div>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Answer Section */}
            {showAnswer && (
              <Card
                className={`shadow-xl border-0 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl animate-slide-up ${
                  isDarkMode ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
                }`}
              >
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-t-lg">
                  <CardTitle
                    className={`flex items-center gap-2 text-lg ${isDarkMode ? "text-white" : "text-gray-800"}`}
                  >
                    <Lightbulb className="h-6 w-6 animate-pulse text-yellow-500" />
                    Here's your answer! 🎉
                  </CardTitle>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Take your time to read and understand. You've got this! 💪
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6">
                  {" "}
                  {/* Adjusted padding */}
                  <div
                    className={`p-4 sm:p-6 rounded-lg border-l-4 border-blue-500 transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-blue-950/50 to-purple-950/50"
                        : "bg-gradient-to-r from-blue-50 to-purple-50"
                    }`}
                  >
                    <pre
                      className={`whitespace-pre-wrap font-sans text-sm leading-relaxed ${
                        isDarkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {answer}
                    </pre>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {" "}
                    {/* Centered buttons on mobile */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyAnswer}
                      className="transition-all duration-300 hover:scale-105 bg-transparent"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Answer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={shareAnswer}
                      className="transition-all duration-300 hover:scale-105 bg-transparent"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAnswer}
                      className="transition-all duration-300 hover:scale-105 bg-transparent"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Study Timer */}
            <Card
              className={`shadow-xl border-0 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl animate-slide-up hover-lift ${
                isDarkMode ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
              }`}
              onMouseEnter={() => setIsCardHovered("timer")}
              onMouseLeave={() => setIsCardHovered(null)}
            >
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  <Clock className={`h-5 w-5 ${isTimerRunning ? "animate-spin" : "animate-pulse"}`} />
                  Study Timer
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4 p-4 sm:p-6">
                {" "}
                {/* Adjusted padding */}
                <EnhancedTimer />
                <p
                  className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} transition-all duration-300 ${
                    isCardHovered === "timer" ? "animate-wiggle" : ""
                  }`}
                >
                  {getTimerStatus()}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={(e) => {
                      createRippleEffect(e)
                      startTimer()
                      handleButtonClick("timer-start")
                    }}
                    disabled={isTimerRunning}
                    className={`transition-all duration-300 hover:scale-105 btn-enhanced ${
                      buttonClicked === "timer-start" ? "animate-rubber-band" : ""
                    }`}
                  >
                    <Play className="h-4 w-4 mr-2 transition-transform group-hover:scale-125" />
                    Start
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      createRippleEffect(e)
                      pauseTimer()
                      handleButtonClick("timer-pause")
                    }}
                    disabled={!isTimerRunning}
                    className={`transition-all duration-300 hover:scale-105 bg-transparent btn-enhanced ${
                      buttonClicked === "timer-pause" ? "animate-jello" : ""
                    }`}
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      createRippleEffect(e)
                      resetTimer()
                      handleButtonClick("timer-reset")
                    }}
                    className={`transition-all duration-300 hover:scale-105 bg-transparent btn-enhanced ${
                      buttonClicked === "timer-reset" ? "animate-tada" : ""
                    }`}
                  >
                    <RotateCcw className="h-4 w-4 mr-2 transition-transform hover:rotate-180" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Daily Inspiration */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-600 to-purple-600 text-white transition-all duration-300 hover:shadow-2xl animate-slide-up">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-4 animate-pulse">💡 Daily Inspiration</h3>
                <blockquote className="italic mb-3 leading-relaxed animate-fade-in">"{currentQuote.text}"</blockquote>
                <cite className="text-sm opacity-90">— {currentQuote.author}</cite>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card
              className={`shadow-xl border-0 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl animate-slide-up hover-lift ${
                isDarkMode ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
              }`}
              onMouseEnter={() => setIsCardHovered("stats")}
              onMouseLeave={() => setIsCardHovered(null)}
            >
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  <ChartLine className={`h-5 w-5 ${isCardHovered === "stats" ? "animate-bounce" : "animate-pulse"}`} />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4 p-4 sm:p-6">
                {" "}
                {/* Adjusted padding */}
                <div
                  className={`transition-all duration-500 ${isCardHovered === "stats" ? "animate-heartbeat" : "animate-bounce"}`}
                >
                  <div className="text-3xl font-bold text-blue-600 animate-gradient bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    {stats.questionsAnswered}
                  </div>
                  <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Questions Answered</div>
                </div>
                <div
                  className={`transition-all duration-500 ${isCardHovered === "stats" ? "animate-heartbeat" : "animate-bounce"}`}
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className="text-3xl font-bold text-purple-600 animate-gradient bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                    {stats.studyTime}
                  </div>
                  <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Study Minutes</div>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      createRippleEffect(e)
                      resetStats()
                      handleButtonClick("stats-reset")
                    }}
                    className={`flex-1 transition-all duration-300 hover:scale-105 bg-transparent btn-enhanced hover-glow ${
                      buttonClicked === "stats-reset" ? "animate-wiggle" : ""
                    }`}
                  >
                    <RefreshCw className="h-4 w-4 mr-2 transition-transform hover:rotate-180" />
                    Reset
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={(e) => {
                      createRippleEffect(e)
                      setShowPopularQuestions(!showPopularQuestions)
                      handleButtonClick("stats-popular")
                    }}
                    className={`flex-1 transition-all duration-300 hover:scale-105 btn-enhanced ${
                      buttonClicked === "stats-popular" ? "animate-rubber-band" : ""
                    }`}
                  >
                    <Fire className="h-4 w-4 mr-2 animate-pulse" />
                    Popular
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Popular Questions */}
            {showPopularQuestions && (
              <Card
                className={`shadow-xl border-0 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl animate-slide-up ${
                  isDarkMode ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-gray-200"
                }`}
              >
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    <Fire className="h-5 w-5 text-orange-500 animate-pulse" />
                    Popular Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {" "}
                  {/* Adjusted padding */}
                  {popularQuestions.length === 0 ? (
                    <div className={`text-center py-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <Fire className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
                      <p>No popular questions yet.</p>
                      <p>Be the first to ask!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {popularQuestions.map((q, index) => {
                        const usePopularQuestionHandler = () => usePopularQuestion(q)
                        return (
                          <div
                            key={q.id}
                            onClick={usePopularQuestionHandler}
                            className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-[1.02] animate-fade-in ${
                              isDarkMode ? "border-gray-600 hover:bg-gray-700/50" : "border-gray-200 hover:bg-gray-50"
                            }`}
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <p
                              className={`font-medium text-sm line-clamp-2 mb-1 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
                            >
                              {q.question}
                            </p>
                            <div
                              className={`flex items-center justify-between text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                            >
                              <span>Subject: {q.subject}</span>
                              <Badge variant="secondary" className="text-xs animate-pulse">
                                Popular
                              </Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer Cards */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {/* About Card */}
          <Card
            className={`shadow-lg border-0 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-105 ${
              isDarkMode ? "bg-gray-800/80 border-gray-700" : "bg-white/90 border-gray-200"
            }`}
          >
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 text-blue-600 ${isDarkMode ? "text-blue-400" : ""}`}>
                <Brain className="h-5 w-5 animate-pulse" />
                About Us
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {" "}
              {/* Adjusted padding */}
              <p className={`text-sm leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Student Brain Booster is your friendly AI study companion! We help students of all levels understand any
                subject with clear, simple explanations. From primary school to college - we've got you covered! 🌟
              </p>
            </CardContent>
          </Card>

          {/* How to Use Card */}
          <Card
            className={`shadow-lg border-0 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-105 ${
              isDarkMode ? "bg-gray-800/80 border-gray-700" : "bg-white/90 border-gray-200"
            }`}
          >
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 text-purple-600 ${isDarkMode ? "text-purple-400" : ""}`}>
                <Lightbulb className="h-5 w-5 animate-pulse" />
                How to Use
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {" "}
              {/* Adjusted padding */}
              <div className={`text-sm space-y-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span>Pick your grade level</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span>Choose your subject</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span>Ask your question</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  <span>Get instant help!</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card
            className={`shadow-lg border-0 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-105 ${
              isDarkMode ? "bg-gray-800/80 border-gray-700" : "bg-white/90 border-gray-200"
            }`}
          >
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 text-green-600 ${isDarkMode ? "text-green-400" : ""}`}>
                <GraduationCap className="h-5 w-5 animate-pulse" />
                Contact & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {" "}
              {/* Adjusted padding */}
              <div className={`text-sm space-y-3 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                <div className="text-center">
                  <p className="font-semibold text-lg mb-2">Made with ❤️ by</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Ratty Ram
                  </p>
                </div>
                <div className="text-center">
                  <p className="mb-1">Need help or have feedback?</p>
                  <a
                    href="mailto:rattyramraj@gmail.com"
                    className="text-blue-600 hover:text-blue-500 transition-colors font-medium"
                  >
                    📧 rattyramraj@gmail.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Footer */}
        <div className={`text-center py-6 mt-8 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
          <p
            className={`font-semibold text-lg animate-glow ${
              isDarkMode ? "text-blue-300" : "text-blue-700" // Adjusted for better visibility
            }`}
          >
            🚀 Empowering Students with AI • Made in India 🇮🇳
          </p>
          <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
            Study Smart, Learn Fast, Achieve More! 📈
          </p>
        </div>
      </div>
      {/* Particle Effects */}
      <ParticleEffect />
    </div>
  )
}
