'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCertifications() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('certifications').select('*').order('id')
  if (error) throw new Error(error.message)
  return data
}

export async function saveCertification(data: any) {
  const supabase = await createClient()
  
  if (data.id) {
    const { error } = await supabase.from('certifications').update(data).eq('id', data.id)
    if (error) throw new Error(error.message)
  } else {
    const { data: maxData } = await supabase.from('certifications').select('id').order('id', { ascending: false }).limit(1)
    const newId = maxData && maxData.length > 0 ? maxData[0].id + 1 : 1
    const { error } = await supabase.from('certifications').insert({ ...data, id: newId })
    if (error) throw new Error(error.message)
  }
  
  revalidatePath('/', 'layout')
}

export async function deleteCertification(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('certifications').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/', 'layout')
}
