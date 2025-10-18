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
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <MessageCircle className="w-4 h-4 text-indigo-600" />
        </div>
      )}

      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${
            isUser
              ? "bg-indigo-600 text-white rounded-br-sm"
              : "bg-slate-100 text-slate-900 rounded-bl-sm"
          }`}
        >
          {isLoading ? (
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed">{message}</p>
          )}
        </div>
        <span className="text-xs text-slate-500 mt-1">
          {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  )
}