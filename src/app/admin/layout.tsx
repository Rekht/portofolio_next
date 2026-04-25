import React from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

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
          {/* Add more links later */}
          <Link href="/admin/education" className="block px-4 py-2 rounded-lg hover:bg-secondary/80 text-sm text-muted-foreground transition-colors pointer-events-none opacity-50">
            Education (Soon)
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <form action={handleSignOut}>
            <button className="w-full px-4 py-2 text-sm text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
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
            <button className="text-sm text-red-500 p-2 rounded-lg bg-red-500/10">Sign Out</button>
          </form>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
