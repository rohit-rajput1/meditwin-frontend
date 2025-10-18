"use client"

import ChatInterface from "@/components/chat-interface"

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-64px)] bg-slate-50 overflow-hidden flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-3 overflow-hidden">
        {/* Chat Container */}
        <div className="h-full">
          <ChatInterface />
        </div>
      </div>
    </div>
  )
}