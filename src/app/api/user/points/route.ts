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
      return NextResponse.json({ points: 0, usda: 0 })
    }
    
    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('session_token', sessionToken)
      .single()
    
    if (userError || !user) {
      return NextResponse.json({ points: 0, usda: 0 })
    }
    
    // Get user points
    const { data: pointsData, error: pointsError } = await supabase
      .from('user_points')
      .select('points, usda_amount')
      .eq('user_id', user.id)
    
    if (pointsError) {
      console.error('Error getting user points:', pointsError)
      return NextResponse.json({ points: 0, usda: 0 })
    }
    
    // Calculate total points and USDA
    const totalPoints = pointsData?.reduce((sum, point) => sum + point.points, 0) || 0
    const totalUsda = pointsData?.reduce((sum, point) => sum + parseFloat(point.usda_amount), 0) || 0
    
    return NextResponse.json({ 
      points: totalPoints, 
      usda: totalUsda.toFixed(2)
    })
  } catch (error) {
    console.error('Error getting user points:', error)
    return NextResponse.json({ points: 0, usda: 0 })
  }
} 