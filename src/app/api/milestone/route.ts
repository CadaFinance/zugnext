import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Define milestone tiers
const MILESTONE_TIERS = [
  { target: 100, reward: 141750, percentage: 35, name: 'TOP 1 - 100' },
  { target: 1000, reward: 101250, percentage: 25, name: 'TOP 101 - 1000' },
  { target: 2000, reward: 60750, percentage: 15, name: 'TOP 1,001 - 2,000' },
  { target: 5000, reward: 40500, percentage: 10, name: 'TOP 2,001 - 5,000' },
  { target: 10000, reward: 28350, percentage: 7, name: 'TOP 5,001 - 10,000' },
  { target: 20000, reward: 20250, percentage: 5, name: 'TOP 10,001 - 20,000' },
  { target: 100000, reward: 12150, percentage: 3, name: 'TOP 20,001 - 100,000' }
]

export async function GET(_request: NextRequest) {
  try {
    // Get total users count
    const { count: totalUsers, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('Error getting users count:', countError)
      return NextResponse.json({ 
        totalUsers: 0, 
        targetUsers: 100,
        progressPercentage: 0,
        currentReward: '0',
        nextReward: '141,750',
        currentTier: 'TOP 1 - 100',
        nextTier: 'TOP 1 - 100'
      })
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
    
    // Calculate current and next rewards based on user count
    let currentReward = 0
    let nextReward = 0
    
    // Calculate current reward based on users in current tier
    if (userCount > 0) {
      if (currentTier.target === 100) {
        // First tier (0-100)
        const rewardPerUser = currentTier.reward / currentTier.target
        currentReward = Math.floor(rewardPerUser * userCount)
      } else {
        // Other tiers - calculate based on users in current tier
        const usersInCurrentTier = Math.min(userCount, currentTier.target)
        const rewardPerUser = currentTier.reward / currentTier.target
        currentReward = Math.floor(rewardPerUser * usersInCurrentTier)
      }
    }
    
    // Calculate next reward (full tier reward)
    nextReward = nextTier.reward
    
    // Calculate total rewards distributed so far
    let totalDistributedReward = 0
    for (const tier of MILESTONE_TIERS) {
      if (userCount >= tier.target) {
        totalDistributedReward += tier.reward
      } else if (userCount > 0) {
        // Add partial reward for current tier
        const usersInTier = Math.min(userCount, tier.target)
        const rewardPerUser = tier.reward / tier.target
        totalDistributedReward += Math.floor(rewardPerUser * usersInTier)
      }
    }

    return NextResponse.json({
      totalUsers: userCount,
      targetUsers: nextTier.target,
      progressPercentage: Math.round(progressPercentage * 100) / 100,
      currentReward: currentReward.toLocaleString(),
      nextReward: nextReward.toLocaleString(),
      currentTier: currentTier.name,
      nextTier: nextTier.name,
      totalDistributedReward: totalDistributedReward.toLocaleString()
    })
  } catch (error) {
    console.error('Error getting milestone data:', error)
    return NextResponse.json({ 
      totalUsers: 0, 
      targetUsers: 100,
      progressPercentage: 0,
      currentReward: '0',
      nextReward: '141,750',
      currentTier: 'TOP 1 - 100',
      nextTier: 'TOP 1 - 100'
    })
  }
} 