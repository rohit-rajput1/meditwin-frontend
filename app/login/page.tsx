"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import AuthForm from "@/components/auth-form"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          user_email: data.email,
          password: data.password,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Login failed")
      }

      // Get user info
      const meRes = await fetch(`${API_BASE_URL}/auth/me`, { credentials: 'include' })
      const userData = meRes.ok ? await meRes.json() : { email: data.email }

      localStorage.setItem("user", JSON.stringify(userData))
      window.dispatchEvent(new Event("userChanged"))

      toast({ title: "Success", description: "Welcome back!" })
      router.push("/")
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <span className="font-bold text-2xl">MediTwin</span>
          </Link>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-slate-600">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
          <AuthForm type="login" onSubmit={handleLogin} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}