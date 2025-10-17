import { TrendingUp, TrendingDown } from "lucide-react"

interface HealthMetricCardProps {
  title: string
  value: string
  unit: string
  status: "normal" | "warning" | "critical"
  trend?: "up" | "down"
  trendValue?: string
}

export default function HealthMetricCard({ title, value, unit, status, trend, trendValue }: HealthMetricCardProps) {
  const statusColors = {
    normal: "bg-green-50 border-green-200",
    warning: "bg-yellow-50 border-yellow-200",
    critical: "bg-red-50 border-red-200",
  }

  const statusTextColors = {
    normal: "text-green-700",
    warning: "text-yellow-700",
    critical: "text-red-700",
  }

  const trendColors = {
    up: "text-red-600",
    down: "text-green-600",
  }

  return (
    <div className={`rounded-xl border p-6 ${statusColors[status]}`}>
      <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
      <div className="flex items-baseline justify-between">
        <div>
          <p className={`text-3xl font-bold ${statusTextColors[status]}`}>{value}</p>
          <p className="text-sm text-slate-600">{unit}</p>
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 ${trendColors[trend]}`}>
            {trend === "up" ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  )
}
