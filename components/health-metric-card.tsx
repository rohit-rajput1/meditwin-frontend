import { TrendingUp, TrendingDown, AlertCircle, Clock, Pill, Calendar } from "lucide-react"

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

// Prescription Summary Card Component
interface PrescriptionSummaryCardProps {
  title: string
  value: string
  subtitle: string
  icon: "diagnosis" | "duration" | "medicines" | "followup"
  isOverdue?: boolean
}

export function PrescriptionSummaryCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  isOverdue = false 
}: PrescriptionSummaryCardProps) {
  const iconMap: Record<string, { icon: any; color: 'blue' | 'emerald' | 'purple' | 'amber' | 'red' }> = {
    diagnosis: { icon: AlertCircle, color: "blue" as const },
    duration: { icon: Clock, color: "emerald" as const },
    medicines: { icon: Pill, color: "purple" as const },
    followup: { icon: Calendar, color: (isOverdue ? "red" : "amber") as 'red' | 'amber' }
  }

  const { icon: IconComponent, color } = iconMap[icon]
  
  const colorClasses: Record<'blue' | 'emerald' | 'purple' | 'amber' | 'red', string> = {
    blue: "border-blue-200 bg-blue-50 text-blue-600",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-600",
    purple: "border-purple-200 bg-purple-50 text-purple-600",
    amber: "border-amber-200 bg-amber-50 text-amber-600",
    red: "border-red-300 bg-red-50 text-red-600"
  }

  const borderBgClasses = colorClasses[color].split(' ').slice(0, 2).join(' ')
  const textColorClass = colorClasses[color].split(' ')[2]

  return (
    <div className={`rounded-xl border p-6 ${borderBgClasses}`}>
      <div className="flex items-center gap-3 mb-2">
        <IconComponent className={`w-5 h-5 ${textColorClass}`} />
        <p className="text-sm font-medium text-slate-600">{title}</p>
      </div>
      <p className={`text-lg font-bold ${isOverdue ? 'text-red-700' : 'text-slate-900'}`}>{value}</p>
      <p className={`text-xs mt-1 ${isOverdue ? 'text-red-600 font-medium' : 'text-slate-600'}`}>{subtitle}</p>
    </div>
  )
}