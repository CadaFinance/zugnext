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

    // Check if both daily tasks are completed
    const { data: dailyTasks, error: dailyError } = await supabase
      .from('daily_tasks')
      .select('task_id, completed_at, claimed_at')
      .eq('user_id', userId)
      .in('task_id', ['daily_1', 'daily_2'])

    if (dailyError) {
      console.error('Error checking daily tasks:', dailyError)
      return NextResponse.json({ error: 'Failed to check daily tasks' }, { status: 500 })
    }

    const completedTasks = dailyTasks.filter(task => task.completed_at && !task.claimed_at)
    
    if (completedTasks.length < 2) {
      return NextResponse.json({ error: 'Complete both daily tasks first' }, { status: 400 })
    }

    // Claim daily rewards
    const { data: claimData, error: claimError } = await supabase
      .rpc('claim_daily_rewards', { user_uuid: userId })

    if (claimError) {
      console.error('Error claiming daily rewards:', claimError)
      return NextResponse.json({ error: 'Failed to claim daily rewards' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      points: claimData 
    })

  } catch (error) {
    console.error('Error in claim daily rewards API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 