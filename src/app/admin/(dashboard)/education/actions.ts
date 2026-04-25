'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getEducation() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('education').select('*').order('id')
  if (error) throw new Error(error.message)
  return data
}

export async function saveEducation(data: any) {
  const supabase = await createClient()
  
  if (data.id) {
    const { error } = await supabase.from('education').update(data).eq('id', data.id)
    if (error) throw new Error(error.message)
  } else {
    const { data: maxData } = await supabase.from('education').select('id').order('id', { ascending: false }).limit(1)
    const newId = maxData && maxData.length > 0 ? maxData[0].id + 1 : 1
    const { error } = await supabase.from('education').insert({ ...data, id: newId })
    if (error) throw new Error(error.message)
  }
  
  revalidatePath('/', 'layout')
}

export async function deleteEducation(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('education').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/', 'layout')
}
