"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Phone, MapPin, Loader2 } from "lucide-react"

// API Configuration for Session-Based Authentication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

const api = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // CRITICAL: This sends cookies with the request
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
      const errorObj = new Error(error.detail || `HTTP error! status: ${response.status}`)
      // @ts-ignore - Add status to error object
      errorObj.status = response.status
      throw errorObj
    }

    return response.json()
  },

  profile: {
    async get() {
      return api.fetch('/auth/profile-info', {
        method: 'GET',
      })
    },
    async createOrUpdate(data: any) {
      return api.fetch('/auth/profile-info', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  },
  
  user: {
    async getCurrentUser() {
      return api.fetch('/auth/me') // Adjust endpoint as per your backend
    },
  },
}

interface ProfileData {
  first_name: string
  last_name: string
  email: string
  phone: string
  location: string
  date_of_birth: string
}

interface ProfileFormProps {
  initialData?: ProfileData
  onSave?: (data: ProfileData) => void
}

export default function ProfileForm({ initialData, onSave }: ProfileFormProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false) // Start in view mode
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [formData, setFormData] = useState<ProfileData>(
    initialData || {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      location: "",
      date_of_birth: "",
    }
  )

  // Fetch current user's email and profile data on mount
  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        setIsLoadingUser(true)
        setIsLoadingProfile(true)
        
        // Fetch current user email
        let userEmail = ""
        try {
          const userData = await api.user.getCurrentUser()
          userEmail = userData.email || userData.user_email || ""
        } catch (userError: any) {
          console.log("Could not fetch user from API, trying localStorage")
          // Fallback: try to get email from localStorage if available
          const storedUser = localStorage.getItem("user")
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser)
              userEmail = parsedUser.email || ""
            } catch (e) {
              console.error("Failed to parse stored user", e)
            }
          }
        }
        
        // Try to fetch existing profile
        try {
          const profileData = await api.profile.get()
          
          // Profile exists - populate form with saved data
          setFormData({
            first_name: profileData.first_name || "",
            last_name: profileData.last_name || "",
            email: userEmail,
            phone: profileData.phone || "",
            location: profileData.location || "",
            date_of_birth: profileData.date_of_birth || "",
          })
          setIsEditing(false) // Start in view mode if profile exists
        } catch (profileError: any) {
          // Check if it's a 404 (profile doesn't exist) or other error
          // @ts-ignore
          if (profileError.status === 404 || profileError.message.includes("Profile not found")) {
            console.log("No profile found, user needs to create profile")
            setFormData({
              first_name: "",
              last_name: "",
              email: userEmail,
              phone: "",
              location: "",
              date_of_birth: "",
            })
            setIsEditing(true) // Start in edit mode if no profile exists
          } else {
            // Other errors - show error toast
            console.error("Error fetching profile:", profileError)
            toast({
              title: "Error",
              description: "Could not load profile data. Please try again.",
              variant: "destructive",
            })
            setFormData(prev => ({
              ...prev,
              email: userEmail,
            }))
            setIsEditing(true)
          }
        }
      } catch (error: any) {
        console.error("Failed to load data:", error)
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        })
        setIsEditing(true) // Start in edit mode on error
      } finally {
        setIsLoadingUser(false)
        setIsLoadingProfile(false)
      }
    }

    if (!initialData?.email) {
      fetchUserAndProfile()
    } else {
      setFormData(initialData)
      setIsLoadingUser(false)
      setIsLoadingProfile(false)
    }
  }, [initialData, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    // Validation
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      toast({
        title: "Validation Error",
        description: "First name and last name are required",
        variant: "destructive",
      })
      return
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Validation Error",
        description: "Phone number is required",
        variant: "destructive",
      })
      return
    }

    if (!formData.location.trim()) {
      toast({
        title: "Validation Error",
        description: "Location is required",
        variant: "destructive",
      })
      return
    }

    if (!formData.date_of_birth) {
      toast({
        title: "Validation Error",
        description: "Date of birth is required",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      // Prepare data for backend (exclude email as it's not in UserProfileUpdate schema)
      const updateData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        date_of_birth: formData.date_of_birth,
      }

      const response = await api.profile.createOrUpdate(updateData)
      
      // Update local state with response
      setFormData({
        ...formData,
        first_name: response.first_name,
        last_name: response.last_name,
        phone: response.phone,
        location: response.location,
        date_of_birth: response.date_of_birth,
      })

      onSave?.(formData)
      
      toast({
        title: "Success",
        description: "Profile saved successfully",
      })
      setIsEditing(false) // Disable editing after successful save
    } catch (error: any) {
      console.error("Failed to save profile:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const hasProfileData = formData.first_name || formData.last_name || formData.phone

  if (isLoadingUser || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-6 pb-6 border-b border-slate-200">
        <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-10 h-10 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900">
            {formData.first_name || formData.last_name 
              ? `${formData.first_name} ${formData.last_name}`.trim()
              : "Your Profile"}
          </h2>
          <p className="text-slate-600">{formData.email || "Loading..."}</p>
        </div>
        {hasProfileData && !isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="bg-transparent"
          >
            Edit Profile
          </Button>
        )}
        {isEditing && hasProfileData && (
          <Button
            onClick={() => setIsEditing(false)}
            variant="destructive"
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Form Fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">
            First Name <span className="text-red-500">*</span>
          </label>
          <Input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Enter your first name"
            className={!isEditing ? "bg-slate-50" : ""}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">
            Last Name <span className="text-red-500">*</span>
          </label>
          <Input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Enter your last name"
            className={!isEditing ? "bg-slate-50" : ""}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900 flex items-center gap-2">
            <Mail size={16} />
            Email
          </label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            disabled={true}
            placeholder="your.email@example.com"
            className="bg-slate-50 cursor-not-allowed"
          />
          <p className="text-xs text-slate-500">Email cannot be changed</p>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900 flex items-center gap-2">
            <Phone size={16} />
            Phone <span className="text-red-500">*</span>
          </label>
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="+1 (555) 123-4567"
            className={!isEditing ? "bg-slate-50" : ""}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900 flex items-center gap-2">
            <MapPin size={16} />
            Location <span className="text-red-500">*</span>
          </label>
          <Input
            name="location"
            value={formData.location}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="San Francisco, CA"
            className={!isEditing ? "bg-slate-50" : ""}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <Input
            name="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={handleChange}
            disabled={!isEditing}
            className={!isEditing ? "bg-slate-50" : ""}
          />
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <Button onClick={handleSave} disabled={isSaving} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              hasProfileData ? "Save Changes" : "Create Profile"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}