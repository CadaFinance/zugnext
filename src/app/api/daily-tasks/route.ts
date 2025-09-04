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

    // Parallel database queries for better performance
    const [userDataResult, dailyClaimResult] = await Promise.all([
      // Check if user has completed one-time tasks
      supabase
        .from('users')
        .select('tasks')
        .eq('id', userId)
        .single(),
      
      // Check if user has claimed daily rewards recently
      supabase
        .from('daily_tasks')
        .select('claimed_at, next_available_at')
        .eq('user_id', userId)
        .eq('task_id', 'daily_claim')
        .single()
    ])

    const { data: userData, error: userError } = userDataResult
    const { data: dailyClaim, error: claimError } = dailyClaimResult

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // If one-time tasks are not completed, return empty daily tasks
    if (!userData.tasks) {
      return NextResponse.json({
        tasks: {
          daily_1: { available: true, completed: false, timeRemaining: '' },
          daily_2: { available: true, completed: false, timeRemaining: '' },
          daily_3: { available: true, completed: false, timeRemaining: '' }
        },
        nextReset: ''
      })
    }

    let isAvailable = true
    let timeRemaining = ''

    if (dailyClaim && dailyClaim.claimed_at) {
      const nextAvailable = new Date(dailyClaim.next_available_at)
      const now = new Date()
      
      if (nextAvailable > now) {
        isAvailable = false
        const diff = nextAvailable.getTime() - now.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        timeRemaining = `${hours}h ${minutes}m`
      }
    }

    return NextResponse.json({
      tasks: {
        daily_1: { available: isAvailable, completed: false, timeRemaining },
        daily_2: { available: isAvailable, completed: false, timeRemaining },
        daily_3: { available: isAvailable, completed: false, timeRemaining }
      },
      nextReset: timeRemaining
    })

  } catch (error) {
    console.error('Error in daily tasks API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 