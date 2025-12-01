import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const reportTypeId = formData.get("reportTypeId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!reportTypeId) {
      return NextResponse.json({ error: "Report type not specified" }, { status: 400 })
    }

    // Create FormData for backend
    const backendFormData = new FormData()
    backendFormData.append("report_file", file)
    backendFormData.append("report_type_id", reportTypeId)

    const backendUrl = `${BACKEND_URL}/upload/upload-file`
    const cookieHeader = request.headers.get("cookie")

    const response = await fetch(backendUrl, {
      method: "POST",
      body: backendFormData,
      headers: {
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    })

    if (!response.ok) {
      const contentType = response.headers.get("content-type")
      let errorData
      try {
        if (contentType?.includes("application/json")) {
          errorData = await response.json()
        } else {
          const text = await response.text()
          errorData = { detail: text }
        }
      } catch {
        errorData = { detail: "Upload failed" }
      }

      return NextResponse.json(
        { error: errorData.detail || "Failed to upload file" },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(
      {
        success: true,
        file_id: data.file_id,
        status: data.status,
        message: data.message,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 }
    )
  }
}