import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(_request: NextRequest) {
  try {
    // Get all users with their total points
    const { data: usersWithPoints, error } = await supabase
      .from('users')
      .select(`
        id,
        username,
        display_name,
        profile_image_url,
        user_points (
          points,
          usda_amount
        )
      `)
    
    if (error) {
      console.error('Error getting users with points:', error)
      return NextResponse.json({ leaderboard: [] })
    }
    
    // Calculate total points for each user
    const usersWithTotalPoints = usersWithPoints?.map(user => {
      const totalPoints = user.user_points?.reduce((sum: number, point: { points: number; usda_amount: string }) => sum + point.points, 0) || 0
      const totalUsda = user.user_points?.reduce((sum: number, point: { points: number; usda_amount: string }) => sum + parseFloat(point.usda_amount), 0) || 0
      
      return {
        id: user.id,
        username: user.username,
        display_name: user.display_name,
        profile_image_url: user.profile_image_url,
        totalPoints,
        totalUsda: totalUsda.toFixed(2)
      }
    }) || []
    
    // Sort by points (descending) and add rank
    const sortedUsers = usersWithTotalPoints
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }))
    
    return NextResponse.json({ leaderboard: sortedUsers })
  } catch (error) {
    console.error('Error getting leaderboard:', error)
    return NextResponse.json({ leaderboard: [] })
  }
} 