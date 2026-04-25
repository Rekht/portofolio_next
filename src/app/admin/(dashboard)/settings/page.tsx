'use client'

import React, { useState } from 'react'
import FileUpload from '@/components/admin/FileUpload'

export default function SettingsPage() {
  const [cvUrl, setCvUrl] = useState(process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/portfolio-images/assets/cv.pdf')
  const [logoUrl, setLogoUrl] = useState(process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/portfolio-images/assets/logo.png')
  const [profileUrl, setProfileUrl] = useState(process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/portfolio-images/assets/profile.png')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">General Settings</h1>
        <p className="text-muted-foreground text-sm">Update your CV, Logo, and Profile Photo. These files will be directly overwritten in storage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CV Upload */}
        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center">
          <h2 className="text-lg font-bold mb-4">Resume / CV (PDF)</h2>
          <div className="w-full mb-4">
            <FileUpload 
              folder="assets" 
              filename="cv.pdf"
              accept=".pdf"
              onUploadComplete={(url) => setCvUrl(`${url}?t=${Date.now()}`)} // Add cache buster
            />
          </div>
          <a href={cvUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm font-medium">
            View Current CV
          </a>
        </div>

        {/* Profile Photo Upload */}
        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center">
          <h2 className="text-lg font-bold mb-4">Profile Photo (PNG/JPG)</h2>
          <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-secondary">
            <img src={profileUrl} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="w-full mb-4">
            <FileUpload 
              folder="assets" 
              filename="profile.png"
              accept="image/*"
              onUploadComplete={(url) => setProfileUrl(`${url}?t=${Date.now()}`)}
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col items-center">
          <h2 className="text-lg font-bold mb-4">Website Logo (PNG)</h2>
          <div className="w-32 h-32 mb-4 rounded-2xl overflow-hidden bg-secondary flex items-center justify-center border-4 border-secondary p-4">
            <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
          </div>
          <div className="w-full mb-4">
            <FileUpload 
              folder="assets" 
              filename="logo.png"
              accept="image/png"
              onUploadComplete={(url) => setLogoUrl(`${url}?t=${Date.now()}`)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
