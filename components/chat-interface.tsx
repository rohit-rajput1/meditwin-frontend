"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import ChatMessage from "@/components/chat-message"
import { Send, Plus } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI health assistant. I'm here to help you understand your medical reports and answer health-related questions. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(Date.now() - 5 * 60000),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const aiResponses = [
      "Based on your medical history, I recommend maintaining a regular exercise routine and monitoring your blood pressure. Would you like more specific advice?",
      "That's a great question! Regular check-ups are important for maintaining good health. I suggest scheduling an appointment with your doctor every 6-12 months.",
      "I understand your concern. It's important to maintain a balanced diet and stay hydrated. If symptoms persist, please consult with a healthcare professional.",
      "Your recent lab results look promising. Keep up with your current health routine and don't hesitate to reach out if you have any concerns.",
      "Thank you for sharing that information. Based on your health profile, I recommend focusing on stress management and adequate sleep. Would you like some tips?",
    ]

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
      sender: "ai",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, aiMessage])
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
    // Auto-resize textarea
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
  }

  const handleNewChat = () => {
    setMessages([
      {
        id: "1",
        text: "Hello! I'm your AI health assistant. I'm here to help you understand your medical reports and answer health-related questions. How can I assist you today?",
        sender: "ai",
        timestamp: new Date(),
      },
    ])
    setInputValue("")
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">MediTwin AI Doctor</h2>
          <p className="text-sm text-slate-600">Always here to help</p>
        </div>
        <Button onClick={handleNewChat} variant="outline" size="sm" className="gap-2 bg-transparent">
          <Plus size={16} />
          New Chat
        </Button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg.text} sender={msg.sender} timestamp={msg.timestamp} />
        ))}

        {isLoading && <ChatMessage message="" sender="ai" timestamp={new Date()} isLoading={true} />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 p-4 bg-slate-50/50">
        <div className="flex gap-3">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about your health..."
            className="resize-none"
            disabled={isLoading}
            rows={1}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white flex-shrink-0 h-auto"
          >
            <Send size={20} />
          </Button>
        </div>
        <p className="text-xs text-slate-600 mt-2">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  )
}
