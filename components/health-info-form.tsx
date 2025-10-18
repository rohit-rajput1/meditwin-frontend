"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface HealthInfo {
  height: string
  weight: string
  bloodType: string
  allergies: string
  medications: string
  emergencyContact: string
}

interface HealthInfoFormProps {
  initialData?: HealthInfo
  onSave?: (data: HealthInfo) => void
}

export default function HealthInfoForm({ initialData, onSave }: HealthInfoFormProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<HealthInfo>(
    initialData || {
      height: "180",
      weight: "73.8",
      bloodType: "O+",
      allergies: "Penicillin",
      medications: "None",
      emergencyContact: "+1 (555) 987-6543",
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        description: "Health information updated successfully",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update health information",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Health Information</h3>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "destructive" : "outline"}
          className={isEditing ? "" : "bg-transparent"}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">Height (cm)</label>
          <Input
            name="height"
            type="number"
            value={formData.height}
            onChange={handleChange}
            disabled={!isEditing}
            className={!isEditing ? "bg-slate-50" : ""}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">Weight (kg)</label>
          <Input
            name="weight"
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={handleChange}
            disabled={!isEditing}
            className={!isEditing ? "bg-slate-50" : ""}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">Blood Type</label>
          <Input
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            disabled={!isEditing}
            className={!isEditing ? "bg-slate-50" : ""}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900">Emergency Contact</label>
          <Input
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            disabled={!isEditing}
            className={!isEditing ? "bg-slate-50" : ""}
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-slate-900">Allergies</label>
          <Input
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="List any known allergies"
            className={!isEditing ? "bg-slate-50" : ""}
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-slate-900">Current Medications</label>
          <Input
            name="medications"
            value={formData.medications}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="List any current medications"
            className={!isEditing ? "bg-slate-50" : ""}
          />
        </div>
      </div>

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