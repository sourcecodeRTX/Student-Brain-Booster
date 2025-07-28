"use server"

// API Configuration with proper key rotation (now server-side only)
// Environment variables are now accessed without NEXT_PUBLIC_ prefix for server-side use
const GEMINI_API_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
].filter(Boolean) as string[] // Ensure keys are strings and filter out undefined

let currentApiKeyIndex = 0

const getNextApiKey = () => {
  if (GEMINI_API_KEYS.length === 0) return null
  const key = GEMINI_API_KEYS[currentApiKeyIndex]
  currentApiKeyIndex = (currentApiKeyIndex + 1) % GEMINI_API_KEYS.length
  return key
}

// Server-side function to ask Gemini AI
export async function askGeminiAI(prompt: string, imageData?: string): Promise<string> {
  // Explicit check for API keys being available
  if (GEMINI_API_KEYS.length === 0) {
    console.error("No Gemini API keys found in environment variables. Please set GEMINI_API_KEY_1, etc.")
    throw new Error(
      "AI service not configured: No API keys found. Please set your Gemini API keys in environment variables.",
    )
  }

  let lastError: Error | null = null

  // Try each API key
  for (let attempt = 0; attempt < GEMINI_API_KEYS.length; attempt++) {
    const apiKey = getNextApiKey()
    // This check is a safeguard, though the initial check should prevent this path if no keys are loaded.
    if (!apiKey) {
      throw new Error("Internal error: API key became null during rotation.")
    }

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

      const requestBody: any = {
        contents: [
          {
            parts: imageData
              ? [
                  { text: prompt },
                  {
                    inline_data: {
                      mime_type: "image/jpeg",
                      data: imageData.split(",")[1], // Remove data:image/jpeg;base64, prefix
                    },
                  },
                ]
              : [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 1024,
        },
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        // Capture more specific error message from the API response
        const errorMessage =
          errorData.error?.message || response.statusText || `Unknown API error (Status: ${response.status})`
        throw new Error(`API Error (Key ${attempt + 1}): ${errorMessage}`)
      }

      const data = await response.json()

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text
      } else {
        throw new Error("No valid response from AI (empty candidates or content).")
      }
    } catch (error) {
      lastError = error as Error
      console.error(`API attempt ${attempt + 1} failed:`, error)

      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout. Please try again.")
      }

      // Continue to next API key if available
      if (attempt < GEMINI_API_KEYS.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second before retry
      }
    }
  }

  // If all attempts fail, throw the last encountered error or a generic one
  throw (
    lastError ||
    new Error("All API keys failed after multiple attempts. Please check your API keys and network connection.")
  )
}
