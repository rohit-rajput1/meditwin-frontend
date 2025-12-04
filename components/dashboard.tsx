"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, FileText, Calendar, ArrowUpDown, Upload, MessageSquare, Activity, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Report {
  id: string
  name: string
  type: string
  date: string
  status: "completed" | "processing" | "pending"
  report_type: "blood_test" | "prescription"
}

export default function DashboardListPage() {
  const router = useRouter()
  
  // Sample data - in production, fetch from your backend
  const [reports] = useState<Report[]>([
    {
      id: "1",
      name: "Blood Test Results",
      type: "Laboratory",
      date: "2024-03-15",
      status: "completed",
      report_type: "blood_test"
    },
    {
      id: "2",
      name: "Prescription - Antibiotics",
      type: "Prescription",
      date: "2024-03-10",
      status: "completed",
      report_type: "prescription"
    },
    {
      id: "3",
      name: "Annual Health Checkup",
      type: "Laboratory",
      date: "2024-03-05",
      status: "completed",
      report_type: "blood_test"
    },
    {
      id: "4",
      name: "Lipid Profile",
      type: "Laboratory",
      date: "2024-02-28",
      status: "completed",
      report_type: "blood_test"
    },
    {
      id: "5",
      name: "Pain Management Prescription",
      type: "Prescription",
      date: "2024-02-20",
      status: "processing",
      report_type: "prescription"
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "name-asc" | "name-desc">("date-desc")

  // Filter and sort reports
  const filteredReports = useMemo(() => {
    let filtered = reports.filter((report) =>
      report.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Sort based on selected option
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        default:
          return 0
      }
    })

    return filtered
  }, [reports, searchQuery, sortBy])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200"
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const handleReportClick = (report: Report) => {
    // Navigate to dashboard with file_id
    router.push(`/dashboard?file_id=${report.id}`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">My Reports</h1>
          <p className="text-slate-600">View and manage your medical reports and dashboards</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/upload">
            <div className="card-hover bg-white p-6 rounded-xl border border-slate-200 cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Upload className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Upload New Report</h3>
                  <p className="text-sm text-slate-600">Add a new medical report for analysis</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/chat">
            <div className="card-hover bg-white p-6 rounded-xl border border-slate-200 cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <MessageSquare className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Chat with AI</h3>
                  <p className="text-sm text-slate-600">Ask questions about your reports</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <Input
                type="text"
                placeholder="Search reports by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort Filter */}
            <div className="w-full md:w-64">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <ArrowUpDown size={16} />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Date (Newest First)</SelectItem>
                  <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
                  <SelectItem value="name-asc">Name (A to Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z to A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Recent Reports</h2>
            <p className="text-sm text-slate-600 mt-1">
              {filteredReports.length} {filteredReports.length === 1 ? "report" : "reports"} found
            </p>
          </div>

          {filteredReports.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto text-slate-300 mb-4" size={48} />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No reports found</h3>
              <p className="text-slate-600 mb-6">
                {searchQuery ? "Try adjusting your search" : "Upload your first report to get started"}
              </p>
              <Link href="/upload">
                <Button>
                  <Upload size={18} className="mr-2" />
                  Upload Report
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => handleReportClick(report)}
                  className="p-6 hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                        {report.report_type === "blood_test" ? (
                          <Activity className="text-blue-600" size={24} />
                        ) : (
                          <Pill className="text-blue-600" size={24} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {report.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(report.date)}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span>{report.type}</span>
                          <span className="text-slate-400">•</span>
                          <span className="capitalize">
                            {report.report_type === "blood_test" ? "Blood Test" : "Prescription"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}