import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { userId, taskId } = await request.json()

    if (!userId || !taskId) {
      return NextResponse.json({ error: 'User ID and Task ID are required' }, { status: 400 })
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

    // Complete the daily task
    const { error: completeError } = await supabase
      .rpc('complete_daily_task', { 
        user_uuid: userId, 
        task_id_param: taskId 
      })

    if (completeError) {
      console.error('Error completing daily task:', completeError)
      return NextResponse.json({ error: 'Failed to complete daily task' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error in complete daily task API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 