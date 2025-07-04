"use client"

import type React from "react"

import { useState } from "react"

interface ChatSession {
  id: number
  name: string
  messages: any[]
  timestamp: string
}

interface NavigationSidebarProps {
  isVisible: boolean
  onClose: () => void
  sessions: ChatSession[]
  onLoadSession: (sessionId: number) => void
  onCreateNew: () => void
  onRemoveSession: (sessionId: number) => void
  onExportSession: (sessionId: number) => void
  currentSessionId: number | null
}

const NavigationSidebar = ({
  isVisible,
  onClose,
  sessions,
  onLoadSession,
  onCreateNew,
  onRemoveSession,
  onExportSession,
  currentSessionId,
}: NavigationSidebarProps) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; sessionId: number } | null>(null)
  const [filterText, setFilterText] = useState("")
  const [editingSession, setEditingSession] = useState<number | null>(null)
  const [editName, setEditName] = useState("")

  const handleRightClick = (e: React.MouseEvent, sessionId: number) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, sessionId })
  }

  const closeContextMenu = () => {
    setContextMenu(null)
  }

  const handleRemove = () => {
    if (contextMenu) {
      onRemoveSession(contextMenu.sessionId)
      closeContextMenu()
    }
  }

  const handleExport = () => {
    if (contextMenu) {
      onExportSession(contextMenu.sessionId)
      closeContextMenu()
    }
  }

  const startRename = (sessionId: number, currentName: string) => {
    setEditingSession(sessionId)
    setEditName(currentName)
    closeContextMenu()
  }

  const saveRename = (sessionId: number) => {
    if (editName.trim() === "") {
      alert("Session name cannot be empty.")
      return
    }
    const updatedSessions = sessions.map((session) =>
      session.id === sessionId ? { ...session, name: editName.trim() } : session,
    )
    localStorage.setItem("savedChats", JSON.stringify(updatedSessions))
    window.location.reload()
    setEditingSession(null)
    setEditName("")
  }

  const cancelRename = () => {
    setEditingSession(null)
    setEditName("")
  }

  const filteredSessions = sessions.filter(
    (session) =>
      session.name.toLowerCase().includes(filterText.toLowerCase()) ||
      session.messages.some((msg: any) => msg.text.toLowerCase().includes(filterText.toLowerCase())),
  )

  return (
    <>
      {isVisible && <div className="fixed inset-0 bg-black bg-opacity-50 sm:hidden" onClick={onClose} />}

      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-gray-800 text-white flex flex-col shadow-lg transform ${isVisible ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out sm:relative sm:translate-x-0 sm:flex-shrink-0 sm:border-r sm:border-gray-200 sm:shadow-none`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-xl font-bold">Chat History</h2>
          <button
            onClick={onClose}
            className="sm:hidden p-1 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <button
            onClick={onCreateNew}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Chat
          </button>
        </div>

        <div className="p-4 border-b border-gray-700">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {filteredSessions.length === 0 ? (
            <p className="text-gray-400 text-center mt-4">No conversations found.</p>
          ) : (
            <ul>
              {filteredSessions.map((session) => (
                <li key={session.id} className="mb-2">
                  {editingSession === session.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-grow px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") saveRename(session.id)
                        }}
                      />
                      <button
                        onClick={() => saveRename(session.id)}
                        className="p-2 rounded-full text-green-400 hover:bg-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </button>
                      <button onClick={cancelRename} className="p-2 rounded-full text-red-400 hover:bg-gray-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onLoadSession(session.id)}
                      onContextMenu={(e) => handleRightClick(e, session.id)}
                      className={`w-full text-left p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                        session.id === currentSessionId ? "bg-gray-700 font-bold" : "bg-gray-800"
                      }`}
                    >
                      <p className="text-sm truncate">{session.name}</p>
                      <p className="text-xs text-gray-400">{new Date(session.timestamp).toLocaleDateString()}</p>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {contextMenu && (
        <div
          className="fixed bg-white rounded-lg shadow-xl py-2 z-30"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onMouseLeave={closeContextMenu}
        >
          <button
            onClick={() =>
              startRename(contextMenu.sessionId, sessions.find((s) => s.id === contextMenu.sessionId)?.name || "")
            }
            className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14.25v4.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V7.5a2.25 2.25 0 012.25-2.25H9"
              />
            </svg>
            Rename conversation
          </button>
          <button
            onClick={handleRemove}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.927a2.25 2.25 0 01-2.244-2.077L4.74 5.995m14.86-3.493a2.35 2.35 0 00-2.35-2.35H8.927a2.35 2.35 0 00-2.35 2.35m14.86-3.493V5.995m0 0a2.25 2.25 0 00-2.25-2.25h-1.5a2.25 2.25 0 00-2.25 2.25v.75m-6.75 0V5.995m0 0a2.25 2.25 0 01-2.25-2.25h-1.5a2.25 2.25 0 01-2.25 2.25v.75m-6.75 0V5.995"
              />
            </svg>
            Delete conversation
          </button>
          <button
            onClick={handleExport}
            className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Export conversation
          </button>
        </div>
      )}
    </>
  )
}

export default NavigationSidebar
