"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Heart, Droplet, Ruler, Weight, Phone, AlertCircle, Pill } from "lucide-react"

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
      credentials: 'include',
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }))
      const errorObj = new Error(error.detail || `HTTP error! status: ${response.status}`)
      // @ts-ignore
      errorObj.status = response.status
      throw errorObj
    }
    
    return response.json()
  },
  
  healthInfo: {
    async get() {
      return api.fetch('/auth/health-info', {
        method: 'GET',
      })
    },
    async createOrUpdate(data: any) {
      return api.fetch('/auth/health-info', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  },
}

interface HealthInfo {
  height_cm: string
  weight_kg: string
  blood_type: string
  allergies: string
  current_medications: string
  emergency_contact: string
}

interface HealthInfoFormProps {
  initialData?: HealthInfo
  onSave?: (data: HealthInfo) => void
}

export default function HealthInfoForm({ initialData, onSave }: HealthInfoFormProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    height_cm: "",
    weight_kg: "",
    blood_type: "",
    allergies: "",
    current_medications: "",
    emergency_contact: "",
  })

  useEffect(() => {
    const fetchHealthInfo = async () => {
      try {
        setIsLoading(true)
        
        try {
          const healthData = await api.healthInfo.get()
          
          setFormData({
            height_cm: healthData.height_cm?.toString() || "",
            weight_kg: healthData.weight_kg?.toString() || "",
            blood_type: healthData.blood_type || "",
            allergies: Array.isArray(healthData.allergies) 
              ? healthData.allergies.join(", ") 
              : healthData.allergies || "",
            current_medications: Array.isArray(healthData.current_medications)
              ? healthData.current_medications.join(", ")
              : healthData.current_medications || "",
            emergency_contact: healthData.emergency_contact || "",
          })
          setIsEditing(false)
        } catch (healthError: any) {
          // @ts-ignore
          if (healthError.status === 404 || healthError.message.includes("not found")) {
            console.log("No health info found, user needs to create health info")
            setFormData({
              height_cm: "",
              weight_kg: "",
              blood_type: "",
              allergies: "",
              current_medications: "",
              emergency_contact: "",
            })
            setIsEditing(true)
          } else {
            console.error("Error fetching health info:", healthError)
            toast({
              title: "Error",
              description: "Could not load health information. Please try again.",
              variant: "destructive",
            })
            setIsEditing(true)
          }
        }
      } catch (error: any) {
        console.error("Failed to load health data:", error)
        toast({
          title: "Error",
          description: "Failed to load health information",
          variant: "destructive",
        })
        setIsEditing(true)
      } finally {
        setIsLoading(false)
      }
    }

    if (!initialData) {
      fetchHealthInfo()
    } else {
      setFormData(initialData)
      setIsLoading(false)
    }
  }, [initialData, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!formData.height_cm || parseFloat(formData.height_cm) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid height",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.weight_kg || parseFloat(formData.weight_kg) <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid weight",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.blood_type.trim()) {
      toast({
        title: "Validation Error",
        description: "Blood type is required",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.emergency_contact.trim()) {
      toast({
        title: "Validation Error",
        description: "Emergency contact is required",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const updateData = {
        height_cm: parseFloat(formData.height_cm),
        weight_kg: parseFloat(formData.weight_kg),
        blood_type: formData.blood_type.trim(),
        emergency_contact: formData.emergency_contact.trim(),
        allergies: formData.allergies
          .split(",")
          .map(item => item.trim())
          .filter(item => item.length > 0),
        current_medications: formData.current_medications
          .split(",")
          .map(item => item.trim())
          .filter(item => item.length > 0),
      }
      
      const response = await api.healthInfo.createOrUpdate(updateData)
      
      setFormData({
        height_cm: response.height_cm?.toString() || formData.height_cm,
        weight_kg: response.weight_kg?.toString() || formData.weight_kg,
        blood_type: response.blood_type || formData.blood_type,
        allergies: Array.isArray(response.allergies)
          ? response.allergies.join(", ")
          : formData.allergies,
        current_medications: Array.isArray(response.current_medications)
          ? response.current_medications.join(", ")
          : formData.current_medications,
        emergency_contact: response.emergency_contact || formData.emergency_contact,
      })
      
      onSave?.(formData)
      
      toast({
        title: "Success",
        description: "Health information saved successfully",
      })
      
      setIsEditing(false)
    } catch (error: any) {
      console.error("Failed to save health info:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save health information",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const hasHealthData = formData.height_cm || formData.weight_kg || formData.blood_type

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center border-2 border-red-200">
            <Heart className="text-red-600" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Health Information</h3>
        </div>
        
        {hasHealthData && !isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="bg-transparent">
            Edit
          </Button>
        )}
        
        {isEditing && hasHealthData && (
          <Button onClick={() => setIsEditing(false)} variant="destructive">
            Cancel
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900 flex items-center gap-2">
            <Ruler size={16} />
            Height (cm) *
          </label>
          <Input
            name="height_cm"
            type="number"
            value={formData.height_cm}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="170"
            className={!isEditing ? "bg-slate-50" : ""}
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900 flex items-center gap-2">
            <Weight size={16} />
            Weight (kg) *
          </label>
          <Input
            name="weight_kg"
            type="number"
            value={formData.weight_kg}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="70"
            className={!isEditing ? "bg-slate-50" : ""}
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900 flex items-center gap-2">
            <Droplet size={16} />
            Blood Type *
          </label>
          <Input
            name="blood_type"
            value={formData.blood_type}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="A+"
            className={!isEditing ? "bg-slate-50" : ""}
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-900 flex items-center gap-2">
            <Phone size={16} />
            Emergency Contact *
          </label>
          <Input
            name="emergency_contact"
            value={formData.emergency_contact}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="+1 (555) 123-4567"
            className={!isEditing ? "bg-slate-50" : ""}
          />
        </div>
        
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-slate-900 flex items-center gap-2">
            <AlertCircle size={16} />
            Allergies
          </label>
          <Textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="List any allergies (comma-separated, e.g., Penicillin, Peanuts)"
            className={!isEditing ? "bg-slate-50" : ""}
            rows={3}
          />
          <p className="text-xs text-slate-500">Separate multiple allergies with commas</p>
        </div>
        
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-medium text-slate-900 flex items-center gap-2">
            <Pill size={16} />
            Current Medications
          </label>
          <Textarea
            name="current_medications"
            value={formData.current_medications}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="List any current medications (comma-separated, e.g., Aspirin, Metformin)"
            className={!isEditing ? "bg-slate-50" : ""}
            rows={3}
          />
          <p className="text-xs text-slate-500">Separate multiple medications with commas</p>
        </div>
      </div>

      {isEditing && (
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <Button onClick={handleSave} disabled={isSaving} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              hasHealthData ? "Save Changes" : "Create Health Info"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}