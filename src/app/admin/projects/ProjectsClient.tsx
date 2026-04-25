'use client'

import React, { useState } from 'react'
import { saveProject, deleteProject } from './actions'

export default function ProjectsClient({ initialProjects }: { initialProjects: any[] }) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleEdit = (project: any) => {
    setEditingId(project.id)
    setFormData({
      ...project,
      tags: project.tags ? project.tags.join(', ') : '',
      features: project.features ? project.features.join('\n') : ''
    })
  }

  const handleNew = () => {
    setEditingId(0) // 0 indicates a new item
    setFormData({ title: '', description: '', detailedDescription: '', image: '', url: '', tags: '', features: '' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    await deleteProject(id)
    window.location.reload()
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const payload = {
        ...formData,
        id: editingId === 0 ? undefined : editingId,
        tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        features: formData.features.split('\n').map((f: string) => f.trim()).filter(Boolean)
      }
      
      await saveProject(payload)
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
          <h2 className="text-xl font-bold">{editingId === 0 ? 'Add New Project' : 'Edit Project'}</h2>
          <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground">Cancel</button>
        </div>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL (Live link)</label>
              <input value={formData.url || ''} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Short Description *</label>
            <input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Detailed Description (Supports paragraphs separated by newlines)</label>
            <textarea value={formData.detailedDescription || ''} onChange={e => setFormData({...formData, detailedDescription: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg h-32" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image URL *</label>
            <input required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tags (Comma separated)</label>
              <input value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="React, Next.js, Tailwind" className="w-full px-3 py-2 bg-secondary border border-border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Features (One per line)</label>
              <textarea value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} placeholder="Authentication&#10;Database&#10;Responsive" className="w-full px-3 py-2 bg-secondary border border-border rounded-lg h-24" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 bg-secondary text-foreground rounded-lg">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg disabled:opacity-50">
              {isSaving ? 'Saving...' : 'Save Project'}
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
          <h1 className="text-2xl font-bold">Projects Management</h1>
          <p className="text-muted-foreground text-sm">Manage your portfolio projects shown on the homepage.</p>
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
                <th className="px-4 py-3 font-medium">Image</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Tags</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {initialProjects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No projects found. Create one above!</td>
                </tr>
              ) : (
                initialProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      {p.image && <img src={p.image} alt={p.title} className="w-12 h-12 object-cover rounded-lg border border-border" />}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">{p.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">{p.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.tags?.slice(0, 2).map((t: string) => (
                          <span key={t} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full">{t}</span>
                        ))}
                        {p.tags?.length > 2 && <span className="text-xs text-muted-foreground">+{p.tags.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(p)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors mr-2">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">Delete</button>
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
