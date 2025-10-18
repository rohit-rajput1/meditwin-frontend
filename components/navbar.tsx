"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, LogOut, LayoutDashboard, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserData {
  email: string
  name?: string
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in
    const checkUser = () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        setUser(null)
      }
    }

    // Check on mount
    checkUser()

    // Listen for storage changes (from other tabs/windows)
    window.addEventListener("storage", checkUser)

    // Listen for custom event (from same tab)
    window.addEventListener("userChanged", checkUser)

    return () => {
      window.removeEventListener("storage", checkUser)
      window.removeEventListener("userChanged", checkUser)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("healthProgress")
    setUser(null)
    router.push("/")
    setIsOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-all">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
              MediTwin
            </span>
          </Link>

          {/* Middle - Empty */}
          <div className="flex-1"></div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* Reports Button */}
                <Link href="/reports">
                  <Button 
                    variant="ghost" 
                    className={`gap-2 ${pathname === '/reports' ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100'}`}
                  >
                    <LayoutDashboard size={18} />
                    Reports
                  </Button>
                </Link>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border-2 border-blue-200">
                        <User className="text-blue-600" size={20} />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs leading-none text-slate-500">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2" size={16} />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2" size={16} />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
            {user ? (
              <>
                <div className="px-4 py-2 border-b border-slate-200 mb-2">
                  <p className="text-sm font-medium text-slate-900">{user?.name || "User"}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <Link
                  href="/reports"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    pathname === '/reports'
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard size={18} />
                  Reports
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <div className="px-4 pt-2 border-t border-slate-200">
                  <Button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white gap-2 transition-all"
                  >
                    <LogOut size={18} />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex gap-2 px-4 pt-2">
                <Link href="/login" className="flex-1">
                  <Button variant="ghost" className="w-full hover:bg-slate-100 transition-all">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" className="flex-1">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-all">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}