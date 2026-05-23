import React from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import AdminPageTransition from '@/components/admin/AdminPageTransition'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Fetch DB Size
  const { data: dbSizeRaw } = await supabase.rpc('get_db_size')
  const dbSizeMB = dbSizeRaw ? (dbSizeRaw / (1024 * 1024)).toFixed(2) : 0

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/30 hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-primary">Admin Dashboard</h2>
          <p className="text-xs text-muted-foreground mt-1 truncate">{user.email}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Content</p>
          <Link href="/admin/projects" className="block px-4 py-2 rounded-lg hover:bg-secondary/80 text-sm transition-colors">
            Projects
          </Link>
          <Link href="/admin/experience" className="block px-4 py-2 rounded-lg hover:bg-secondary/80 text-sm transition-colors">
            Experience
          </Link>
          <Link href="/admin/education" className="block px-4 py-2 rounded-lg hover:bg-secondary/80 text-sm transition-colors">
            Education
          </Link>
          <Link href="/admin/certifications" className="block px-4 py-2 rounded-lg hover:bg-secondary/80 text-sm transition-colors">
            Certifications
          </Link>
          <div className="my-4 border-t border-border/50"></div>
          <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4">Settings</p>
          <Link href="/admin/settings" className="block px-4 py-2 rounded-lg hover:bg-secondary/80 text-sm transition-colors">
            General Settings (Media)
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          {/* DB Usage Footer */}
          <div className="mb-4 px-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">DB Usage</span>
              <span className="font-medium">{dbSizeMB} MB</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min((Number(dbSizeMB) / 500) * 100, 100)}%` }}></div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 text-right">Limit: 500 MB</p>
          </div>

          <form action={handleSignOut}>
            <button className="w-full px-4 py-2 text-sm text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card/30">
          <h2 className="text-lg font-bold text-primary">Admin</h2>
          <form action={handleSignOut}>
            <button className="text-sm text-destructive p-2 rounded-lg bg-destructive/10">Sign Out</button>
          </form>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <AdminPageTransition>
            {children}
          </AdminPageTransition>
        </div>
      </main>
    </div>
  )
}
