import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// POST - Create a new dashboard from a report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { file_id } = body

    if (!file_id) {
      return NextResponse.json({ error: "file_id is required" }, { status: 400 })
    }

    const cookieHeader = request.headers.get("cookie")
    
    const response = await fetch(`${BACKEND_URL}/dashboard/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      body: JSON.stringify({ file_id }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Failed to create dashboard" }))
      return NextResponse.json(
        { error: errorData.detail || "Failed to create dashboard" },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(
      {
        success: true,
        dashboard_id: data.dashboard_id,
        dashboard_type: data.dashboard_type,
        user_id: data.user_id,
        report_id: data.report_id,
        created_at: data.created_at,
        topBar: data.topBar,
        middleSection: data.middleSection,
        recommendations: data.recommendations,
        criticalInsights: data.criticalInsights,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Dashboard creation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create dashboard" },
      { status: 500 }
    )
  }
}

// GET - Fetch existing dashboard by file_id
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const file_id = searchParams.get("file_id")

    if (!file_id) {
      return NextResponse.json({ error: "file_id is required" }, { status: 400 })
    }

    const cookieHeader = request.headers.get("cookie")
    
    const response = await fetch(`${BACKEND_URL}/dashboard/${file_id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Dashboard not found" }))
      return NextResponse.json(
        { error: errorData.detail || "Dashboard not found" },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      ...data
    })
  } catch (error) {
    console.error("Dashboard fetch error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch dashboard" },
      { status: 500 }
    )
  }
}