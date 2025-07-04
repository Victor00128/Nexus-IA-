"use client"

import { useRef, useEffect } from "react"
import MessageBubble from "./MessageBubble"

interface Message {
  text: string
  isUser: boolean
}

interface ChatInterfaceProps {
  messages: Message[]
}

const ChatInterface = ({ messages }: ChatInterfaceProps) => {
  const scrollAnchor = useRef<HTMLDivElement>(null)

  const scrollToLatest = () => {
    scrollAnchor.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToLatest()
  }, [messages])

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gradient-to-br from-gray-900 to-black relative">
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #00FF7F40 0px, #00FF7F40 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #00FF7F40 0px, #00FF7F40 1px, transparent 1px, transparent 40px)",
          backgroundSize: "40px 40px",
          filter: "blur(0.5px)",
        }}
      />
      <div className="relative z-10">
        {messages.map((message, index) => (
          <MessageBubble key={index} content={message.text} fromUser={message.isUser} />
        ))}
        <div ref={scrollAnchor} />
      </div>
    </div>
  )
}

export default ChatInterface
