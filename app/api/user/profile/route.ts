// app/api/user/profile/route.ts
import { type NextRequest, NextResponse } from "next/server"

// Since you're using session-based authentication with FastAPI backend,
// these Next.js API routes are not needed.
// The frontend communicates directly with FastAPI using credentials: 'include'
// to send session cookies automatically.

// You can safely DELETE this entire file, or keep it for reference.

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      message: "This endpoint is deprecated. The frontend communicates directly with the FastAPI backend using session-based authentication.",
      note: "Session cookies are automatically sent with credentials: 'include' option"
    },
    { status: 410 }
  )
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { 
      message: "This endpoint is deprecated. Use POST /auth/profile-info on the FastAPI backend.",
      note: "Session cookies are automatically sent with credentials: 'include' option"
    },
    { status: 410 }
  )
}