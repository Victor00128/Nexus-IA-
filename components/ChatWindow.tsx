"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import ChatMessage from "./ChatMessage"

interface Message {
  text: string
  isUser: boolean
}

interface ChatWindowProps {
  messages: Message[]
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gradient-to-br from-gray-900 to-black relative">
      {/* Subtle neon grid texture or glowing gradient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #00FF7F40 0px, #00FF7F40 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #00FF7F40 0px, #00FF7F40 1px, transparent 1px, transparent 40px)",
          backgroundSize: "40px 40px",
          filter: "blur(0.5px)",
        }}
      ></div>
      <div className="relative z-10">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default ChatWindow
