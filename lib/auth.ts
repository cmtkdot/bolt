import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from './database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export async function signIn(email: string, password: string) {
    const supabase = createClientComponentClient<Database>()
    return await supabase.auth.signInWithPassword({ email, password })
}

export async function signUp(email: string, password: string) {
    const supabase = createClientComponentClient<Database>()
    return await supabase.auth.signUp({ email, password })
}

export async function signOut() {
    const supabase = createClientComponentClient<Database>()
    return await supabase.auth.signOut()
}

export async function getUser() {
    const supabase = createClientComponentClient<Database>()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
        return { user: null, error }
    }
    return { user, error: null }
}

export async function resetPassword(email: string) {
    const supabase = createClientComponentClient<Database>()
    return await supabase.auth.resetPasswordForEmail(email)
}

export async function updateProfile(userId: string, updates: ProfileUpdate) {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
    return { data: data ? data[0] as Profile : null, error }
}

export async function getProfile(userId: string) {
    const supabase = createClientComponentClient<Database>()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
    return { data: data as Profile | null, error }
}
