import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    console.log("Attempting login for:", email)

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: email,
          password: password,
        }),
      }
    )

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      console.log("Login failed:", data)
      return NextResponse.json(
        { error: data.detail || "Invalid credentials" },
        { status: backendResponse.status }
      )
    }

    console.log("Login successful, setting cookie")

    const response = NextResponse.json(data, { status: 200 })
    
    // Store access token in HTTP-only cookie
    if (data.access_token) {
      response.cookies.set({
        name: "access_token",
        value: data.access_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })
      console.log("Access token cookie set")
    }

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}