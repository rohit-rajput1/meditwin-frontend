"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import ChatInterface from "@/components/chat-interface"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ChatPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const fileId = searchParams.get("file_id")
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [chatId, setChatId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkAuthAndInitialize() {
      try {
        setIsLoading(true)
        setError(null)

        // Check if user is authenticated
        const authResponse = await fetch("/api/auth/me")
        
        if (!authResponse.ok) {
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        setIsAuthenticated(true)

        // If file_id is provided, create a new chat with that file
        if (fileId) {
          console.log("Creating chat with file_id:", fileId)
          
          const createResponse = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "create",
              file_id: fileId,
            }),
          })

          if (!createResponse.ok) {
            const errorData = await createResponse.json()
            throw new Error(errorData.error || "Failed to create chat")
          }

          const data = await createResponse.json()
          setChatId(data.chat_id)
          console.log("Chat created with ID:", data.chat_id)
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Initialization error:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to initialize chat"
        setError(errorMessage)
        setIsLoading(false)
      }
    }

    checkAuthAndInitialize()
  }, [fileId])

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading chat...</p>
        </div>
      </div>
    )
  }

  // Show authentication error
  if (isAuthenticated === false) {
    return (
      <div className="h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle size={24} />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">
              You need to be logged in to access the chat feature.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={() => router.push("/login")} 
                className="flex-1"
              >
                Log In
              </Button>
              <Button 
                onClick={() => router.push("/signup")} 
                variant="outline"
                className="flex-1"
              >
                Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle size={24} />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">{error}</p>
            <Button 
              onClick={() => router.push("/")} 
              className="w-full"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show chat interface
  return (
    <div className="h-[calc(100vh-64px)] bg-slate-50 overflow-hidden flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-3 overflow-hidden">
        <div className="h-full">
          <ChatInterface initialChatId={chatId} fileId={fileId} />
        </div>
      </div>
    </div>
  )
}