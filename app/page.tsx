import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, MessageSquare, TrendingUp, Zap } from "lucide-react"

export default function Home() {
  const steps = [
    {
      icon: Upload,
      title: "Upload Your Report",
      description:
        "Upload medical reports in PDF or image format.",
    },
    {
      icon: Zap,
      title: "AI Analysis",
      description:
        "Instant AI analysis extracts key findings and recommendations.",
    },
    {
      icon: MessageSquare,
      title: "Chat & Learn",
      description:
        "Ask questions and get personalized health insights.",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description:
        "Monitor health metrics with interactive visualizations.",
    },
  ]

  return (
    <div className="min-h-screen max-h-screen overflow-hidden bg-white flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
                Your Personal AI Health Companion
              </h1>
              <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Understand your medical reports, track your health progress, and chat with your AI doctor.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link href="/upload">
                <Button
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600 text-white gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  Upload Report <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/chat">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 bg-white border-slate-300 hover:bg-slate-50 shadow-md hover:shadow-lg transition-all"
                >
                  Chat with MediTwin <MessageSquare size={18} />
                </Button>
              </Link>
            </div>

            {/* How It Works Section - Integrated */}
            <div className="pt-8">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">How MediTwin Works</h2>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  return (
                    <div
                      key={index}
                      className="relative group"
                    >
                      <div className="bg-white rounded-xl p-5 border border-slate-200 h-full flex flex-col hover:shadow-lg transition-shadow">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Icon className="text-blue-500" size={24} />
                        </div>
                        <div className="text-xs font-semibold text-blue-600 mb-1">Step {index + 1}</div>
                        <h3 className="text-base font-semibold text-slate-900 mb-2">{step.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                      </div>
                      {index < steps.length - 1 && (
                        <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-blue-300 to-transparent" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}