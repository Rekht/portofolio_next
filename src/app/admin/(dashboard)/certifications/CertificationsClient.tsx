'use client'

import React, { useState } from 'react'
import { saveCertification, deleteCertification } from './actions'
import FileUpload from '@/components/admin/FileUpload'

export default function CertificationsClient({ initialCertifications }: { initialCertifications: any[] }) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleEdit = (cert: any) => {
    setEditingId(cert.id)
    setFormData(cert)
  }

  const handleNew = () => {
    setEditingId(0)
    setFormData({ title: '', title_en: '', issuer: '', date: '', created_at: '', image: '', url: '', isEnglish: false })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this certification?')) return
    await deleteCertification(id)
    window.location.reload()
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const payload = { ...formData, id: editingId === 0 ? undefined : editingId }
      await saveCertification(payload)
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
          <h2 className="text-xl font-bold">{editingId === 0 ? 'Add Certification' : 'Edit Certification'}</h2>
          <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground">Cancel</button>
        </div>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title (ID) *</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title (EN)</label>
              <input value={formData.title_en || ''} onChange={e => setFormData({...formData, title_en: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Issuer *</label>
              <input required value={formData.issuer || ''} onChange={e => setFormData({...formData, issuer: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg" placeholder="Aug 2023" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">URL (Credential Link)</label>
              <input value={formData.url || ''} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg" />
            </div>
            <div className="flex items-center mt-6">
              <input type="checkbox" id="isEnglish" checked={formData.isEnglish} onChange={e => setFormData({...formData, isEnglish: e.target.checked})} className="w-4 h-4 mr-2" />
              <label htmlFor="isEnglish" className="text-sm font-medium">Is English Certificate?</label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <input value={formData.image || ''} onChange={e => setFormData({...formData, image: e.target.value})} className="flex-1 w-full px-3 py-2 bg-secondary border border-border rounded-lg" placeholder="https://..." />
              <div className="w-full md:w-64 flex-shrink-0">
                <FileUpload 
                  folder="assets/certificates" 
                  onUploadComplete={(url) => setFormData({...formData, image: url})} 
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 bg-secondary text-foreground rounded-lg">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg disabled:opacity-50">
              {isSaving ? 'Saving...' : 'Save'}
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
          <h1 className="text-2xl font-bold">Certifications Management</h1>
          <p className="text-muted-foreground text-sm">Manage your licenses and certificates.</p>
        </div>
        <button onClick={handleNew} className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 flex items-center gap-2">
          Add New
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Image</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Issuer</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {initialCertifications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No certifications found.</td>
                </tr>
              ) : (
                initialCertifications.map((cert) => (
                  <tr key={cert.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      {cert.image && <img src={cert.image} alt={cert.title} className="w-16 h-12 object-cover rounded border border-border" />}
                    </td>
                    <td className="px-4 py-3 font-semibold text-foreground">{cert.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{cert.issuer}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(cert)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors mr-2">Edit</button>
                      <button onClick={() => handleDelete(cert.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">Delete</button>
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
