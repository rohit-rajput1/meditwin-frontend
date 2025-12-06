import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get session cookie from request
    const sessionCookie = request.cookies.get("session_id")?.value

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    // Call backend /auth/me endpoint with session cookie
    const response = await fetch(`${apiUrl}/auth/me`, {
      method: "GET",
      headers: {
        Cookie: `session_id=${sessionCookie}`,
      },
      credentials: "include",
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: "Session expired or invalid" },
        { status: 401 }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}