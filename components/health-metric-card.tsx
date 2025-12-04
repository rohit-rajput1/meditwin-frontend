import { 
  AlertCircle, 
  Clock, 
  Pill, 
  Calendar, 
  Activity,
  TrendingUp,
  Shield,
  AlertTriangle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Prescription Metric Card
interface PrescriptionMetricCardProps {
  title: string
  value: string
}

export function PrescriptionMetricCard({ title, value }: PrescriptionMetricCardProps) {
  const getIconAndColor = (title: string) => {
    const lowerTitle = title.toLowerCase()
    
    if (lowerTitle.includes("diagnosis") || lowerTitle.includes("treatment")) {
      return { icon: AlertCircle, color: "blue" }
    }
    if (lowerTitle.includes("duration")) {
      return { icon: Clock, color: "emerald" }
    }
    if (lowerTitle.includes("medication") || lowerTitle.includes("medicine")) {
      return { icon: Pill, color: "purple" }
    }
    if (lowerTitle.includes("follow") || lowerTitle.includes("date")) {
      return { icon: Calendar, color: "amber" }
    }
    return { icon: Activity, color: "blue" }
  }

  const { icon: IconComponent, color } = getIconAndColor(title)
  
  const colorClasses: Record<string, string> = {
    blue: "border-blue-200 bg-blue-50 text-blue-600",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-600",
    purple: "border-purple-200 bg-purple-50 text-purple-600",
    amber: "border-amber-200 bg-amber-50 text-amber-600",
  }
  
  const borderBgClasses = colorClasses[color]?.split(' ').slice(0, 2).join(' ') || "border-slate-200 bg-slate-50"
  const textColorClass = colorClasses[color]?.split(' ')[2] || "text-slate-600"
  
  // Format title for display
  const displayTitle = title
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()

  return (
    <div className={`rounded-xl border p-6 ${borderBgClasses}`}>
      <div className="flex items-center gap-3 mb-2">
        <IconComponent className={`w-5 h-5 ${textColorClass}`} />
        <p className="text-sm font-medium text-slate-600">{displayTitle}</p>
      </div>
      <p className="text-lg font-bold text-slate-900">{value}</p>
    </div>
  )
}

// Blood Test Metric Card
interface BloodTestMetricCardProps {
  title: string
  value: string
}

export function BloodTestMetricCard({ title, value }: BloodTestMetricCardProps) {
  const getStatusColor = (title: string, value: string) => {
    const lowerTitle = title.toLowerCase()
    const lowerValue = value.toLowerCase()
    
    if (lowerTitle.includes("status")) {
      if (lowerValue.includes("critical")) {
        return "border-red-300 bg-red-50 text-red-700"
      }
      if (lowerValue.includes("abnormal")) {
        return "border-amber-300 bg-amber-50 text-amber-700"
      }
      return "border-emerald-300 bg-emerald-50 text-emerald-700"
    }
    
    if (lowerTitle.includes("abnormal") && parseInt(value) > 0) {
      return "border-amber-300 bg-amber-50 text-amber-700"
    }
    
    if (lowerTitle.includes("critical")) {
      return "border-red-300 bg-red-50 text-red-700"
    }
    
    return "border-blue-200 bg-blue-50 text-blue-600"
  }

  const colorClass = getStatusColor(title, value)
  const borderBgClasses = colorClass.split(' ').slice(0, 2).join(' ')
  const textColorClass = colorClass.split(' ')[2]
  
  // Format title for display
  const displayTitle = title
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()

  return (
    <div className={`rounded-xl border p-6 ${borderBgClasses}`}>
      <div className="flex items-center gap-3 mb-2">
        <Activity className={`w-5 h-5 ${textColorClass}`} />
        <p className="text-sm font-medium text-slate-600">{displayTitle}</p>
      </div>
      <p className={`text-lg font-bold ${textColorClass}`}>{value}</p>
    </div>
  )
}

// Medicine Card Component
interface MedicineCardProps {
  medicine: {
    name: string
    medicineInfo?: {
      strength?: string
      form?: string
      duration?: string
      purpose?: string
    }
    dosageInstruction?: {
      frequency?: string
      amount?: string
      timing?: string
    }
    sideEffects?: string
    warnings?: string
  }
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  const hasWarning = medicine.warnings && !medicine.warnings.toLowerCase().includes("none")
  
  return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-slate-900">{medicine.name}</h4>
          {medicine.medicineInfo?.strength && (
            <p className="text-sm text-slate-600">
              {medicine.medicineInfo.strength}
              {medicine.medicineInfo.form && ` • ${medicine.medicineInfo.form}`}
              {medicine.medicineInfo.duration && ` • ${medicine.medicineInfo.duration}`}
            </p>
          )}
        </div>
        {hasWarning && (
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
        )}
      </div>
      
      <div className="grid md:grid-cols-2 gap-3 text-sm">
        {medicine.medicineInfo?.purpose && (
          <div>
            <p className="font-medium text-slate-700 mb-1">Purpose</p>
            <p className="text-slate-600">{medicine.medicineInfo.purpose}</p>
          </div>
        )}
        
        {medicine.dosageInstruction && (
          <div>
            <p className="font-medium text-slate-700 mb-1">Dosage</p>
            <p className="text-slate-600">
              {medicine.dosageInstruction.amount && `${medicine.dosageInstruction.amount} `}
              {medicine.dosageInstruction.frequency && medicine.dosageInstruction.frequency}
              {medicine.dosageInstruction.timing && ` • ${medicine.dosageInstruction.timing}`}
            </p>
          </div>
        )}
        
        {medicine.sideEffects && (
          <div>
            <p className="font-medium text-slate-700 mb-1">Side Effects</p>
            <p className="text-slate-600">{medicine.sideEffects}</p>
          </div>
        )}
        
        {medicine.warnings && (
          <div>
            <p className="font-medium text-slate-700 mb-1">Warnings</p>
            <p className={hasWarning ? "text-amber-600 font-medium" : "text-slate-600"}>
              {medicine.warnings}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Safety Information Card
interface SafetyInformationCardProps {
  safetyInfo: {
    dietaryRestrictions?: string[]
    lifestyleRecommendations?: string[]
    drugInteractions?: string[]
  }
}

export function SafetyInformationCard({ safetyInfo }: SafetyInformationCardProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-500" />
          Safety Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {safetyInfo.dietaryRestrictions && safetyInfo.dietaryRestrictions.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-900 mb-2 text-sm">Dietary Restrictions</h4>
            <ul className="space-y-1">
              {safetyInfo.dietaryRestrictions.map((item, idx) => (
                <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {safetyInfo.lifestyleRecommendations && safetyInfo.lifestyleRecommendations.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-900 mb-2 text-sm">Lifestyle Recommendations</h4>
            <ul className="space-y-1">
              {safetyInfo.lifestyleRecommendations.map((item, idx) => (
                <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {safetyInfo.drugInteractions && safetyInfo.drugInteractions.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-900 mb-2 text-sm">Drug Interactions</h4>
            <ul className="space-y-1">
              {safetyInfo.drugInteractions.map((item, idx) => (
                <li key={idx} className="text-sm text-amber-700 flex items-start gap-2">
                  <AlertTriangle size={14} className="mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Biomarker Card Component with proper color coding
interface BiomarkerCardProps {
  biomarker: {
    testName: string
    currentValue: number
    referenceMin: number
    referenceMax: number
    status: string
    unit: string
  }
}

export function BiomarkerCard({ biomarker }: BiomarkerCardProps) {
  const getStatusColors = (status: string) => {
    const lowerStatus = status.toLowerCase()
    
    if (lowerStatus === "low") {
      return {
        border: "border-yellow-300",
        bg: "bg-yellow-50",
        badge: "bg-yellow-100 text-yellow-800 border-yellow-200"
      }
    }
    
    if (lowerStatus === "high") {
      return {
        border: "border-amber-300",
        bg: "bg-amber-50",
        badge: "bg-amber-100 text-amber-800 border-amber-200"
      }
    }
    
    if (lowerStatus.includes("critical") || lowerStatus === "very low" || lowerStatus === "very high") {
      return {
        border: "border-red-300",
        bg: "bg-red-50",
        badge: "bg-red-100 text-red-800 border-red-200"
      }
    }
    
    // Normal status
    return {
      border: "border-emerald-300",
      bg: "bg-emerald-50",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-200"
    }
  }

  const colors = getStatusColors(biomarker.status)

  return (
    <div className={`p-4 rounded-lg border ${colors.border} ${colors.bg}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900">{biomarker.testName}</h4>
          <p className="text-sm text-slate-600 mt-1">
            Reference: {biomarker.referenceMin} - {biomarker.referenceMax} {biomarker.unit}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors.badge}`}>
          {biomarker.status}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-slate-900">
          {biomarker.currentValue}
        </p>
        <p className="text-sm text-slate-600">{biomarker.unit}</p>
      </div>
    </div>
  )
}