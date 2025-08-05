import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Define milestone tiers with corrected percentages
// Total reward pool: 1,160,000 $USDA
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
        nextReward: '350,000',
        currentTier: 'TOP 1 - 100',
        nextTier: 'TOP 1 - 100',
        totalDistributedReward: '0'
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
    
    // Calculate current reward based on users in current tier
    let currentReward = 0
    let nextReward = nextTier.reward
    
    if (userCount > 0) {
      if (currentTier.target === 100) {
        // First tier (0-100) - calculate based on current users
        const rewardPerUser = currentTier.reward / currentTier.target
        currentReward = Math.floor(rewardPerUser * userCount)
      } else {
        // Other tiers - calculate based on users in current tier
        const prevTier = MILESTONE_TIERS.find(t => t.target < currentTier.target) || MILESTONE_TIERS[0]
        const usersInCurrentTier = Math.min(userCount - prevTier.target, currentTier.target - prevTier.target)
        const rewardPerUser = currentTier.reward / (currentTier.target - prevTier.target)
        currentReward = Math.floor(rewardPerUser * usersInCurrentTier)
      }
    }
    
    // Calculate total rewards distributed so far
    let totalDistributedReward = 0
    let cumulativeUsers = 0
    
    for (const tier of MILESTONE_TIERS) {
      if (userCount >= tier.target) {
        // Tier is fully completed
        totalDistributedReward += tier.reward
        cumulativeUsers = tier.target
      } else if (userCount > cumulativeUsers) {
        // Partial tier completion
        const usersInTier = userCount - cumulativeUsers
        const tierSize = tier.target - cumulativeUsers
        const rewardPerUser = tier.reward / tierSize
        totalDistributedReward += Math.floor(rewardPerUser * usersInTier)
        break
      } else {
        break
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
      nextReward: '350,000',
      currentTier: 'TOP 1 - 100',
      nextTier: 'TOP 1 - 100',
      totalDistributedReward: '0'
    })
  }
} 