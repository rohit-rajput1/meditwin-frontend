"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

export interface AuthFormData {
  email: string
  password: string
  confirmPassword?: string
}

interface AuthFormProps {
  type: "login" | "signup"
  onSubmit: (data: AuthFormData) => void | Promise<void>
  isLoading?: boolean
}

export default function AuthForm({ type, onSubmit, isLoading = false }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!email) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Please enter a valid email"

    if (!password) newErrors.password = "Password is required"
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters"

    if (type === "signup") {
      if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password"
      else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        email,
        password,
        ...(type === "signup" && { confirmPassword }),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-slate-900">
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (errors.email) setErrors({ ...errors, email: "" })
          }}
          className={errors.email ? "border-red-500" : ""}
          disabled={isLoading}
          required
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-slate-900">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors({ ...errors, password: "" })
            }}
            className={errors.password ? "border-red-500 pr-10" : "pr-10"}
            disabled={isLoading}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      {type === "signup" && (
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-900">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" })
              }}
              className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : type === "login" ? "Sign In" : "Create Account"}
      </Button>

      <div className="text-center text-sm text-slate-600">
        {type === "login" ? (
          <>
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline font-medium">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline font-medium">
              Sign in
            </Link>
          </>
        )}
      </div>
    </form>
  )
}