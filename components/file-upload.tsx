"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, FileText, ImageIcon, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  isLoading?: boolean
}

export default function FileUpload({ onFileSelect, isLoading = false }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"]
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: "Please upload a PDF or image file (JPEG, PNG, WebP)",
      }
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: "File size must be less than 10MB",
      }
    }

    return { valid: true }
  }

  const handleFile = (file: File) => {
    const validation = validateFile(file)

    if (!validation.valid) {
      setErrorMessage(validation.error || "Invalid file")
      setUploadStatus("error")
      return
    }

    setSelectedFile(file)
    setErrorMessage("")
    setUploadStatus("idle")
    setUploadProgress(0)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploadStatus("uploading")
    setUploadProgress(0)

    try {
      // Simulate file upload with progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setUploadProgress(i)
      }

      setUploadStatus("success")
      onFileSelect(selectedFile)
    } catch (error) {
      setUploadStatus("error")
      setErrorMessage("Failed to upload file. Please try again.")
    }
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setUploadProgress(0)
    setUploadStatus("idle")
    setErrorMessage("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="w-8 h-8 text-blue-500" />
    }
    return <FileText className="w-8 h-8 text-blue-500" />
  }

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-500/50 hover:bg-slate-50"
          } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleChange}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            disabled={isLoading}
          />

          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900 mb-1">Drag and drop your medical report</p>
              <p className="text-sm text-slate-600">
                or{" "}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-500 hover:underline font-medium"
                  disabled={isLoading}
                >
                  browse files
                </button>
              </p>
            </div>
            <p className="text-xs text-slate-600 mt-2">Supported formats: PDF, JPEG, PNG (Max 10MB)</p>
          </div>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-2xl p-6 bg-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              {getFileIcon(selectedFile)}
              <div className="text-left">
                <p className="font-semibold text-slate-900 break-all">{selectedFile.name}</p>
                <p className="text-sm text-slate-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            {uploadStatus !== "uploading" && (
              <button
                onClick={handleRemove}
                className="text-slate-600 hover:text-slate-900 transition-colors"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {uploadStatus === "uploading" && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-slate-900">Uploading...</p>
                <p className="text-sm text-slate-600">{uploadProgress}%</p>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm font-medium">File uploaded successfully</p>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          )}
        </div>
      )}

      {selectedFile && uploadStatus !== "success" && (
        <Button
          onClick={handleUpload}
          disabled={isLoading || uploadStatus === "uploading"}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          {uploadStatus === "uploading" ? "Uploading..." : "Upload Report"}
        </Button>
      )}

      {uploadStatus === "success" && (
        <Button onClick={handleRemove} variant="outline" className="w-full bg-transparent">
          Upload Another Report
        </Button>
      )}
    </div>
  )
}
