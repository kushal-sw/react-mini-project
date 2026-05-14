import { supabase } from './supabase'

export const createOrUpdateProfile = async (firebaseUser, displayName) => {
  
  const { data: existing } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', firebaseUser.uid)
    .single()

  // Use passed displayName, then Firebase displayName, then email prefix as fallback
  const name = displayName || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'user';

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: firebaseUser.uid,
      username: name.replace(/\s+/g, '_').toLowerCase(),
      bio: 'eating good since 2024',
      avatar_url: existing?.avatar_url || firebaseUser.photoURL
    }, { 
      onConflict: 'id',
      ignoreDuplicates: false 
    })

  if (error) console.error('Profile error:', error)
  return data
}