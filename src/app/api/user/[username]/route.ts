import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()
    
    if (error) {
      console.error('Error fetching user:', error)
      return NextResponse.json({ user: null, error: error.message })
    }
    
    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ user: null, error: 'Internal server error' })
  }
} 