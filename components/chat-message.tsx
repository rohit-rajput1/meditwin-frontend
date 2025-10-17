import { MessageCircle, User } from "lucide-react"

interface ChatMessageProps {
  message: string
  sender: "user" | "ai"
  timestamp: Date
  isLoading?: boolean
}

export default function ChatMessage({ message, sender, timestamp, isLoading }: ChatMessageProps) {
  const isUser = sender === "user"

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-5 h-5 text-blue-500" />
        </div>
      )}

      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-slate-50 text-slate-900 border border-slate-200 rounded-bl-none"
          }`}
        >
          {isLoading ? (
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed">{message}</p>
          )}
        </div>
        <span className="text-xs text-slate-600 mt-1">
          {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  )
}
