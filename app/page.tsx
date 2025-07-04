"use client"

import { useState, useEffect } from "react"
import ChatInterface from "@/components/chat/ChatInterface"
import MessageInput from "@/components/chat/MessageInput"
import NavigationSidebar from "@/components/layout/NavigationSidebar"

export default function HomePage() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationHistory, setConversationHistory] = useState([])
  const [showMenu, setShowMenu] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [chatSessions, setChatSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)

  // Configuration for Gemini API
  const API_KEY = "AIzaSyBdUlE00dJlgo74jhzGqs1zJlS7cyCjXv4"

  useEffect(() => {
    const storedSessions = JSON.parse(localStorage.getItem("nexusAIChats") || "[]")
    setChatSessions(storedSessions)
    if (storedSessions.length > 0) {
      const mostRecent = storedSessions[storedSessions.length - 1]
      setMessages(mostRecent.messages)
      setConversationHistory(mostRecent.history)
      setActiveSessionId(mostRecent.id)
    } else {
      initializeNewSession()
    }
  }, [])

  const persistSession = (sessionId: number, messageList: any[], historyList: any[]) => {
    const sessionTitle =
      messageList.length > 0 ? messageList[0].text.substring(0, 30) + "..." : `Chat Session ${chatSessions.length + 1}`
    const sessionData = {
      id: sessionId,
      name: sessionTitle,
      messages: messageList,
      history: historyList,
      timestamp: new Date().toISOString(),
    }

    const existingIndex = chatSessions.findIndex((session: any) => session.id === sessionId)
    let updatedSessions

    if (existingIndex > -1) {
      updatedSessions = chatSessions.map((session: any, index: number) =>
        index === existingIndex ? sessionData : session,
      )
    } else {
      updatedSessions = [...chatSessions, sessionData]
    }
    setChatSessions(updatedSessions)
    localStorage.setItem("nexusAIChats", JSON.stringify(updatedSessions))
  }

  const initializeNewSession = () => {
    if (messages.length > 0 && activeSessionId) {
      persistSession(activeSessionId, messages, conversationHistory)
    } else if (messages.length > 0 && !activeSessionId) {
      persistSession(Date.now(), messages, conversationHistory)
    }

    setMessages([])
    setConversationHistory([])
    setActiveSessionId(Date.now())
    setSidebarVisible(false)
  }

  const loadExistingSession = (sessionId: number) => {
    if (messages.length > 0 && activeSessionId) {
      persistSession(activeSessionId, messages, conversationHistory)
    }

    const targetSession = chatSessions.find((session: any) => session.id === sessionId)
    if (targetSession) {
      setMessages(targetSession.messages)
      setConversationHistory(targetSession.history)
      setActiveSessionId(targetSession.id)
    }
    setSidebarVisible(false)
  }

  const removeSession = (sessionId: number) => {
    if (window.confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) {
      const filteredSessions = chatSessions.filter((session: any) => session.id !== sessionId)
      setChatSessions(filteredSessions)
      localStorage.setItem("nexusAIChats", JSON.stringify(filteredSessions))

      if (activeSessionId === sessionId) {
        initializeNewSession()
      }
    }
  }

  const exportSession = (sessionId: number) => {
    const targetSession = chatSessions.find((session: any) => session.id === sessionId)
    if (targetSession) {
      const conversationText = targetSession.messages
        .map((msg: any) => `${msg.isUser ? "You" : "Nexus AI"}: ${msg.text}`)
        .join("\n\n")

      const filename = `${targetSession.name.replace(/\s/g, "_")}_${new Date(targetSession.timestamp).toLocaleDateString().replace(/\//g, "-")}.txt`
      const fileBlob = new Blob([conversationText], { type: "text/plain;charset=utf-8" })
      const downloadLink = document.createElement("a")
      downloadLink.href = URL.createObjectURL(fileBlob)
      downloadLink.download = filename
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

  const clearCurrentSession = () => {
    setMessages([])
    setConversationHistory([])
    setActiveSessionId(Date.now())
    setShowMenu(false)
  }

  const handleUserInput = async (userMessage: string) => {
    const userMessageObj = { text: userMessage, isUser: true }
    setMessages((prev) => [...prev, userMessageObj])
    setIsLoading(true)

    const updatedHistory = [...conversationHistory, { role: "user", parts: [{ text: userMessage }] }]
    setConversationHistory(updatedHistory)

    try {
      const MODEL_NAME = "gemini-1.5-flash"
      const ENDPOINT_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

      const response = await fetch(ENDPOINT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: updatedHistory,
        }),
      })

      if (!response.ok) {
        let errorMessage = `HTTP Error: ${response.status}`
        try {
          const errorData = await response.json()
          if (errorData.error && errorData.error.message) {
            errorMessage = `API Error: ${errorData.error.message}`
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError)
        }
        throw new Error(`Request failed: ${errorMessage}`)
      }

      const responseData = await response.json()
      const botResponse = responseData.candidates[0].content.parts[0].text
      const botMessageObj = { text: botResponse, isUser: false }
      setMessages((prev) => [...prev, botMessageObj])

      setConversationHistory((prev) => [...prev, { role: "model", parts: [{ text: botResponse }] }])

      persistSession(
        activeSessionId!,
        [...messages, userMessageObj, botMessageObj],
        [...conversationHistory, { role: "model", parts: [{ text: botResponse }] }],
      )
    } catch (error: any) {
      console.error("Communication error:", error)
      const errorMessageObj = {
        text: `Unable to connect to Nexus AI: ${error.message}. Please check your connection and try again.`,
        isUser: false,
      }
      setMessages((prev) => [...prev, errorMessageObj])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-2 sm:p-4 lg:p-8 font-sans text-emerald-300">
      <div className="w-full max-w-3xl h-[95vh] sm:h-[85vh] bg-[#1A1A1A] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-emerald-800">
        <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-900 to-black text-white rounded-t-3xl shadow-md flex justify-between items-center relative">
          <button
            onClick={() => setSidebarVisible(!sidebarVisible)}
            className="p-2 rounded-lg border border-emerald-600 shadow-sm hover:bg-emerald-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Toggle navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="w-6 h-6 text-emerald-400"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="flex items-center flex-grow justify-center">
            <svg
              className="w-8 h-8 mr-2 text-emerald-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 12h10V2zM12 22L22 12H12V22zM2 12h10v10M12 12h10v10" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
            <h1 className="text-xl sm:text-3xl font-bold text-emerald-300">Nexus AI</h1>
          </div>

          <div className="w-10 h-10"></div>

          {showMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl overflow-hidden z-10 border border-emerald-700">
              <button
                onClick={clearCurrentSession}
                className="w-full text-left px-4 py-3 text-emerald-300 hover:bg-emerald-900 flex items-center text-sm sm:text-base transition-colors duration-200"
                disabled={isLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 mr-2 text-emerald-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.927a2.25 2.25 0 01-2.244-2.077L4.74 5.995m14.86-3.493a2.35 2.35 0 00-2.35-2.35H8.927a2.35 2.35 0 00-2.35 2.35m14.86-3.493V5.995m0 0a2.25 2.25 0 00-2.25-2.25h-1.5a2.25 2.25 0 00-2.25 2.25v.75m-6.75 0V5.995m0 0a2.25 2.25 0 01-2.25-2.25h-1.5a2.25 2.25 0 01-2.25 2.25v.75m-6.75 0V5.995"
                  />
                </svg>
                Clear Current Chat
              </button>
            </div>
          )}
        </div>

        <NavigationSidebar
          isVisible={sidebarVisible}
          onClose={() => setSidebarVisible(false)}
          sessions={chatSessions}
          onLoadSession={loadExistingSession}
          onCreateNew={initializeNewSession}
          onRemoveSession={removeSession}
          onExportSession={exportSession}
          currentSessionId={activeSessionId}
        />

        <ChatInterface messages={messages} />
        <MessageInput onSubmit={handleUserInput} isProcessing={isLoading} />
      </div>
    </div>
  )
}
