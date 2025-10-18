"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import HealthMetricCard, { PrescriptionSummaryCard } from "@/components/health-metric-card"
import { BloodPressureChart, CholesterolChart, WeightChart } from "@/components/health-charts"
import { Upload, MessageSquare, FileText, Heart, Pill, AlertTriangle, Activity } from "lucide-react"

interface RecentReport {
  id: string
  name: string
  date: string
  type: string
  status: "normal" | "warning" | "critical"
}

// Mock prescription data
const prescriptionData = {
  diagnosis: "Upper Respiratory Infection",
  duration: "7 days",
  medicineCount: 5,
  followUpDate: "2025-10-25",
  prescribedDate: "2025-10-18",
  doctorName: "Dr. Sarah Johnson",
  medicines: [
    {
      name: "Paracetamol",
      dosage: "500mg",
      purpose: "Fever and pain relief",
      frequency: { morning: true, afternoon: false, night: true },
      sideEffects: "Mild nausea, dizziness",
      interactions: "None",
      duration: "7 days"
    },
    {
      name: "Amoxicillin",
      dosage: "500mg",
      purpose: "Bacterial infection",
      frequency: { morning: true, afternoon: true, night: true },
      sideEffects: "Diarrhea, stomach upset",
      interactions: "Avoid alcohol",
      duration: "7 days"
    },
    {
      name: "Vitamin D",
      dosage: "1000 IU",
      purpose: "Immunity boost",
      frequency: { morning: false, afternoon: false, night: true },
      sideEffects: "Rare: constipation",
      interactions: "None",
      duration: "30 days"
    },
    {
      name: "Cetirizine",
      dosage: "10mg",
      purpose: "Allergy relief",
      frequency: { morning: false, afternoon: false, night: true },
      sideEffects: "Drowsiness",
      interactions: "Avoid with sedatives",
      duration: "5 days"
    },
    {
      name: "Azithromycin",
      dosage: "250mg",
      purpose: "Respiratory infection",
      frequency: { morning: true, afternoon: false, night: false },
      sideEffects: "Stomach pain, nausea",
      interactions: "Take on empty stomach",
      duration: "5 days"
    }
  ],
  recommendations: [
    "Drink at least 8-10 glasses of water daily while on antibiotics",
    "Avoid heavy meals at night; eat light dinner",
    "Take probiotics to prevent antibiotic-related stomach issues",
    "Rest adequately and avoid strenuous activities"
  ]
}

// Calculate adherence score
const adherenceDataValues = [
  { day: "Day 1", taken: 4, missed: 1, total: 5 },
  { day: "Day 2", taken: 5, missed: 0, total: 5 },
  { day: "Day 3", taken: 4, missed: 1, total: 5 },
  { day: "Day 4", taken: 5, missed: 0, total: 5 },
  { day: "Day 5", taken: 5, missed: 0, total: 5 },
  { day: "Day 6", taken: 4, missed: 1, total: 5 },
  { day: "Day 7", taken: 5, missed: 0, total: 5 }
]

const totalDoses = adherenceDataValues.reduce((sum, day) => sum + day.total, 0)
const takenDoses = adherenceDataValues.reduce((sum, day) => sum + day.taken, 0)
const adherenceScore = Math.round((takenDoses / totalDoses) * 100)

