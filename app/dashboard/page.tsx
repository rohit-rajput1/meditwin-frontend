"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import HealthMetricCard from "@/components/health-metric-card"
import { BloodPressureChart, CholesterolChart, WeightChart } from "@/components/health-charts"
import { Upload, MessageSquare, Settings, FileText, Heart } from "lucide-react"

interface RecentReport {
  id: string
  name: string
  date: string
  type: string
  status: "normal" | "warning" | "critical"
}

export default function DashboardPage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Health Dashboard</h1>
            <p className="text-slate-600 mt-2">Monitor your health metrics and track your progress</p>
          </div>
          <Link href="/profile">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Settings size={18} />
              Settings
            </Button>
          </Link>
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
                  <p className="font-medium text-slate-900 text-sm mb-1">Exercise Regularly</p>
                  <p className="text-xs text-slate-600">Aim for 30 minutes of activity daily</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-medium text-slate-900 text-sm mb-1">Get Quality Sleep</p>
                  <p className="text-xs text-slate-600">Target 7-9 hours of sleep per night</p>
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
