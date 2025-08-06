import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Define milestone tiers with corrected percentages
const MILESTONE_TIERS = [
  { target: 100, reward: 350000, percentage: 30.17, name: 'TOP 1 - 100' },
  { target: 1000, reward: 250000, percentage: 21.55, name: 'TOP 101 - 1000' },
  { target: 2000, reward: 150000, percentage: 12.93, name: 'TOP 1,001 - 2,000' },
  { target: 5000, reward: 120000, percentage: 10.34, name: 'TOP 2,001 - 5,000' },
  { target: 10000, reward: 100000, percentage: 8.62, name: 'TOP 5,100 - 10,000' },
  { target: 20000, reward: 80000, percentage: 6.90, name: 'TOP 10,001 - 20,000' },
  { target: 50000, reward: 60000, percentage: 5.17, name: 'TOP 20,001 - 50,000' },
  { target: 100000, reward: 50000, percentage: 4.31, name: 'TOP 50,001 - 100,000' }
]

export async function GET(request: NextRequest) {
  try {
    // Get the session token from cookies
    const sessionToken = request.cookies.get('session_token')?.value
    
    // Parallel execution of user auth check and milestone data
    const [userResult, milestoneResult] = await Promise.all([
      // Check user authentication
      (async () => {
        if (!sessionToken) {
          return { authenticated: false, user: null }
        }
        
        const { data: user, error } = await supabase
          .from('users')
          .select('id, twitter_id, username, display_name, profile_image_url, created_at, updated_at, tasks')
          .eq('session_token', sessionToken)
          .single()
        
        if (error || !user) {
          return { authenticated: false, user: null }
        }
        
        return { authenticated: true, user }
      })(),
      
      // Get milestone data
      (async () => {
        const { count: totalUsers, error: countError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
        
        if (countError) {
          console.error('Error getting users count:', countError)
          return {
            totalUsers: 0,
            targetUsers: 100,
            progressPercentage: 0,
            currentReward: '0',
            nextReward: '350,000',
            currentTier: 'TOP 1 - 100',
            nextTier: 'TOP 1 - 100',
            totalDistributedReward: '0'
          }
        }

        const userCount = totalUsers || 0
        
        // Find current milestone tier
        let currentTier = MILESTONE_TIERS[0]
        let nextTier = MILESTONE_TIERS[0]
        let progressPercentage = 0
        
        // Find which tier we're currently in
        if (userCount === 0) {
          currentTier = MILESTONE_TIERS[0]
          nextTier = MILESTONE_TIERS[0]
          progressPercentage = 0
        } else {
          for (let i = 0; i < MILESTONE_TIERS.length; i++) {
            const tier = MILESTONE_TIERS[i]
            
            if (userCount < tier.target) {
              // We're in the current tier
              currentTier = i === 0 ? MILESTONE_TIERS[0] : MILESTONE_TIERS[i - 1]
              nextTier = tier
              if (i === 0) {
                // First tier (0-100)
                progressPercentage = (userCount / tier.target) * 100
              } else {
                // Other tiers
                const prevTier = MILESTONE_TIERS[i - 1]
                progressPercentage = ((userCount - prevTier.target) / (tier.target - prevTier.target)) * 100
              }
              break
            } else if (userCount >= tier.target) {
              // We've completed this tier
              currentTier = tier
              nextTier = i < MILESTONE_TIERS.length - 1 ? MILESTONE_TIERS[i + 1] : tier
              progressPercentage = 100
            }
          }
        }
        
        // Calculate current reward based on users in current tier
        let currentReward = 0
        let nextReward = 0
        
        // Calculate cumulative rewards up to the next tier
        if (nextTier.target === 100) {
          nextReward = 350000 // Tier 1 only
        } else if (nextTier.target === 1000) {
          nextReward = 350000 + 250000 // Tier 1 + Tier 2
        } else if (nextTier.target === 2000) {
          nextReward = 350000 + 250000 + 150000 // Tier 1 + Tier 2 + Tier 3
        } else if (nextTier.target === 5000) {
          nextReward = 350000 + 250000 + 150000 + 120000 // Tier 1-4
        } else if (nextTier.target === 10000) {
          nextReward = 350000 + 250000 + 150000 + 120000 + 100000 // Tier 1-5
        } else if (nextTier.target === 20000) {
          nextReward = 350000 + 250000 + 150000 + 120000 + 100000 + 80000 // Tier 1-6
        } else if (nextTier.target === 50000) {
          nextReward = 350000 + 250000 + 150000 + 120000 + 100000 + 80000 + 60000 // Tier 1-7
        } else if (nextTier.target === 100000) {
          nextReward = 350000 + 250000 + 150000 + 120000 + 100000 + 80000 + 60000 + 50000 // Tier 1-8
        }
        
        if (userCount > 0) {
          if (userCount <= 100) {
            // Tier 1: current users * 3,500
            currentReward = userCount * 3500
          } else if (userCount <= 1000) {
            // Tier 1 completed + current tier 2 users
            currentReward = 350000 + (userCount - 100) * (250000 / 900)
          } else if (userCount <= 2000) {
            // Tier 1-2 completed + current tier 3 users
            currentReward = 350000 + 250000 + (userCount - 1000) * (150000 / 1000)
          } else if (userCount <= 5000) {
            // Tier 1-3 completed + current tier 4 users
            currentReward = 350000 + 250000 + 150000 + (userCount - 2000) * (120000 / 3000)
          } else if (userCount <= 10000) {
            // Tier 1-4 completed + current tier 5 users
            currentReward = 350000 + 250000 + 150000 + 120000 + (userCount - 5000) * (100000 / 5000)
          } else if (userCount <= 20000) {
            // Tier 1-5 completed + current tier 6 users
            currentReward = 350000 + 250000 + 150000 + 120000 + 100000 + (userCount - 10000) * (80000 / 10000)
          } else if (userCount <= 50000) {
            // Tier 1-6 completed + current tier 7 users
            currentReward = 350000 + 250000 + 150000 + 120000 + 100000 + 80000 + (userCount - 20000) * (60000 / 30000)
          } else if (userCount <= 100000) {
            // Tier 1-7 completed + current tier 8 users
            currentReward = 350000 + 250000 + 150000 + 120000 + 100000 + 80000 + 60000 + (userCount - 50000) * (50000 / 50000)
          } else {
            // All tiers completed
            currentReward = 350000 + 250000 + 150000 + 120000 + 100000 + 80000 + 60000 + 50000
          }
        }
        
        // Calculate total rewards distributed so far
        let totalDistributedReward = 0
        
        if (userCount <= 100) {
          // Tier 1: 350,000 / 100 = 3,500 per user
          totalDistributedReward = userCount * 3500
        } else if (userCount <= 1000) {
          // Tier 1 completed + Tier 2 partial
          totalDistributedReward = 350000 + (userCount - 100) * (250000 / 900)
        } else if (userCount <= 2000) {
          // Tier 1 + Tier 2 completed + Tier 3 partial
          totalDistributedReward = 350000 + 250000 + (userCount - 1000) * (150000 / 1000)
        } else if (userCount <= 5000) {
          // Tier 1 + Tier 2 + Tier 3 completed + Tier 4 partial
          totalDistributedReward = 350000 + 250000 + 150000 + (userCount - 2000) * (120000 / 3000)
        } else if (userCount <= 10000) {
          // Tier 1-4 completed + Tier 5 partial
          totalDistributedReward = 350000 + 250000 + 150000 + 120000 + (userCount - 5000) * (100000 / 5000)
        } else if (userCount <= 20000) {
          // Tier 1-5 completed + Tier 6 partial
          totalDistributedReward = 350000 + 250000 + 150000 + 120000 + 100000 + (userCount - 10000) * (80000 / 10000)
        } else if (userCount <= 50000) {
          // Tier 1-6 completed + Tier 7 partial
          totalDistributedReward = 350000 + 250000 + 150000 + 120000 + 100000 + 80000 + (userCount - 20000) * (60000 / 30000)
        } else if (userCount <= 100000) {
          // Tier 1-7 completed + Tier 8 partial
          totalDistributedReward = 350000 + 250000 + 150000 + 120000 + 100000 + 80000 + 60000 + (userCount - 50000) * (50000 / 50000)
        } else {
          // All tiers completed
          totalDistributedReward = 350000 + 250000 + 150000 + 120000 + 100000 + 80000 + 60000 + 50000
        }

        return {
          totalUsers: userCount,
          targetUsers: nextTier.target,
          progressPercentage: Math.round(progressPercentage * 100) / 100,
          currentReward: Math.floor(currentReward).toLocaleString(),
          nextReward: Math.floor(nextReward).toLocaleString(),
          currentTier: currentTier.name,
          nextTier: nextTier.name,
          totalDistributedReward: Math.floor(totalDistributedReward).toLocaleString()
        }
      })()
    ])

    return NextResponse.json({
      user: userResult,
      milestone: milestoneResult
    })
  } catch (error) {
    console.error('Error in dashboard API:', error)
    return NextResponse.json({
      user: { authenticated: false, user: null },
      milestone: {
        totalUsers: 0,
        targetUsers: 100,
        progressPercentage: 0,
        currentReward: '0',
        nextReward: '350,000',
        currentTier: 'TOP 1 - 100',
        nextTier: 'TOP 1 - 100',
        totalDistributedReward: '0'
      }
    })
  }
} 