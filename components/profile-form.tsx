"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Phone, MapPin } from "lucide-react"

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  dateOfBirth: string
}

interface ProfileFormProps {
  initialData?: ProfileData
  onSave?: (data: ProfileData) => void
}

export default function ProfileForm({ initialData, onSave }: ProfileFormProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<ProfileData>(
    initialData || {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      dateOfBirth: "1990-05-15",
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSave?.(formData)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
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
            {formData.firstName} {formData.lastName}
          </h2>
          <p className="text-slate-600">{formData.email}</p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "destructive" : "outline"}
          className={isEditing ? "" : "bg-transparent"}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {/* Form Fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">First Name</label>
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={!isEditing}
            className={!isEditing ? "bg-slate-50" : ""}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">Last Name</label>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={!isEditing}
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
            onChange={handleChange}
            disabled={!isEditing}
            className={!isEditing ? "bg-slate-50" : ""}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900 flex items-center gap-2">
            <Phone size={16} />
            Phone
          </label>
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className={!isEditing ? "bg-slate-50" : ""}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900 flex items-center gap-2">
            <MapPin size={16} />
            Location
          </label>
          <Input
            name="location"
            value={formData.location}
            onChange={handleChange}
            disabled={!isEditing}
            className={!isEditing ? "bg-slate-50" : ""}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">Date of Birth</label>
          <Input
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
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
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  )
}
