"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, LogOut, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface User {
  email: string
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [healthProgress, setHealthProgress] = useState(75)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    const storedProgress = localStorage.getItem("healthProgress")
    if (storedProgress) {
      setHealthProgress(Number.parseInt(storedProgress))
    }
  }, [])

  const navLinks = user
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/upload", label: "Upload Report" },
        { href: "/chat", label: "Chat" },
        { href: "/profile", label: "Profile" },
      ]
    : []

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
    setIsOpen(false)
  }

  const isActive = (href: string) => pathname === href

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-all">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-lg text-slate-900 hidden sm:inline group-hover:text-blue-600 transition-colors">
              MediTwin
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "text-slate-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-300 pb-1"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            {user && (
              <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-emerald-50 to-emerald-50/50 rounded-lg border border-emerald-200 hover:shadow-md transition-all">
                <Heart size={18} className="text-emerald-500" />
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-emerald-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
                      style={{ width: `${healthProgress}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-emerald-700 min-w-fit">{healthProgress}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-slate-600">{user.email}</span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="gap-2 bg-transparent hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  <LogOut size={18} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="hover:bg-slate-100 transition-all">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-slide-in-up">
            {user && (
              <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-emerald-50/50 rounded-lg border border-emerald-200 mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Heart size={16} className="text-emerald-500" />
                  <span className="text-sm font-semibold text-emerald-700">Health Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-emerald-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
                      style={{ width: `${healthProgress}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-emerald-700">{healthProgress}%</span>
                </div>
              </div>
            )}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded-lg transition-all ${
                  isActive(link.href)
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 px-4 pt-2 border-t border-slate-200">
              {user ? (
                <Button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white gap-2 transition-all"
                >
                  <LogOut size={18} />
                  Logout
                </Button>
              ) : (
                <>
                  <Link href="/login" className="flex-1">
                    <Button variant="ghost" className="w-full hover:bg-slate-100 transition-all">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-all">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
