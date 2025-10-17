import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, MessageSquare, TrendingUp, Zap } from "lucide-react"

export default function Home() {
  const steps = [
    {
      icon: Upload,
      title: "Upload Your Report",
      description:
        "Upload your medical reports in PDF or image format. Our system accepts all common medical document formats.",
    },
    {
      icon: Zap,
      title: "AI Analysis",
      description:
        "Our advanced AI analyzes your reports instantly and extracts key information, findings, and recommendations.",
    },
    {
      icon: MessageSquare,
      title: "Chat & Learn",
      description:
        "Ask questions about your reports to our AI doctor. Get personalized explanations and health insights.",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description:
        "Monitor your health metrics over time with interactive charts and visualizations on your dashboard.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tight">
              Your Personal AI Health Companion
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Understand your medical reports, track your health progress, and chat with your AI doctor. All in one
              place.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/upload">
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                Upload Report <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/chat">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 bg-white border-slate-300 hover:bg-slate-50 shadow-md hover:shadow-lg transition-all"
              >
                Chat with MediTwin <MessageSquare size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How MediTwin Works</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">Simple steps to understand your health better</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                className="relative group animate-slide-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="card-hover bg-white rounded-2xl p-7 border border-slate-200 h-full flex flex-col">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="text-blue-500" size={28} />
                  </div>
                  <div className="text-sm font-semibold text-blue-600 mb-2">Step {index + 1}</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex-grow">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-transparent" />
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-50 via-emerald-50 to-blue-50 rounded-3xl p-8 md:p-16 text-center border border-blue-200/50 shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Ready to Take Control of Your Health?</h2>
          <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Start using MediTwin today to understand your medical reports and track your health progress
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
