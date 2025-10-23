import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    
    if (!apiUrl) {
      console.error("NEXT_PUBLIC_API_URL is not defined")
      return NextResponse.json({ error: "Backend API URL not configured" }, { status: 500 })
    }

    console.log("Calling backend:", `${apiUrl}/auth/register`)

    const backendResponse = await fetch(`${apiUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_email: email,
        password: password,
      }),
    })

    // Check if response is JSON
    const contentType = backendResponse.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await backendResponse.text()
      console.error("Backend returned non-JSON response:", text)
      return NextResponse.json(
        { error: "Backend returned an invalid response. Please check if the backend is running." },
        { status: 500 }
      )
    }

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: data.detail || "Registration failed" },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json({ success: true, user: data }, { status: 201 })
  } catch (error: any) {
    console.error("Signup API error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}