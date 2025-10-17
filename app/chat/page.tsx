"use client"

import ChatInterface from "@/components/chat-interface"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function ChatPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-100px)]">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Chat with AI Doctor</h1>
            <p className="text-slate-600 mt-1">Get instant health insights and personalized advice</p>
          </div>
          <Button onClick={() => router.back()} variant="outline" className="gap-2 bg-transparent">
            <ArrowLeft size={18} />
            Back
          </Button>
        </div>

        {/* Chat Container */}
        <div className="h-[calc(100%-80px)]">
          <ChatInterface />
        </div>
      </div>
    </div>
  )
}
