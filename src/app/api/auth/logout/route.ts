import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Get the session token from cookies
    const sessionToken = request.cookies.get('session_token')?.value
    
    if (sessionToken) {
      // Clear the session token in the database
      await supabase
        .from('users')
        .update({ session_token: null })
        .eq('session_token', sessionToken)
    }
    
    // Create response with cleared cookie
    const response = NextResponse.json({ success: true })
    
    // Clear the session cookie
    response.cookies.delete('session_token')
    
    return response
  } catch (error) {
    console.error('Error during logout:', error)
    return NextResponse.json({ success: false, error: 'Logout failed' }, { status: 500 })
  }
} 