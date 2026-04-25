'use client'

import React, { useState, useMemo } from 'react'
import { saveEducation, deleteEducation } from './actions'

const MONTHS: Record<string, number> = {
  'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'mei': 4, 'jun': 5,
  'jul': 6, 'aug': 7, 'agt': 7, 'sep': 8, 'oct': 9, 'okt': 9, 'nov': 10, 'dec': 11, 'des': 11
};

function parseDateFromPeriod(period: string): Date {
  if (!period) return new Date(0);
  const parts = period.split('-').map(s => s.trim());
  const dateStr = parts[parts.length - 1];
  
  if (dateStr.toLowerCase() === 'present' || dateStr.toLowerCase() === 'sekarang') return new Date();
  
  const tokens = dateStr.toLowerCase().split(/\s+/);
  let year = 0; let month = 0;
  for (const token of tokens) {
    if (!isNaN(parseInt(token)) && token.length === 4) year = parseInt(token);
    else {
      for (const [key, val] of Object.entries(MONTHS)) {
        if (token.startsWith(key)) { month = val; break; }
      }
    }
  }
  if (year > 0) return new Date(year, month, 1);
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

export default function EducationClient({ initialEducation }: { initialEducation: any[] }) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  const sortedEducation = useMemo(() => {
    return [...initialEducation].sort((a, b) => {
      const dateA = parseDateFromPeriod(a.period)
      const dateB = parseDateFromPeriod(b.period)
      return dateB.getTime() - dateA.getTime()
    })
  }, [initialEducation])

  const handleEdit = (edu: any) => {
    setEditingId(edu.id)
    setFormData(edu)
  }

  const handleNew = () => {
    setEditingId(0)
    setFormData({ degree: '', institution: '', period: '', description: '', gpa: '' })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this education?')) return
    await deleteEducation(id)
    window.location.reload()
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const payload = { ...formData, id: editingId === 0 ? undefined : editingId }
      await saveEducation(payload)
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
          <h2 className="text-xl font-bold">{editingId === 0 ? 'Add Education' : 'Edit Education'}</h2>
          <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground">Cancel</button>
        </div>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Degree / Major *</label>
              <input required value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg" placeholder="B.Sc. in Computer Science" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Institution *</label>
              <input required value={formData.institution || ''} onChange={e => setFormData({...formData, institution: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Period *</label>
              <input required value={formData.period || ''} onChange={e => setFormData({...formData, period: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg" placeholder="Aug 2020 - Jun 2024" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GPA</label>
              <input value={formData.gpa || ''} onChange={e => setFormData({...formData, gpa: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg" placeholder="3.80 / 4.00" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 bg-secondary border border-border rounded-lg h-24" />
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
          <h1 className="text-2xl font-bold">Education Management</h1>
          <p className="text-muted-foreground text-sm">Manage your academic background.</p>
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
                <th className="px-4 py-3 font-medium">Degree</th>
                <th className="px-4 py-3 font-medium">Institution</th>
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedEducation.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No education found.</td>
                </tr>
              ) : (
                sortedEducation.map((edu) => (
                  <tr key={edu.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-foreground">{edu.degree}</td>
                    <td className="px-4 py-3 text-muted-foreground">{edu.institution}</td>
                    <td className="px-4 py-3 text-muted-foreground">{edu.period}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(edu)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors mr-2">Edit</button>
                      <button onClick={() => handleDelete(edu.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">Delete</button>
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
