'use client'

import React, { useState, useMemo } from 'react'
import { saveExperience, deleteExperience } from './actions'
import FileUpload from '@/components/admin/FileUpload'

const MONTHS: Record<string, number> = {
  'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'mei': 4, 'jun': 5,
  'jul': 6, 'aug': 7, 'agt': 7, 'sep': 8, 'oct': 9, 'okt': 9, 'nov': 10, 'dec': 11, 'des': 11
};

function parseDateFromPeriod(period: string): Date {
  if (!period) return new Date(0)
  
  const parts = period.split('-').map(s => s.trim())
  const dateStr = parts[0] // Sort by START DATE instead of end date
  
  if (dateStr.toLowerCase() === 'present' || dateStr.toLowerCase() === 'sekarang') {
    return new Date() 
  }
  
  const tokens = dateStr.toLowerCase().split(/\s+/)
  let year = 0
  let month = 0

  for (const token of tokens) {
    if (!isNaN(parseInt(token)) && token.length === 4) {
      year = parseInt(token)
    } else {
      for (const [key, val] of Object.entries(MONTHS)) {
        if (token.startsWith(key)) {
          month = val
          break
        }
      }
    }
  }

  if (year > 0) return new Date(year, month, 1)
  
  const parsed = new Date(dateStr)
  return isNaN(parsed.getTime()) ? new Date(0) : parsed
}

export default function ExperienceClient({ initialExperience }: { initialExperience: any[] }) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  const sortedExperience = useMemo(() => {
    return [...initialExperience].sort((a, b) => {
      const dateA = parseDateFromPeriod(a.duration)
      const dateB = parseDateFromPeriod(b.duration)
      return dateB.getTime() - dateA.getTime() // Newest first
    })
  }, [initialExperience])

  const handleEdit = (exp: any) => {
    setEditingId(exp.id)
    setFormData({
      ...exp,
      description: Array.isArray(exp.description) ? exp.description.join('\n') : '',
      technologies: Array.isArray(exp.technologies) ? exp.technologies.join(', ') : '',
      images: Array.isArray(exp.images) ? exp.images.join('\n') : ''
    })
  }

  const handleNew = () => {
    setEditingId(0) // 0 indicates a new item
    setFormData({ company: '', position: '', duration: '', location: '', description: '', technologies: '', images: '' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this experience?')) return
    await deleteExperience(id)
    window.location.reload()
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const payload = {
        ...formData,
        id: editingId === 0 ? undefined : editingId,
        description: formData.description ? formData.description.split('\n').map((f: string) => f.trim()).filter(Boolean) : [],
        technologies: formData.technologies ? formData.technologies.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        images: formData.images ? formData.images.split('\n').map((f: string) => f.trim()).filter(Boolean) : []
      }
      
      await saveExperience(payload)
      window.location.reload()
    } catch (error: any) {
      alert(error.message || 'Something went wrong')
    } finally {
      setIsSaving(false)
    }
  }

  if (editingId !== null) {
    return (
      <div className="bg-card border border-border p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{editingId === 0 ? 'Add New Experience' : 'Edit Experience'}</h2>
          <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground">Cancel</button>
        </div>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company *</label>
              <input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Position *</label>
              <input required value={formData.position || ''} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Duration *</label>
              <input required value={formData.duration || ''} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg" placeholder="Aug 2024 - Present" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg" placeholder="Jakarta, Indonesia" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description (One paragraph per line) *</label>
            <textarea required value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg h-32" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Technologies (Comma separated)</label>
              <input value={formData.technologies || ''} onChange={e => setFormData({...formData, technologies: e.target.value})} placeholder="Next.js, Tailwind, Supabase" className="w-full px-3 py-2 bg-secondary border border-border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Images (One URL per line)</label>
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <textarea value={formData.images || ''} onChange={e => setFormData({...formData, images: e.target.value})} placeholder="https://...&#10;https://..." className="flex-1 w-full px-3 py-2 bg-secondary border border-border rounded-lg h-32" />
                <div className="w-full md:w-64 flex-shrink-0">
                  <FileUpload 
                    folder="assets/experience" 
                    onUploadComplete={(url) => setFormData({...formData, images: formData.images ? `${formData.images}\n${url}` : url})} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 bg-secondary text-foreground rounded-lg">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg disabled:opacity-50">
              {isSaving ? 'Saving...' : 'Save Experience'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Experience Management</h1>
          <p className="text-muted-foreground text-sm">Manage your work history and experiences.</p>
        </div>
        <button onClick={handleNew} className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add New
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Position</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedExperience.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No experience found. Create one above!</td>
                </tr>
              ) : (
                sortedExperience.map((exp) => (
                  <tr key={exp.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-foreground">{exp.company}</td>
                    <td className="px-4 py-3 text-muted-foreground">{exp.position}</td>
                    <td className="px-4 py-3 text-muted-foreground">{exp.duration}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(exp)} className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors mr-2">Edit</button>
                      <button onClick={() => handleDelete(exp.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
