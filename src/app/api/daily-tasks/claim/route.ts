import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Check if user has completed one-time tasks
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('tasks')
      .eq('id', userId)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // If one-time tasks are not completed, return error
    if (!userData.tasks) {
      return NextResponse.json({ error: 'Complete one-time tasks first' }, { status: 403 })
    }

    // Check if daily tasks are available (not claimed recently)
    const { data: dailyClaim, error: dailyError } = await supabase
      .from('daily_tasks')
      .select('claimed_at, next_available_at')
      .eq('user_id', userId)
      .eq('task_id', 'daily_claim')
      .single()

    if (dailyClaim && dailyClaim.claimed_at) {
      const nextAvailable = new Date(dailyClaim.next_available_at)
      const now = new Date()
      
      if (nextAvailable > now) {
        const diff = nextAvailable.getTime() - now.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        return NextResponse.json({ 
          error: `Daily tasks not available yet. Try again in ${hours}h ${minutes}m` 
        }, { status: 400 })
      }
    }

    // Update existing daily_claim record or insert if doesn't exist
    const { error: upsertError } = await supabase
      .from('daily_tasks')
      .upsert({
        user_id: userId,
        task_id: 'daily_claim',
        claimed_at: new Date().toISOString(),
        next_available_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      }, {
        onConflict: 'user_id,task_id'
      })

    if (upsertError) {
      console.error('Error claiming daily rewards:', upsertError)
      return NextResponse.json({ error: 'Failed to claim daily rewards' }, { status: 500 })
    }

    // Add points to user
    const { error: pointsError } = await supabase
      .from('user_points')
      .insert({
        user_id: userId,
        points: 300,
        usda_amount: 0,
        source: 'daily_tasks'
      })

    if (pointsError) {
      console.error('Error adding points:', pointsError)
      return NextResponse.json({ error: 'Failed to add points' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      points: 300 
    })

  } catch (error) {
    console.error('Error in claim daily rewards API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 