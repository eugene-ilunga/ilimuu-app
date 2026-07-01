"use client"

import { useState, useEffect } from "react"
import Chatbot from "./chatbot"

export default function ChatbotWrapper() {
  const [isEnabled, setIsEnabled] = useState(true) // Default to true
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChatbotSetting = async () => {
      try {
        const response = await fetch("/api/setttings")
        if (response.ok) {
          const data = await response.json()
          setIsEnabled(data.enableChatbot !== false) // Default to true if not set
        }
      } catch (error) {
        console.error("Error fetching chatbot setting:", error)
        // Default to enabled if there's an error
        setIsEnabled(true)
      } finally {
        setLoading(false)
      }
    }

    fetchChatbotSetting()
  }, [])

  // Don't render anything while loading or if disabled
  if (loading || !isEnabled) {
    return null
  }

  return <Chatbot />
}

