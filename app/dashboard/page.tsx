"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  PrescriptionMetricCard, 
  BloodTestMetricCard,
  MedicineCard,
  SafetyInformationCard,
  BiomarkerCard
} from "@/components/health-metric-card"
import { 
  CholesterolBreakdownChart, 
  CBCTrendChart,
  BiomarkerChart 
} from "@/components/health-charts"
import { 
  Upload, 
  MessageSquare, 
  Activity, 
  Pill, 
  AlertCircle,
  Loader2,
  TrendingUp,
  Heart
} from "lucide-react"

interface DashboardData {
  dashboard_id: string
  dashboard_type: "prescription" | "blood_test"
  topBar: Record<string, any>
  middleSection: Record<string, any>
  recommendations: string[]
  criticalInsights: string[]
}

function DashboardBadge({ dashboardType }: { dashboardType: string }) {
  return (
    <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
      <div className="flex items-center gap-2 px-4 py-2 rounded-md font-medium bg-white text-blue-600 shadow-sm">
        {dashboardType === "blood_test" ? (
          <>
            <Activity size={18} />
            <span>Blood Test Dashboard</span>
          </>
        ) : (
          <>
            <Pill size={18} />
            <span>Prescription Dashboard</span>
          </>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const fileId = searchParams.get("file_id")
  const createNew = searchParams.get("createNew") === "true"
  
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!fileId) {
      setError("No file ID provided")
      setLoading(false)
      return
    }

    async function fetchDashboard() {
      try {
        setLoading(true)
        setError(null)
        
        console.log("Loading dashboard for file_id:", fileId, "createNew:", createNew)
        
        // If createNew flag is true (coming from upload), skip GET and directly create
        if (createNew) {
          console.log("Creating new dashboard (skipping GET check)...")
          
          const createResponse = await fetch("/api/health", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file_id: fileId }),
          })
          
          if (!createResponse.ok) {
            const errorData = await createResponse.json().catch(() => ({ error: "Unknown error" }))
            throw new Error(errorData.error || `Failed to create dashboard (${createResponse.status})`)
          }
          
          const data = await createResponse.json()
          console.log("Dashboard created successfully:", data)
          setDashboardData(data)
          return
        }
        
        // Otherwise, try to GET existing dashboard first
        console.log("Fetching existing dashboard...")
        const getResponse = await fetch(`/api/health?file_id=${fileId}`)
        
        if (getResponse.ok) {
          const data = await getResponse.json()
          console.log("Dashboard found:", data)
          setDashboardData(data)
          return
        }
        
        // If GET fails with 404, create new dashboard
        if (getResponse.status === 404) {
          console.log("Dashboard not found, creating new one...")
          
          const createResponse = await fetch("/api/health", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ file_id: fileId }),
          })
          
          if (!createResponse.ok) {
            const errorData = await createResponse.json().catch(() => ({ error: "Unknown error" }))
            throw new Error(errorData.error || `Failed to create dashboard (${createResponse.status})`)
          }
          
          const data = await createResponse.json()
          console.log("Dashboard created successfully:", data)
          setDashboardData(data)
          return
        }
        
        // If it's some other error
        const errorData = await getResponse.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `Failed to load dashboard (${getResponse.status})`)
        
      } catch (err) {
        console.error("Dashboard error:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to load dashboard"
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [fileId, createNew])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle size={24} />
              Error Loading Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">{error || "Failed to load dashboard data"}</p>
            <Link href="/upload">
              <Button className="w-full">Upload New Report</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render Blood Test Dashboard
  if (dashboardData.dashboard_type === "blood_test") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Blood Test Dashboard</h1>
              <p className="text-slate-600 mt-2">Comprehensive analysis of your blood test results</p>
            </div>
            <DashboardBadge dashboardType={dashboardData.dashboard_type} />
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Link href="/upload">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white gap-2 h-12">
                <Upload size={18} />
                Upload New Report
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" className="w-full gap-2 h-12 bg-white hover:bg-slate-50">
                <MessageSquare size={18} />
                Chat with AI Doctor
              </Button>
            </Link>
          </div>

          {/* Top Bar Metrics */}
          {dashboardData.topBar && Object.keys(dashboardData.topBar).length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {Object.entries(dashboardData.topBar).map(([key, value]) => (
                <BloodTestMetricCard key={key} title={key} value={String(value)} />
              ))}
            </div>
          )}

          {/* Biomarker Chart */}
          {dashboardData.middleSection?.biomarkerChart && 
           Array.isArray(dashboardData.middleSection.biomarkerChart) &&
           dashboardData.middleSection.biomarkerChart.length > 0 && (
            <div className="mb-8">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900">Biomarker Analysis</CardTitle>
                  <CardDescription>Current test values vs reference ranges</CardDescription>
                </CardHeader>
                <CardContent>
                  <BiomarkerChart data={dashboardData.middleSection.biomarkerChart} />
                </CardContent>
              </Card>
            </div>
          )}

          {/* CBC Trend Chart and Cholesterol - Side by Side */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* CBC Trend Chart */}
            {dashboardData.middleSection?.cbcTrendChart && 
             !dashboardData.middleSection.cbcTrendChart.note && (
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900">CBC Trends</CardTitle>
                  <CardDescription>Complete Blood Count over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <CBCTrendChart data={dashboardData.middleSection.cbcTrendChart} />
                </CardContent>
              </Card>
            )}

            {/* Cholesterol Breakdown */}
            {dashboardData.middleSection?.cholesterolBreakdownChart && 
             !dashboardData.middleSection.cholesterolBreakdownChart.note && (
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900">Cholesterol Breakdown</CardTitle>
                  <CardDescription>Detailed lipid profile analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <CholesterolBreakdownChart 
                    data={dashboardData.middleSection.cholesterolBreakdownChart} 
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Biomarker Details */}
          {dashboardData.middleSection?.biomarkerChart && 
           Array.isArray(dashboardData.middleSection.biomarkerChart) &&
           dashboardData.middleSection.biomarkerChart.length > 0 && (
            <div className="mb-8">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900">Detailed Biomarker Results</CardTitle>
                  <CardDescription>Individual test parameters and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {dashboardData.middleSection.biomarkerChart.map((biomarker: any, idx: number) => (
                      <BiomarkerCard key={idx} biomarker={biomarker} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recommendations and Insights */}
          {((dashboardData.criticalInsights && dashboardData.criticalInsights.length > 0) ||
            (dashboardData.recommendations && dashboardData.recommendations.length > 0)) && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Critical Insights */}
              {dashboardData.criticalInsights && dashboardData.criticalInsights.length > 0 && (
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      Critical Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dashboardData.criticalInsights.map((insight, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <p className="text-sm text-slate-800">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              {dashboardData.recommendations && dashboardData.recommendations.length > 0 && (
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-900 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-blue-500" />
                      Health Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dashboardData.recommendations.map((rec, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg border ${
                            idx % 2 === 0
                              ? 'bg-emerald-50 border-emerald-200'
                              : 'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <p className="text-sm text-slate-800">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render Prescription Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Prescription Dashboard</h1>
            <p className="text-slate-600 mt-2">Complete medication and treatment overview</p>
          </div>
          <DashboardBadge dashboardType={dashboardData.dashboard_type} />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link href="/upload">
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white gap-2 h-12">
              <Upload size={18} />
              Upload New Report
            </Button>
          </Link>
          <Link href="/chat">
            <Button variant="outline" className="w-full gap-2 h-12 bg-transparent">
              <MessageSquare size={18} />
              Chat with AI Doctor
            </Button>
          </Link>
        </div>

        {/* Top Bar Metrics */}
        {dashboardData.topBar && Object.keys(dashboardData.topBar).length > 0 && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {Object.entries(dashboardData.topBar).map(([key, value]) => (
              <PrescriptionMetricCard key={key} title={key} value={String(value)} />
            ))}
          </div>
        )}

        {/* Medicine Details and Safety Information */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Medicine Details */}
          <div className="lg:col-span-2">
            {dashboardData.middleSection?.medicines && 
             Array.isArray(dashboardData.middleSection.medicines) &&
             dashboardData.middleSection.medicines.length > 0 && (
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900">Prescribed Medications</CardTitle>
                  <CardDescription>Complete medicine details and instructions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.middleSection.medicines.map((medicine: any, idx: number) => (
                      <MedicineCard key={idx} medicine={medicine} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Safety Information */}
          <div>
            {dashboardData.middleSection?.safetyInformation && (
              <SafetyInformationCard 
                safetyInfo={dashboardData.middleSection.safetyInformation} 
              />
            )}
          </div>
        </div>

        {/* Recommendations and Critical Insights */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Critical Insights */}
          {dashboardData.criticalInsights && dashboardData.criticalInsights.length > 0 && (
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  Critical Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.criticalInsights.map((insight, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-amber-50 rounded-lg border border-amber-200"
                    >
                      <p className="text-sm text-slate-800">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {dashboardData.recommendations && dashboardData.recommendations.length > 0 && (
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-blue-500" />
                  Doctor's Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border ${
                        idx % 2 === 0
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-emerald-50 border-emerald-200'
                      }`}
                    >
                      <p className="text-sm text-slate-800">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}