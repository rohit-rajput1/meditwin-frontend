"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ChatMessage from "@/components/chat-message"
import { Send, Plus, Search, MoreVertical, Trash2, Edit2, ChevronDown, Check, ArrowLeft } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

interface Chat {
  id: string
  name: string
  messages: Message[]
  specialists: string[]
  lastMessage: Date
}

const specialists = [
  "General Physician",
  "Pathologist",
  "Endocrinologist",
  "Nutritionist",
  "Pharmacist"
]

export default function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      name: "Health Checkup Discussion",
      specialists: ["General Physician"],
      lastMessage: new Date(Date.now() - 2 * 60 * 60000),
      messages: [
        {
          id: "1",
          text: "Hello! I'm your AI General Physician. How can I assist you today?",
          sender: "ai",
          timestamp: new Date(Date.now() - 2 * 60 * 60000),
        },
      ],
    },
  ])
  
  const [currentChatId, setCurrentChatId] = useState("1")
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [selectedSpecialists, setSelectedSpecialists] = useState<string[]>(["General Physician"])
  const [showSpecialistDropdown, setShowSpecialistDropdown] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentChat = chats.find(chat => chat.id === currentChatId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null)
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSpecialistDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentChat) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, messages: [...chat.messages, userMessage], lastMessage: new Date() }
        : chat
    ))
    
    setInputValue("")
    setIsLoading(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    await new Promise(resolve => setTimeout(resolve, 1500))

    const responses: Record<string, string[]> = {
      "General Physician": [
        "Based on your symptoms, I recommend getting adequate rest and staying hydrated. If symptoms persist, please schedule an appointment.",
        "Your health concerns are valid. I suggest monitoring your symptoms and maintaining a healthy lifestyle.",
      ],
      "Pathologist": [
        "Your lab results show normal ranges for most parameters. I'll explain any notable findings in detail.",
        "Based on the test results, everything appears within normal limits.",
      ],
      "Endocrinologist": [
        "Hormonal balance is crucial for overall health. Your symptoms suggest we should monitor your thyroid function.",
        "Let's discuss your metabolic health. Regular monitoring and lifestyle adjustments can make a significant difference.",
      ],
      "Nutritionist": [
        "A balanced diet rich in whole foods, lean proteins, and vegetables would benefit your health goals.",
        "Your nutritional needs can be met through mindful eating. Let's create a sustainable plan for your lifestyle.",
      ],
      "Pharmacist": [
        "It's important to take medications as prescribed. Let me explain the proper dosage and potential side effects.",
        "Always inform your doctor about all medications you're taking to avoid interactions.",
      ],
    }

    const activeSpecialist = currentChat.specialists[Math.floor(Math.random() * currentChat.specialists.length)]
    const specialistResponses = responses[activeSpecialist] || responses["General Physician"]
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: specialistResponses[Math.floor(Math.random() * specialistResponses.length)],
      sender: "ai",
      timestamp: new Date(),
    }

    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, messages: [...chat.messages, aiMessage] }
        : chat
    ))
    
    setIsLoading(false)
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

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      name: `New Chat`,
      specialists: selectedSpecialists.length > 0 ? selectedSpecialists : ["General Physician"],
      lastMessage: new Date(),
      messages: [
        {
          id: "1",
          text: `Hello! I'm your AI ${selectedSpecialists.length > 0 ? selectedSpecialists.join(", ") : "General Physician"}. How can I assist you today?`,
          sender: "ai",
          timestamp: new Date(),
        },
      ],
    }
    
    setChats(prev => [newChat, ...prev])
    setCurrentChatId(newChat.id)
    setInputValue("")
  }

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId))
    if (currentChatId === chatId && chats.length > 1) {
      const remainingChats = chats.filter(chat => chat.id !== chatId)
      setCurrentChatId(remainingChats[0].id)
    }
    setActiveMenu(null)
  }

  const startRenaming = (chatId: string, currentName: string) => {
    setEditingChatId(chatId)
    setEditingName(currentName)
    setActiveMenu(null)
  }

  const finishRenaming = () => {
    if (editingChatId && editingName.trim()) {
      setChats(prev => prev.map(chat => 
        chat.id === editingChatId ? { ...chat, name: editingName.trim() } : chat
      ))
    }
    setEditingChatId(null)
    setEditingName("")
  }

  const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      finishRenaming()
    } else if (e.key === "Escape") {
      setEditingChatId(null)
      setEditingName("")
    }
  }

  const toggleSpecialist = (specialist: string) => {
    setSelectedSpecialists(prev => {
      if (prev.includes(specialist)) {
        return prev.filter(s => s !== specialist)
      } else {
        return [...prev, specialist]
      }
    })
  }

  const applySpecialists = () => {
    if (currentChat && selectedSpecialists.length > 0) {
      setChats(prev => prev.map(chat =>
        chat.id === currentChatId ? { ...chat, specialists: selectedSpecialists } : chat
      ))
    }
    setShowSpecialistDropdown(false)
  }

  useEffect(() => {
    if (currentChat) {
      setSelectedSpecialists(currentChat.specialists)
    }
  }, [currentChatId])

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-full gap-4 overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-white flex flex-col rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-shrink-0">
        <div className="p-4 border-b border-slate-100 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 -ml-2 mb-4 h-8"
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-medium">Back</span>
          </Button>
          
          {/* New Chat Button */}
          <Button onClick={createNewChat} size="sm" className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white h-9">
            <Plus size={16} />
            <span className="text-sm">Create New Chat</span>
          </Button>

          {/* Search */}
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

        {/* Recent Chats */}
        <div className="flex-1 overflow-y-auto p-3 min-h-0">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 px-2">Recent Chats</h3>
          <div className="space-y-1">
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                  currentChatId === chat.id
                    ? "bg-indigo-50 border border-indigo-100"
                    : "hover:bg-slate-50 border border-transparent"
                }`}
                onClick={() => setCurrentChatId(chat.id)}
              >
                {editingChatId === chat.id ? (
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
                        <p className="text-sm font-medium text-slate-900 truncate">{chat.name}</p>
                        <p className="text-xs text-slate-500 mt-1 truncate">{chat.specialists.join(", ")}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {chat.lastMessage.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      
                      <div className="relative" ref={activeMenu === chat.id ? menuRef : null}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveMenu(activeMenu === chat.id ? null : chat.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded transition-all"
                        >
                          <MoreVertical size={14} className="text-slate-600" />
                        </button>
                        
                        {activeMenu === chat.id && (
                          <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-10 overflow-hidden">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                startRenaming(chat.id, chat.name)
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                              <Edit2 size={14} />
                              Rename
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteChat(chat.id)
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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {currentChat?.name || "Health Checkup Discussion"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Always here to help</p>
          </div>

          {/* Specialist Multi-Select Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              onClick={() => setShowSpecialistDropdown(!showSpecialistDropdown)}
              variant="outline"
              size="sm"
              className="gap-2 bg-white border-slate-200 hover:bg-slate-50 h-9"
            >
              <span className="text-sm font-medium text-slate-700">
                {currentChat?.specialists.length === 1 
                  ? currentChat.specialists[0]
                  : `${currentChat?.specialists.length || 0} Specialists`}
              </span>
              <ChevronDown size={14} className="text-slate-500" />
            </Button>

            {showSpecialistDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-10 overflow-hidden">
                <div className="p-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-600 px-2 py-1">Select Specialists</p>
                </div>
                <div className="max-h-64 overflow-y-auto p-2">
                  {specialists.map(specialist => (
                    <button
                      key={specialist}
                      onClick={() => toggleSpecialist(specialist)}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-slate-50 rounded-md transition-colors"
                    >
                      <span className={selectedSpecialists.includes(specialist) ? "text-indigo-600 font-medium" : "text-slate-700"}>
                        {specialist}
                      </span>
                      {selectedSpecialists.includes(specialist) && (
                        <Check size={16} className="text-indigo-600" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="p-2 border-t border-slate-100 flex gap-2">
                  <Button
                    onClick={() => setShowSpecialistDropdown(false)}
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={applySpecialists}
                    size="sm"
                    className="flex-1 h-8 text-xs bg-indigo-600 hover:bg-indigo-700"
                    disabled={selectedSpecialists.length === 0}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
          {currentChat?.messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg.text} sender={msg.sender} timestamp={msg.timestamp} />
          ))}

          {isLoading && <ChatMessage message="" sender="ai" timestamp={new Date()} isLoading={true} />}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-100 p-4 flex-shrink-0">
          <div className="flex gap-3">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your health..."
              className="resize-none text-sm border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isLoading}
              rows={1}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
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