// Dashboard Toggle Component - Shows only the current active dashboard
function DashboardBadge({ reportType }: { reportType: string }) {
  return (
    <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
      <div className="flex items-center gap-2 px-4 py-2 rounded-md font-medium bg-white text-blue-600 shadow-sm">
        {reportType === "blood-test" ? (
          <>
            <Activity size={18} />
            <span>Health Dashboard</span>
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
  // CRITICAL: This determines which dashboard to show
  // In real implementation, this would come from:
  // 1. URL params: const searchParams = useSearchParams(); const reportType = searchParams.get('type')
  // 2. Or from uploaded report data stored in state/context
  // 3. Or passed as a prop from parent component
  
  const [reportType, setReportType] = useState<"blood-test" | "prescription">("blood-test")
  
  // Check if there's a reportType in URL
  useEffect(() => {
    // Check URL params
    const params = new URLSearchParams(window.location.search)
    const urlType = params.get('reportType')
    
    if (urlType === 'prescription') {
      setReportType('prescription')
    } else if (urlType === 'blood-test') {
      setReportType('blood-test')
    }
  }, [])
  
  const [recentReports] = useState<RecentReport[]>([
    {
      id: "1",
      name: "Blood Test Results",
      date: "2025-10-15",
      type: "Lab Work",
      status: "normal",
    },
    {
      id: "2",
      name: "Chest X-Ray",
      date: "2025-10-10",
      type: "Imaging",
      status: "normal",
    },
    {
      id: "3",
      name: "ECG Report",
      date: "2025-10-05",
      type: "Cardiac",
      status: "warning",
    },
  ])

  const statusBadgeColors = {
    normal: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    critical: "bg-red-100 text-red-800",
  }

  const isFollowUpOverdue = new Date(prescriptionData.followUpDate) < new Date()
  const daysUntilFollowUp = Math.ceil((new Date(prescriptionData.followUpDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  if (reportType === "blood-test") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Health Dashboard</h1>
              <p className="text-slate-600 mt-2">Monitor your health metrics and track your progress</p>
            </div>
            <DashboardBadge reportType={reportType} />
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Link href="/upload">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white gap-2 h-12">
                <Upload size={18} />
                Upload Report
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" className="w-full gap-2 h-12 bg-transparent">
                <MessageSquare size={18} />
                Chat with AI Doctor
              </Button>
            </Link>
          </div>

          {/* Health Metrics Overview */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <HealthMetricCard
              title="Blood Pressure"
              value="120"
              unit="mmHg"
              status="normal"
              trend="down"
              trendValue="-2 mmHg"
            />
            <HealthMetricCard title="Heart Rate" value="72" unit="bpm" status="normal" trend="down" trendValue="-3 bpm" />
            <HealthMetricCard
              title="Cholesterol"
              value="208"
              unit="mg/dL"
              status="warning"
              trend="down"
              trendValue="-4 mg/dL"
            />
            <HealthMetricCard title="Weight" value="73.8" unit="kg" status="normal" trend="down" trendValue="-1.7 kg" />
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Blood Pressure Chart */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Blood Pressure Trend</CardTitle>
                <CardDescription>Weekly blood pressure readings</CardDescription>
              </CardHeader>
              <CardContent>
                <BloodPressureChart />
              </CardContent>
            </Card>

            {/* Weight Chart */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Weight Progress</CardTitle>
                <CardDescription>6-week weight tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <WeightChart />
              </CardContent>
            </Card>
          </div>

          {/* Cholesterol Chart */}
          <div className="mb-8">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Cholesterol Levels</CardTitle>
                <CardDescription>HDL and LDL cholesterol trends over 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <CholesterolChart />
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900">Recent Reports</CardTitle>
                  <CardDescription>Your uploaded medical reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-500/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{report.name}</p>
                            <p className="text-sm text-slate-600">{report.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-slate-600">{report.date}</span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadgeColors[report.status]}`}
                          >
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Health Tips */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-blue-500" />
                  Health Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="font-medium text-slate-900 text-sm mb-1">Stay Hydrated</p>
                    <p className="text-xs text-slate-600">Drink at least 8 glasses of water daily</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="font-medium text-slate-900 text-sm mb-1">Manage Stress</p>
                    <p className="text-xs text-slate-600">Practice meditation or yoga</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Render prescription dashboard
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Prescription Dashboard</h1>
            <p className="text-slate-600 mt-2">Track your medication and treatment progress</p>
          </div>
          <DashboardBadge reportType={reportType} />
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <PrescriptionSummaryCard
            title="Diagnosis"
            value={prescriptionData.diagnosis}
            subtitle={`Prescribed by ${prescriptionData.doctorName}`}
            icon="diagnosis"
          />
          <PrescriptionSummaryCard
            title="Treatment Duration"
            value={prescriptionData.duration}
            subtitle={`Started ${prescriptionData.prescribedDate}`}
            icon="duration"
          />
          <PrescriptionSummaryCard
            title="Medications"
            value={`${prescriptionData.medicineCount} medicines`}
            subtitle="Active prescriptions"
            icon="medicines"
          />
          <PrescriptionSummaryCard
            title="Follow-up"
            value={prescriptionData.followUpDate}
            subtitle={isFollowUpOverdue ? 'Overdue!' : `In ${daysUntilFollowUp} days`}
            icon="followup"
            isOverdue={isFollowUpOverdue}
          />
        </div>

        {/* Medicine Details and Recommendations */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Medicine Details */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Medicine Details & Insights</CardTitle>
                <CardDescription>Important information about your medications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prescriptionData.medicines.map((med, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-slate-900">{med.name}</h4>
                          <p className="text-sm text-slate-600">{med.dosage} • {med.duration}</p>
                        </div>
                        {med.interactions !== "None" && (
                          <AlertTriangle className="w-5 h-5 text-amber-500" />
                        )}
                      </div>
                      <div className="grid md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="font-medium text-slate-700 mb-1">Purpose</p>
                          <p className="text-slate-600">{med.purpose}</p>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700 mb-1">Side Effects</p>
                          <p className="text-slate-600">{med.sideEffects}</p>
                        </div>
                        <div>
                          <p className="font-medium text-slate-700 mb-1">Interactions</p>
                          <p className={med.interactions !== "None" ? "text-amber-600 font-medium" : "text-slate-600"}>
                            {med.interactions}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Health Recommendations */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">Doctor's Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prescriptionData.recommendations.map((rec, idx) => (
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
        </div>


      </div>
    </div>
  )
}