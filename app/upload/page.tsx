"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import FileUpload from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface AnalysisResult {
  summary: string
  key_findings: Record<string, any>
  recommendations: string[]
  insights?: string
  medications?: any[]
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const REPORT_TYPE_MAP: Record<string, string> = {
  "medical-prescription": "29574bad-7899-4317-b6f1-8cd26e2e4e3e",
  "blood-test-report": "605070dd-30a3-4b8c-b931-2705e39411d0",
}

export default function UploadPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [reportType, setReportType] = useState<string>("medical-prescription")
  const [fileId, setFileId] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "processing" | "ready">("idle")
  const [isNavigating, setIsNavigating] = useState(false)

  // Poll for processing status
  useEffect(() => {
    if (!fileId || uploadStatus !== "processing") return

    let pollCount = 0
    const maxPolls = 90

    const checkStatus = async () => {
      try {
        pollCount++
        
        const response = await fetch(`${BACKEND_URL}/upload/status/${fileId}`, {
          method: "GET",
          credentials: "include",
        })

        if (!response.ok) {
          console.error("Status check failed:", response.status)
          return
        }

        const data = await response.json()
        console.log("Status check:", data)

        if (data.status === "completed") {
          setUploadStatus("ready")
          toast({
            title: "Processing Complete",
            description: "Your report is ready for analysis. Click 'Analyze Report' to continue.",
          })
        } else if (data.status === "failed") {
          setUploadStatus("idle")
          toast({
            title: "Processing Failed",
            description: data.error || "Failed to process the report",
            variant: "destructive",
          })
        } else if (pollCount >= maxPolls) {
          setUploadStatus("idle")
          toast({
            title: "Processing Timeout",
            description: "The report is taking longer than expected. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error checking status:", error)
      }
    }

    checkStatus()
    const interval = setInterval(checkStatus, 2000)
    
    return () => clearInterval(interval)
  }, [fileId, uploadStatus, toast])

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    setUploadStatus("uploading")

    try {
      const reportTypeId = REPORT_TYPE_MAP[reportType]
      if (!reportTypeId) {
        throw new Error("Invalid report type selected")
      }

      const formData = new FormData()
      formData.append("file", file)
      formData.append("reportTypeId", reportTypeId)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      const uploadData = await uploadResponse.json()

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "Upload failed")
      }

      if (!uploadData.file_id) {
        throw new Error("No file_id received from backend")
      }

      console.log("Upload successful, file_id:", uploadData.file_id)
      setFileId(uploadData.file_id)
      setUploadStatus("processing")

      toast({
        title: "Upload Successful",
        description: "Your report is being processed. This may take a moment...",
      })
    } catch (error) {
      console.error("Upload error:", error)
      setUploadStatus("idle")
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload the report",
        variant: "destructive",
      })
    }
  }

  const handleAnalyze = async () => {
    if (!fileId) {
      toast({
        title: "Error",
        description: "No file ID found",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    try {
      const response = await fetch(`${BACKEND_URL}/upload/analyze/${fileId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Analysis failed" }))
        throw new Error(errorData.detail || "Analysis failed")
      }

      const data = await response.json()
      console.log("Analysis result:", data)
      setAnalysisResult(data)
      setShowPreview(true)

      toast({
        title: "Analysis Complete",
        description: "Your medical report has been analyzed successfully",
      })
    } catch (error) {
      console.error("Analysis error:", error)
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze the report",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSaveAndContinue = () => {
    if (!fileId) {
      toast({
        title: "Error",
        description: "No file ID found",
        variant: "destructive",
      })
      return
    }

    setIsNavigating(true)
    
    toast({
      title: "Redirecting",
      description: "Taking you to your personalized dashboard...",
    })

    // Navigate to dashboard with file_id parameter and createNew flag
    // createNew=true tells dashboard to skip GET and directly create
    router.push(`/dashboard?file_id=${fileId}&createNew=true`)
  }

  const getRiskLevel = (keyFindings: Record<string, any>): "low" | "medium" | "high" => {
    const findingsText = JSON.stringify(keyFindings).toLowerCase()
    if (
      findingsText.includes("high") ||
      findingsText.includes("critical") ||
      findingsText.includes("severe")
    ) {
      return "high"
    } else if (
      findingsText.includes("elevated") ||
      findingsText.includes("moderate") ||
      findingsText.includes("abnormal")
    ) {
      return "medium"
    }
    return "low"
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600 bg-green-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "high":
        return "text-red-600 bg-red-50"
      default:
        return "text-slate-600 bg-slate-50"
    }
  }

  const formatKeyFindings = (keyFindings: Record<string, any>): string[] => {
    return Object.entries(keyFindings).map(([key, value]) => {
      if (typeof value === "object") {
        return `${key}: ${JSON.stringify(value)}`
      }
      return `${key}: ${value}`
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Upload Health Report</h1>
          <p className="text-lg text-slate-600">
            Upload your health documents (PDF or image) to get instant AI-powered analysis and
            insights.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="mb-6">
                <label htmlFor="reportType" className="block text-base font-semibold text-slate-900 mb-2">
                  Select Report Type
                </label>
                <div className="relative">
                  <select
                    id="reportType"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    disabled={uploadStatus !== "idle"}
                    className="w-full px-4 py-2 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white text-slate-900 appearance-none pr-10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ colorScheme: "light" }}
                  >
                    <option value="medical-prescription">Medical Prescription</option>
                    <option value="blood-test-report">Blood Test Report</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <FileUpload
                onFileSelect={handleFileSelect}
                isLoading={uploadStatus === "uploading" || uploadStatus === "processing"}
              />

              {uploadStatus === "ready" && !showPreview && (
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Report"
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4">Supported Formats</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  PDF Documents
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  JPEG Images
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  PNG Images
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Tips for Best Results</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Ensure document is clear and readable</li>
                <li>• Maximum file size: 10MB</li>
                <li>• Use good lighting for images</li>
                <li>• Include all relevant pages</li>
              </ul>
            </div>
          </div>
        </div>

        {showPreview && analysisResult && (
          <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Analysis Results</h2>
              <div
                className={`px-4 py-2 rounded-lg font-semibold capitalize ${getRiskColor(
                  getRiskLevel(analysisResult.key_findings)
                )}`}
              >
                {getRiskLevel(analysisResult.key_findings)} Risk
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Summary</h3>
              <p className="text-slate-600 leading-relaxed">{analysisResult.summary}</p>
            </div>

            {analysisResult.insights && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Insights</h3>
                <p className="text-slate-600 leading-relaxed">{analysisResult.insights}</p>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Findings</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {formatKeyFindings(analysisResult.key_findings).map((finding, index) => (
                  <div key={index} className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-600">{finding}</p>
                  </div>
                ))}
              </div>
            </div>

            {analysisResult.medications && analysisResult.medications.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Medications</h3>
                <div className="space-y-3">
                  {analysisResult.medications.map((med: any, index: number) => (
                    <div key={index} className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-900 font-medium">{med.name || med}</p>
                      {typeof med === "object" && med.dosage && (
                        <p className="text-sm text-slate-600 mt-1">Dosage: {med.dosage}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recommendations</h3>
              <div className="space-y-3">
                {analysisResult.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                    <AlertCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-600">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-200">
              <Button
                onClick={handleSaveAndContinue}
                disabled={isNavigating}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isNavigating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading Dashboard...
                  </>
                ) : (
                  "Save & Go to Dashboard"
                )}
              </Button>
              <Button
                onClick={() => {
                  setShowPreview(false)
                  setAnalysisResult(null)
                  setSelectedFile(null)
                  setFileId(null)
                  setUploadStatus("idle")
                }}
                variant="outline"
                className="flex-1"
                disabled={isNavigating}
              >
                Upload Another
              </Button>
            </div>
          </div>
        )}

        {isAnalyzing && !showPreview && uploadStatus === "ready" && (
          <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-lg font-semibold text-slate-900 mb-2">Analyzing Your Report</p>
            <p className="text-slate-600">
              Our AI is analyzing your medical report. This may take 30-60 seconds...
            </p>
          </div>
        )}

        {(uploadStatus === "uploading" || uploadStatus === "processing") && !showPreview && (
          <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-lg font-semibold text-slate-900 mb-2">
              {uploadStatus === "uploading" ? "Uploading Your Report" : "Processing Your Report"}
            </p>
            <p className="text-slate-600">
              {uploadStatus === "uploading"
                ? "Uploading your document to the server..."
                : "Extracting text from your document. This may take a moment..."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}