"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileForm from "@/components/profile-form"
import HealthInfoForm from "@/components/health-info-form"
import { useToast } from "@/hooks/use-toast"
import { LogOut, ArrowLeft } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [dataSharing, setDataSharing] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("user")
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    })
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Profile</h1>
            <p className="text-slate-600 mt-2">Manage your account and health information</p>
          </div>
          <Button onClick={() => router.back()} variant="outline" className="gap-2 bg-transparent">
            <ArrowLeft size={18} />
            Back
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-50 border border-slate-200">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="health">Health Info</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Info Tab */}
          <TabsContent value="health">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Health Information</CardTitle>
                <CardDescription>Manage your medical details and emergency contacts</CardDescription>
              </CardHeader>
              <CardContent>
                <HealthInfoForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 pt-8 border-t border-slate-200">
          <Button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white gap-2">
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
