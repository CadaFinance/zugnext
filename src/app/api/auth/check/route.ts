import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Get the session token from cookies
    const sessionToken = request.cookies.get('session_token')?.value
    
    if (!sessionToken) {
      return NextResponse.json({ authenticated: false, user: null })
    }
    
    // Verify the session and get user data
    const { data: user, error } = await supabase
      .from('users')
      .select('id, twitter_id, username, display_name, profile_image_url, created_at, updated_at, tasks')
      .eq('session_token', sessionToken)
      .single()
    
    if (error || !user) {
      return NextResponse.json({ authenticated: false, user: null })
    }
    
    return NextResponse.json({ authenticated: true, user })
  } catch (error) {
    console.error('Error checking authentication:', error)
    return NextResponse.json({ authenticated: false, user: null })
  }
} 