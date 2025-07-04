"use client"

import { useState } from "react"

interface MessageBubbleProps {
  content: string
  fromUser: boolean
}

const MessageBubble = ({ content, fromUser }: MessageBubbleProps) => {
  const [showCopyAction, setShowCopyAction] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div
      className={`flex mb-4 ${fromUser ? "justify-end" : "justify-start"}`}
      onMouseEnter={() => setShowCopyAction(true)}
      onMouseLeave={() => setShowCopyAction(false)}
    >
      <div
        className={`max-w-[80%] p-4 rounded-lg shadow-md text-sm sm:text-base transition-all duration-300 ease-in-out relative border ${
          fromUser
            ? "bg-emerald-900 text-emerald-200 rounded-br-none border-emerald-700"
            : "bg-gray-800 text-gray-300 rounded-bl-none border-gray-700"
        }`}
        style={{ fontFamily: "Inter, Poppins, sans-serif" }}
      >
        <p>{content}</p>
        {!fromUser && showCopyAction && (
          <button
            onClick={copyToClipboard}
            className="absolute top-1 right-1 p-1 bg-gray-700 text-emerald-400 rounded-full text-xs opacity-75 hover:opacity-100 transition-opacity group border border-emerald-800"
            title="Copy message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 17.25v-1.058a1.5 1.5 0 011.5-1.5H18a2.25 2.25 0 012.25 2.25v2.25A2.25 2.25 0 0118 22.5h-2.25a1.5 1.5 0 01-1.5-1.5V21m-1.5-1.5H5.625c-.621 0-1.125-.504-1.125-1.125V9.75m9.375 9.375H9.75M5.625 5.625h10.5M9.75 9.75H3.375c-.621 0-1.125-.504-1.125-1.125V4.5c0-.621.504-1.125 1.125-1.125h6.375c.621 0 1.125.504 1.125 1.125v3.375c0 .621-.504 1.125-1.125 1.125z"
              />
            </svg>
            <span className="absolute hidden group-hover:block bg-gray-900 text-emerald-300 text-xs rounded py-1 px-2 -mt-8 -ml-8 whitespace-nowrap border border-emerald-700">
              Copy message
            </span>
          </button>
        )}
      </div>
    </div>
  )
}

export default MessageBubble
