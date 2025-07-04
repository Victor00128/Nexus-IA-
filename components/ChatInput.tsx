"use client"

import type React from "react"
import { useState } from "react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [currentMessage, setCurrentMessage] = useState("")

  const handleMessageSend = () => {
    if (currentMessage.trim() && !isLoading) {
      onSendMessage(currentMessage)
      setCurrentMessage("")
    }
  }

  const handleEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleMessageSend()
    }
  }

  return (
    <div className="p-3 sm:p-4 bg-gray-900 border-t border-emerald-800 flex items-center rounded-b-3xl shadow-lg">
      <textarea
        className="flex-grow px-3 py-2 sm:px-4 sm:py-2 bg-gray-800 text-emerald-300 placeholder-emerald-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300 resize-none overflow-hidden h-10 sm:h-12 text-sm sm:text-base border border-emerald-700"
        placeholder="Type your message..."
        value={currentMessage}
        onChange={(e) => {
          setCurrentMessage(e.target.value)
          e.target.style.height = "auto"
          e.target.style.height = e.target.scrollHeight + "px"
        }}
        onKeyPress={handleEnterPress}
        rows={1}
        disabled={isLoading}
      />
      <button
        onClick={handleMessageSend}
        className={`ml-3 sm:ml-4 px-4 py-2 sm:px-6 sm:py-3 rounded-lg border border-emerald-600 shadow-md font-semibold transition-colors duration-300 ease-in-out hover:shadow-lg hover:bg-emerald-700 flex items-center justify-center ${
          isLoading ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-emerald-600 text-white"
        }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 50 50">
            <circle
              className="path"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="4"
              stroke="currentColor"
              strokeDasharray="80, 200"
              strokeDashoffset="0"
            ></circle>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        )}
      </button>
    </div>
  )
}

export default ChatInput
