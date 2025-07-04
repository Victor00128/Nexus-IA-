"use client"

import type React from "react"
import { useState } from "react"

interface Chat {
  id: number
  name: string
  messages: any[]
  timestamp: string
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  savedChats: Chat[]
  onLoadChat: (chatId: number) => void
  onNewChat: () => void
  onDeleteChat: (chatId: number) => void
  onDownloadChat: (chatId: number) => void
  currentChatId: number | null
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  savedChats,
  onLoadChat,
  onNewChat,
  onDeleteChat,
  onDownloadChat,
  currentChatId,
}) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; chatId: number } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isRenaming, setIsRenaming] = useState<number | null>(null)
  const [newName, setNewName] = useState("")

  const handleContextMenu = (e: React.MouseEvent, chatId: number) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, chatId })
  }

  const handleCloseContextMenu = () => {
    setContextMenu(null)
  }

  const handleDeleteClick = () => {
    if (contextMenu) {
      onDeleteChat(contextMenu.chatId)
      handleCloseContextMenu()
    }
  }

  const handleDownloadClick = () => {
    if (contextMenu) {
      onDownloadChat(contextMenu.chatId)
      handleCloseContextMenu()
    }
  }

  const handleRenameClick = (chatId: number, currentName: string) => {
    setIsRenaming(chatId)
    setNewName(currentName)
    handleCloseContextMenu()
  }

  const handleSaveRename = (chatId: number) => {
    if (newName.trim() === "") {
      alert("El nombre del chat no puede estar vacío.")
      return
    }
    const updatedChats = savedChats.map((chat) => (chat.id === chatId ? { ...chat, name: newName.trim() } : chat))
    localStorage.setItem("savedChats", JSON.stringify(updatedChats))
    window.location.reload()
    setIsRenaming(null)
    setNewName("")
  }

  const handleCancelRename = () => {
    setIsRenaming(null)
    setNewName("")
  }

  const filteredChats = savedChats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.messages.some((msg: any) => msg.text.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 sm:hidden" onClick={onClose}></div>}

      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-gray-800 text-white flex flex-col shadow-lg transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out sm:relative sm:translate-x-0 sm:flex-shrink-0 sm:border-r sm:border-gray-200 sm:shadow-none`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-xl font-bold">Historial de Chats</h2>
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
            onClick={onNewChat}
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
            Nuevo Chat
          </button>
        </div>

        <div className="p-4 border-b border-gray-700">
          <input
            type="text"
            placeholder="Buscar chats..."
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {filteredChats.length === 0 ? (
            <p className="text-gray-400 text-center mt-4">No se encontraron chats.</p>
          ) : (
            <ul>
              {filteredChats.map((chat) => (
                <li key={chat.id} className="mb-2">
                  {isRenaming === chat.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-grow px-3 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleSaveRename(chat.id)
                        }}
                      />
                      <button
                        onClick={() => handleSaveRename(chat.id)}
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
                      <button onClick={handleCancelRename} className="p-2 rounded-full text-red-400 hover:bg-gray-700">
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
                      onClick={() => onLoadChat(chat.id)}
                      onContextMenu={(e) => handleContextMenu(e, chat.id)}
                      className={`w-full text-left p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                        chat.id === currentChatId ? "bg-gray-700 font-bold" : "bg-gray-800"
                      }`}
                    >
                      <p className="text-sm truncate">{chat.name}</p>
                      <p className="text-xs text-gray-400">{new Date(chat.timestamp).toLocaleDateString()}</p>
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
          onMouseLeave={handleCloseContextMenu}
        >
          <button
            onClick={() =>
              handleRenameClick(contextMenu.chatId, savedChats.find((c) => c.id === contextMenu.chatId)?.name || "")
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
            Renombrar chat
          </button>
          <button
            onClick={handleDeleteClick}
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
            Eliminar chat
          </button>
          <button
            onClick={handleDownloadClick}
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
            Descargar chat
          </button>
        </div>
      )}
    </>
  )
}

export default Sidebar
