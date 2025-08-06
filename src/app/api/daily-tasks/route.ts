import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

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

    // If one-time tasks are not completed, return empty daily tasks
    if (!userData.tasks) {
      return NextResponse.json({
        tasks: {
          daily_1: { available: false, completed: false, timeRemaining: '' },
          daily_2: { available: false, completed: false, timeRemaining: '' }
        },
        nextReset: ''
      })
    }

    // Get daily tasks status
    const { data: dailyTasks, error: dailyError } = await supabase
      .rpc('check_daily_tasks_available', { user_uuid: userId })

    if (dailyError) {
      console.error('Error fetching daily tasks:', dailyError)
      return NextResponse.json({ error: 'Failed to fetch daily tasks' }, { status: 500 })
    }

    // Format the response
    const tasks = {
      daily_1: {
        available: false,
        completed: false,
        timeRemaining: ''
      },
      daily_2: {
        available: false,
        completed: false,
        timeRemaining: ''
      }
    }

    let nextReset = ''

    dailyTasks.forEach((task: { task_id: string; is_available: boolean; is_completed: boolean; time_remaining: string | null }) => {
      if (task.task_id === 'daily_1') {
        tasks.daily_1 = {
          available: task.is_available,
          completed: task.is_completed,
          timeRemaining: task.time_remaining ? formatInterval(task.time_remaining) : ''
        }
      } else if (task.task_id === 'daily_2') {
        tasks.daily_2 = {
          available: task.is_available,
          completed: task.is_completed,
          timeRemaining: task.time_remaining ? formatInterval(task.time_remaining) : ''
        }
      }

      if (task.time_remaining && task.time_remaining !== '0') {
        nextReset = formatInterval(task.time_remaining)
      }
    })

    return NextResponse.json({
      tasks,
      nextReset
    })

  } catch (error) {
    console.error('Error in daily tasks API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function formatInterval(interval: string): string {
  // Parse PostgreSQL interval format and convert to readable format
  const hours = Math.floor(parseInt(interval.split(':')[0]) || 0)
  const minutes = Math.floor(parseInt(interval.split(':')[1]) || 0)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m`
  } else {
    return 'Ready'
  }
} 