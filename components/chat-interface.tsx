"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ChatMessage from "@/components/chat-message"
import { Send, Plus, Search, MoreVertical, Trash2, Edit2, ArrowLeft, Loader2 } from "lucide-react"

interface Message {
  message_id: string
  user_query: string
  bot_response: string
  created_at: string
}

interface Chat {
  chat_id: string
  chat_name: string
}

interface ChatInterfaceProps {
  initialChatId?: string | null
  fileId?: string | null
}

export default function ChatInterface({ initialChatId, fileId }: ChatInterfaceProps) {
  const router = useRouter()
  
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(initialChatId || null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const currentChat = chats.find(chat => chat.chat_id === currentChatId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Load recent chats
  useEffect(() => {
    async function loadRecentChats() {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            action: "recent", 
            search: searchQuery || undefined 
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setChats(data.chats || [])
        } else {
          console.error("Failed to load recent chats:", await response.text())
        }
      } catch (error) {
        console.error("Failed to load recent chats:", error)
      }
    }

    loadRecentChats()
  }, [searchQuery])

  // Load chat history when chat changes
  useEffect(() => {
    async function loadChatHistory() {
      if (!currentChatId) {
        setMessages([])
        return
      }

      try {
        setIsLoading(true)
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "history", chat_id: currentChatId }),
        })

        if (response.ok) {
          const data = await response.json()
          setMessages(data.messages || [])
        }
      } catch (error) {
        console.error("Failed to load chat history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadChatHistory()
  }, [currentChatId])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // If no current chat, create one first
    if (!currentChatId) {
      if (!fileId) {
        alert("Please select a file or create a new chat from the dashboard")
        return
      }

      try {
        const createResponse = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "create", file_id: fileId }),
        })

        if (!createResponse.ok) {
          throw new Error("Failed to create chat")
        }

        const { chat_id } = await createResponse.json()
        setCurrentChatId(chat_id)
        
        // Reload chats list
        const recentResponse = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "recent" }),
        })
        
        if (recentResponse.ok) {
          const data = await recentResponse.json()
          setChats(data.chats || [])
        }

        // Now send the message with the new chat_id
        await sendMessage(chat_id)
      } catch (error) {
        console.error("Failed to create chat:", error)
        alert("Failed to create chat. Please try again.")
      }
      return
    }

    await sendMessage(currentChatId)
  }

  const sendMessage = async (chatId: string) => {
    const userMessage = inputValue.trim()
    setInputValue("")
    setIsSendingMessage(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "continue",
          chat_id: chatId,
          user_query: userMessage,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()
      
      // Add the new message to the list
      setMessages(prev => [...prev, {
        message_id: data.message_id || Date.now().toString(),
        user_query: data.user_query,
        bot_response: data.bot_response,
        created_at: data.created_at,
      }])

      // Reload chats to update chat name if it was "Untitled Chat"
      const recentResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "recent" }),
      })
      
      if (recentResponse.ok) {
        const recentData = await recentResponse.json()
        setChats(recentData.chats || [])
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setIsSendingMessage(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
  }

  const createNewChat = async () => {
    if (!fileId) {
      alert("Please select a file from the dashboard to start a new chat")
      return
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", file_id: fileId }),
      })

      if (!response.ok) {
        throw new Error("Failed to create chat")
      }

      const { chat_id } = await response.json()
      setCurrentChatId(chat_id)
      setMessages([])
      setInputValue("")

      // Reload chats list
      const recentResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "recent" }),
      })
      
      if (recentResponse.ok) {
        const data = await recentResponse.json()
        setChats(data.chats || [])
      }
    } catch (error) {
      console.error("Failed to create new chat:", error)
      alert("Failed to create new chat. Please try again.")
    }
  }

  const deleteChat = async (chatId: string) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", chat_id: chatId }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete chat")
      }

      setChats(prev => prev.filter(chat => chat.chat_id !== chatId))
      
      if (currentChatId === chatId) {
        const remainingChats = chats.filter(chat => chat.chat_id !== chatId)
        setCurrentChatId(remainingChats.length > 0 ? remainingChats[0].chat_id : null)
      }
      
      setActiveMenu(null)
    } catch (error) {
      console.error("Failed to delete chat:", error)
      alert("Failed to delete chat. Please try again.")
    }
  }

  const startRenaming = (chatId: string, currentName: string) => {
    setEditingChatId(chatId)
    setEditingName(currentName)
    setActiveMenu(null)
  }

  const finishRenaming = async () => {
    if (!editingChatId || !editingName.trim()) {
      setEditingChatId(null)
      setEditingName("")
      return
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rename",
          chat_id: editingChatId,
          chat_name: editingName.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to rename chat")
      }

      setChats(prev => prev.map(chat =>
        chat.chat_id === editingChatId ? { ...chat, chat_name: editingName.trim() } : chat
      ))
    } catch (error) {
      console.error("Failed to rename chat:", error)
      alert("Failed to rename chat. Please try again.")
    } finally {
      setEditingChatId(null)
      setEditingName("")
    }
  }

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      finishRenaming()
    } else if (e.key === "Escape") {
      setEditingChatId(null)
      setEditingName("")
    }
  }

  const filteredChats = chats.filter(chat =>
    chat.chat_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-white flex flex-col rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-shrink-0">
        <div className="p-4 border-b border-slate-100 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/")}
            className="gap-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 -ml-2 mb-4 h-8"
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-medium">Back</span>
          </Button>
          
          <Button onClick={createNewChat} size="sm" className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white h-9">
            <Plus size={16} />
            <span className="text-sm">Create New Chat</span>
          </Button>

          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 min-h-0">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 px-2">Recent Chats</h3>
          <div className="space-y-1">
            {filteredChats.map(chat => (
              <div
                key={chat.chat_id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                  currentChatId === chat.chat_id
                    ? "bg-indigo-50 border border-indigo-100"
                    : "hover:bg-slate-50 border border-transparent"
                }`}
                onClick={() => setCurrentChatId(chat.chat_id)}
              >
                {editingChatId === chat.chat_id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={finishRenaming}
                    onKeyDown={handleRenameKeyDown}
                    className="w-full px-2 py-1 text-sm border border-indigo-400 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{chat.chat_name}</p>
                      </div>
                      
                      <div className="relative" ref={activeMenu === chat.chat_id ? menuRef : null}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveMenu(activeMenu === chat.chat_id ? null : chat.chat_id)
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded transition-all"
                        >
                          <MoreVertical size={14} className="text-slate-600" />
                        </button>
                        
                        {activeMenu === chat.chat_id && (
                          <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-10 overflow-hidden">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                startRenaming(chat.chat_id, chat.chat_name)
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Edit2 size={14} />
                              Rename
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteChat(chat.chat_id)
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-w-0">
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {currentChat?.chat_name || "Select a chat or create a new one"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">AI-powered medical assistant</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              <p>Start a conversation by typing a message below</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.message_id}>
                <ChatMessage 
                  message={msg.user_query} 
                  sender="user" 
                  timestamp={new Date(msg.created_at)} 
                />
                <ChatMessage 
                  message={msg.bot_response} 
                  sender="ai" 
                  timestamp={new Date(msg.created_at)} 
                />
              </div>
            ))
          )}
          {isSendingMessage && (
            <ChatMessage message="" sender="ai" timestamp={new Date()} isLoading={true} />
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-slate-100 p-4 flex-shrink-0">
          <div className="flex gap-3">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your health..."
              className="resize-none text-sm border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isSendingMessage}
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isSendingMessage}
              className="bg-indigo-600 hover:bg-indigo-700 text-white flex-shrink-0 h-auto px-4"
            >
              <Send size={18} />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  )
}