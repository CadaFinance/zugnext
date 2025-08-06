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

    let leaderboardData

    if (userId) {
      // User is logged in - get top 100 + current user
      const { data, error } = await supabase
        .rpc('get_leaderboard_with_current_user', {
          current_user_id: userId
        })

      if (error) {
        console.error('Error fetching leaderboard with current user:', error)
        // Fallback to top 100 only
        const { data: top100Data, error: top100Error } = await supabase
          .from('leaderboard_view')
          .select('*')
          .lte('rank', 100)
          .order('rank', { ascending: true })

        if (top100Error) {
          console.error('Error fetching top 100:', top100Error)
          return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
        }

        leaderboardData = top100Data.map((user: any) => ({
          rank: user.rank,
          display_name: user.display_name || user.username,
          username: user.username,
          totalPoints: user.total_points,
          totalUsda: user.total_usda.toFixed(2),
          profile_image_url: user.profile_image_url,
          id: user.id,
          isCurrentUser: false
        }))
      } else {
        // Transform data for logged in user
        leaderboardData = data.map((user: any) => ({
          rank: user.rank,
          display_name: user.display_name || user.username,
          username: user.username,
          totalPoints: user.total_points,
          totalUsda: user.total_usda.toFixed(2),
          profile_image_url: user.profile_image_url,
          id: user.id,
          isCurrentUser: user.is_current_user
        }))
      }
    } else {
      // User is not logged in - get top 100 only
      const { data, error } = await supabase
        .from('leaderboard_view')
        .select('*')
        .lte('rank', 100)
        .order('rank', { ascending: true })

      if (error) {
        console.error('Error fetching top 100:', error)
        return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
      }

      leaderboardData = data.map((user: any) => ({
        rank: user.rank,
        display_name: user.display_name || user.username,
        username: user.username,
        totalPoints: user.total_points,
        totalUsda: user.total_usda.toFixed(2),
        profile_image_url: user.profile_image_url,
        id: user.id,
        isCurrentUser: false
      }))
    }

    return NextResponse.json({
      leaderboard: leaderboardData,
      totalUsers: leaderboardData.length
    })

  } catch (error) {
    console.error('Error in leaderboard API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Endpoint to refresh materialized view (can be called by cron job)
export async function POST() {
  try {
    const { error } = await supabase.rpc('refresh_leaderboard')
    
    if (error) {
      console.error('Error refreshing leaderboard:', error)
      return NextResponse.json({ error: 'Failed to refresh leaderboard' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Leaderboard refreshed' })
  } catch (error) {
    console.error('Error refreshing leaderboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 