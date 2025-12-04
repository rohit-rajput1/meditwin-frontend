"use client"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts"

// Biomarker Chart - Shows current values vs reference ranges
interface BiomarkerChartProps {
  data: Array<{
    testName: string
    currentValue: number
    referenceMin: number
    referenceMax: number
    status: string
    unit: string
  }>
}

export function BiomarkerChart({ data }: BiomarkerChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-slate-500">
        No biomarker data available
      </div>
    )
  }

  // Transform data for the chart
  const chartData = data.map(item => ({
    name: item.testName,
    current: item.currentValue,
    min: item.referenceMin,
    max: item.referenceMax,
    status: item.status
  }))

  const getBarColor = (status: string) => {
    const lowerStatus = status.toLowerCase()
    if (lowerStatus === "low") return "#ead308ff" // yellow-500
    if (lowerStatus === "high") return "#f5550bff" // amber-500
    if (lowerStatus.includes("critical") || lowerStatus === "very low" || lowerStatus === "very high") {
      return "#ef4444" // red-500
    }
    return "#10b981" // emerald-500 (normal)
  }

  // Calculate dynamic height based on number of items
  const chartHeight = Math.max(300, data.length * 60)

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis type="number" stroke="#64748b" />
        <YAxis type="category" dataKey="name" stroke="#64748b" width={150} />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="current" name="Current Value" radius={[0, 8, 8, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// CBC Trend Chart - Shows trends over time
interface CBCTrendChartProps {
  data: {
    dates?: string[]
    hemoglobin?: number[]
    wbc?: number[]
    platelets?: number[]
  }
}

export function CBCTrendChart({ data }: CBCTrendChartProps) {
  if (!data || !data.dates || data.dates.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-slate-500">
        No trend data available. Regular monitoring recommended.
      </div>
    )
  }

  // Transform data for chart
  const chartData = data.dates.map((date, idx) => ({
    date,
    hemoglobin: data.hemoglobin?.[idx],
    wbc: data.wbc?.[idx],
    platelets: data.platelets?.[idx]
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="date" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
        />
        <Legend />
        {data.hemoglobin && (
          <Line 
            type="monotone" 
            dataKey="hemoglobin" 
            stroke="#3b82f6" 
            strokeWidth={2} 
            dot={{ r: 4 }}
            name="Hemoglobin"
          />
        )}
        {data.wbc && (
          <Line 
            type="monotone" 
            dataKey="wbc" 
            stroke="#10b981" 
            strokeWidth={2} 
            dot={{ r: 4 }}
            name="WBC"
          />
        )}
        {data.platelets && (
          <Line 
            type="monotone" 
            dataKey="platelets" 
            stroke="#f59e0b" 
            strokeWidth={2} 
            dot={{ r: 4 }}
            name="Platelets"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}

// Cholesterol Breakdown Chart - Pie chart showing cholesterol composition
interface CholesterolBreakdownChartProps {
  data: {
    totalCholesterol?: number
    hdl?: number
    ldl?: number
    triglycerides?: number
  }
}

export function CholesterolBreakdownChart({ data }: CholesterolBreakdownChartProps) {
  if (!data || (!data.hdl && !data.ldl && !data.triglycerides)) {
    return (
      <div className="h-[300px] flex items-center justify-center text-slate-500">
        Lipid panel not included. Consider cholesterol screening.
      </div>
    )
  }

  const chartData: Array<{ name: string; value: number; color: string }> = []
  
  if (data.hdl) {
    chartData.push({ name: "HDL (Good)", value: data.hdl, color: "#10b981" })
  }
  if (data.ldl) {
    chartData.push({ name: "LDL (Bad)", value: data.ldl, color: "#ef4444" })
  }
  if (data.triglycerides) {
    chartData.push({ name: "Triglycerides", value: data.triglycerides, color: "#f59e0b" })
  }

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry: any, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      {data.totalCholesterol && (
        <div className="text-center mt-4">
          <p className="text-sm text-slate-600">
            Total Cholesterol: <span className="font-semibold text-slate-900">{data.totalCholesterol} mg/dL</span>
          </p>
        </div>
      )}
    </div>
  )
}