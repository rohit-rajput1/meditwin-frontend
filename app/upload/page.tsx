"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import FileUpload from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface AnalysisResult {
  summary: string
  keyFindings: string[]
  recommendations: string[]
  riskLevel: "low" | "medium" | "high"
}

export default function UploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [reportType, setReportType] = useState<string>("medical-prescription")

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    setIsAnalyzing(true)

    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Different mock results based on report type
      const mockResult: AnalysisResult = reportType === "blood-test-report" 
        ? {
            summary:
              "Blood test results show normal levels of hemoglobin and white blood cells. Cholesterol levels are slightly elevated.",
            keyFindings: [
              "Hemoglobin: 14.5 g/dL (Normal)",
              "White Blood Cells: 7.2 K/uL (Normal)",
              "Total Cholesterol: 220 mg/dL (Slightly Elevated)",
              "Blood Pressure: 128/82 mmHg (Elevated)",
            ],
            recommendations: [
              "Maintain regular exercise routine",
              "Reduce sodium intake",
              "Schedule follow-up appointment in 3 months",
              "Consider dietary changes to lower cholesterol",
            ],
            riskLevel: "low",
          }
        : {
            summary:
              "Prescription analysis complete. Treatment plan for Upper Respiratory Infection with 5 medications prescribed for 7-day course.",
            keyFindings: [
              "Diagnosis: Upper Respiratory Infection",
              "Treatment Duration: 7 days",
              "5 Medications Prescribed",
              "Follow-up Required: October 25, 2025",
            ],
            recommendations: [
              "Take all medications as prescribed",
              "Drink plenty of fluids while on antibiotics",
              "Avoid alcohol during treatment",
              "Schedule follow-up appointment on time",
            ],
            riskLevel: "low",
          }

      setAnalysisResult(mockResult)
      setShowPreview(true)

      toast({
        title: "Analysis Complete",
        description: "Your medical report has been analyzed successfully",
      })
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSaveAndContinue = () => {
    // Save the report type to localStorage so dashboard knows which view to show
    if (reportType === "medical-prescription") {
      localStorage.setItem('lastReportType', 'prescription')
    } else if (reportType === "blood-test-report") {
      localStorage.setItem('lastReportType', 'blood-test')
    }
    
    toast({
      title: "Report Saved",
      description: "Your medical report has been saved to your dashboard",
    })
    
    // Navigate to dashboard with reportType parameter
    router.push(`/dashboard?reportType=${reportType === "medical-prescription" ? "prescription" : "blood-test"}`)
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Upload Health Report</h1>
          <p className="text-lg text-slate-600 whitespace-nowrap">
            Upload your health documents (PDF or image) to get instant AI-powered analysis and insights.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              {/* Report Type Dropdown */}
              <div className="mb-6">
                <label htmlFor="reportType" className="block text-base font-semibold text-slate-900 mb-2">
                  Select Report Type
                </label>
                <div className="relative">
                  <select
                    id="reportType"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-4 py-2 text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white text-slate-900 appearance-none pr-10 cursor-pointer"
                    style={{ colorScheme: 'light' }}
                  >
                    <option value="medical-prescription">Medical Prescription</option>
                    <option value="blood-test-report">Blood Test Report</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <FileUpload onFileSelect={handleFileSelect} isLoading={isAnalyzing} />
            </div>
          </div>

          {/* Info Sidebar */}
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

        {/* Analysis Results */}
        {showPreview && analysisResult && (
          <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Analysis Results</h2>
              <div
                className={`px-4 py-2 rounded-lg font-semibold capitalize ${getRiskColor(analysisResult.riskLevel)}`}
              >
                {analysisResult.riskLevel} Risk
              </div>
            </div>

            {/* Summary */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Summary</h3>
              <p className="text-slate-600 leading-relaxed">{analysisResult.summary}</p>
            </div>

            {/* Key Findings */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Findings</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {analysisResult.keyFindings.map((finding, index) => (
                  <div key={index} className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-600">{finding}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
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

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-slate-200">
              <Button onClick={handleSaveAndContinue} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
                Save & Go to Dashboard
              </Button>
              <Button
                onClick={() => {
                  setShowPreview(false)
                  setAnalysisResult(null)
                  setSelectedFile(null)
                }}
                variant="outline"
                className="flex-1"
              >
                Upload Another
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-lg font-semibold text-slate-900 mb-2">Analyzing Your Report</p>
            <p className="text-slate-600">Our AI is processing your medical report. This may take a moment...</p>
          </div>
        )}
      </div>
    </div>
  )
}