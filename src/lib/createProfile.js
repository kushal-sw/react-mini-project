import { supabase } from './supabase'

export const createOrUpdateProfile = async (firebaseUser) => {
  
  const { data: existing } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', firebaseUser.uid)
    .single()

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: firebaseUser.uid,
      username: firebaseUser.displayName
        ?.replace(/\s+/g, '_')
        .toLowerCase(),
      bio: 'eating good since 2024',
      avatar_url: existing?.avatar_url || firebaseUser.photoURL
    }, { 
      onConflict: 'id',
      ignoreDuplicates: false 
    })

  if (error) console.error('Profile error:', error)
  return data
}