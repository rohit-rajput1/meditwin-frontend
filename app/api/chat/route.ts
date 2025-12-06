import { type NextRequest, NextResponse } from "next/server"

// Create new chat
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, file_id, chat_id, user_query, chat_name, search } = body

    // Validate action is provided
    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      )
    }

    // Get session cookie from request
    const sessionCookie = request.cookies.get("session_id")?.value

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    // Handle different actions
    switch (action) {
      case "create": {
        // Create new chat
        if (!file_id) {
          return NextResponse.json(
            { error: "file_id is required to create a chat" },
            { status: 400 }
          )
        }

        const response = await fetch(`${apiUrl}/chat/create-chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionCookie}`,
          },
          credentials: "include",
          body: JSON.stringify({ file_id }),
        })

        const data = await response.json()

        if (!response.ok) {
          return NextResponse.json(
            { error: data.detail || "Failed to create chat" },
            { status: response.status }
          )
        }

        return NextResponse.json(data, { status: 200 })
      }

      case "continue": {
        // Continue existing chat
        if (!chat_id || !user_query) {
          return NextResponse.json(
            { error: "chat_id and user_query are required" },
            { status: 400 }
          )
        }

        const response = await fetch(`${apiUrl}/chat/continue-chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionCookie}`,
          },
          credentials: "include",
          body: JSON.stringify({ chat_id, user_query }),
        })

        const data = await response.json()

        if (!response.ok) {
          return NextResponse.json(
            { error: data.detail || "Failed to send message" },
            { status: response.status }
          )
        }

        return NextResponse.json(data, { status: 200 })
      }

      case "history": {
        // Get chat history
        if (!chat_id) {
          return NextResponse.json(
            { error: "chat_id is required" },
            { status: 400 }
          )
        }

        const response = await fetch(`${apiUrl}/chat/chat-history/${chat_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionCookie}`,
          },
          credentials: "include",
        })

        const data = await response.json()

        if (!response.ok) {
          return NextResponse.json(
            { error: data.detail || "Failed to get chat history" },
            { status: response.status }
          )
        }

        return NextResponse.json(data, { status: 200 })
      }

      case "recent": {
        // Get recent chats
        const searchParam = search ? `?search=${encodeURIComponent(search)}` : ""
        
        const response = await fetch(`${apiUrl}/chat/recent-chat${searchParam}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionCookie}`,
          },
          credentials: "include",
          body: JSON.stringify({}), // Send empty body for POST request
        })

        const data = await response.json()

        if (!response.ok) {
          return NextResponse.json(
            { error: data.detail || "Failed to get recent chats" },
            { status: response.status }
          )
        }

        return NextResponse.json(data, { status: 200 })
      }

      case "rename": {
        // Rename chat
        if (!chat_id || !chat_name) {
          return NextResponse.json(
            { error: "chat_id and chat_name are required" },
            { status: 400 }
          )
        }

        const response = await fetch(`${apiUrl}/chat/rename-chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionCookie}`,
          },
          credentials: "include",
          body: JSON.stringify({ chat_id, chat_name }),
        })

        const data = await response.json()

        if (!response.ok) {
          return NextResponse.json(
            { error: data.detail || "Failed to rename chat" },
            { status: response.status }
          )
        }

        return NextResponse.json(data, { status: 200 })
      }

      case "delete": {
        // Delete chat
        if (!chat_id) {
          return NextResponse.json(
            { error: "chat_id is required" },
            { status: 400 }
          )
        }

        const response = await fetch(`${apiUrl}/chat/delete-chat`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session_id=${sessionCookie}`,
          },
          credentials: "include",
          body: JSON.stringify({ chat_id }),
        })

        const data = await response.json()

        if (!response.ok) {
          return NextResponse.json(
            { error: data.detail || "Failed to delete chat" },
            { status: response.status }
          )
        }

        return NextResponse.json(data, { status: 200 })
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}