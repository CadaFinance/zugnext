import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { userId, totalPoints } = await request.json()

    if (!userId || !totalPoints) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Update user's tasks status to true and add points
    const { data, error } = await supabase
      .from('users')
      .update({ 
        tasks: true 
      })
      .eq('id', userId)
      .select()

    if (error) {
      console.error('Error updating user tasks:', error)
      return NextResponse.json({ error: 'Failed to update tasks status' }, { status: 500 })
    }

    // Add points to user_points table
    const { error: pointsError } = await supabase
      .from('user_points')
      .insert({
        user_id: userId,
        points: totalPoints,
        usda_amount: 0,
        source: 'tasks_completion',
        referred_user_id: null
      })

    if (pointsError) {
      console.error('Error adding points:', pointsError)
      return NextResponse.json({ error: 'Failed to add points' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Tasks completed and points added successfully' 
    })

  } catch (error) {
    console.error('Error completing tasks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 