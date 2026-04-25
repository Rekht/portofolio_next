'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProjects() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('projects').select('*').order('id')
  if (error) throw new Error(error.message)
  return data
}

export async function saveProject(data: any) {
  const supabase = await createClient()
  
  if (data.id) {
    // Update
    const { error } = await supabase.from('projects').update(data).eq('id', data.id)
    if (error) throw new Error(error.message)
  } else {
    // Insert - get max id
    const { data: maxData } = await supabase.from('projects').select('id').order('id', { ascending: false }).limit(1)
    const newId = maxData && maxData.length > 0 ? maxData[0].id + 1 : 1
    const { error } = await supabase.from('projects').insert({ ...data, id: newId })
    if (error) throw new Error(error.message)
  }
  
  revalidatePath('/', 'layout')
}

export async function deleteProject(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/', 'layout')
}
