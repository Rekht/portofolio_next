'use client'

import React, { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

interface FileUploadProps {
  folder: string
  onUploadComplete: (url: string) => void
  filename?: string // Force a specific filename (e.g. cv.pdf)
  accept?: string
}

export default function FileUpload({ folder, onUploadComplete, filename, accept = "image/*" }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!file) return
    setIsUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const supabase = createClient()
      
      // Generate filename
      const fileExt = file.name.split('.').pop()
      const finalName = filename ? filename : `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${folder}/${finalName}`

      // Upload file to portfolio-images bucket
      const { data, error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: !!filename // Overwrite if a specific filename is provided
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath)

      setSuccess(true)
      onUploadComplete(publicUrl)
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Error uploading file')
    } finally {
      setIsUploading(false)
    }
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => {
    setIsDragging(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0])
    }
  }

  return (
    <div
      className={`relative w-full border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
        isDragging ? 'border-primary bg-primary/10' : 'border-border bg-secondary/30 hover:bg-secondary/50'
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
        accept={accept}
        className="hidden"
      />
      
      {isUploading ? (
        <div className="flex flex-col items-center text-primary">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <p className="text-sm font-medium">Uploading to Supabase...</p>
        </div>
      ) : success ? (
        <div className="flex flex-col items-center text-green-500">
          <CheckCircle2 className="w-8 h-8 mb-2" />
          <p className="text-sm font-medium">Upload Complete!</p>
        </div>
      ) : (
        <>
          <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
          <div>
            <p className="text-sm font-medium text-foreground">Click or drag file here</p>
            <p className="text-xs text-muted-foreground mt-1">Uploads directly to {folder}</p>
          </div>
        </>
      )}

      {error && (
        <div className="absolute bottom-2 flex items-center gap-1 text-xs text-destructive bg-destructive/10 px-2 py-1 rounded">
          <AlertCircle className="w-3 h-3" /> {error}
        </div>
      )}
    </div>
  )
}
