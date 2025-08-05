'use client'

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  twitter_id: string;
  username: string;
  display_name: string;
  profile_image_url: string;
  created_at: string;
  updated_at: string;
}

interface LeaderboardEntry {
  rank: number;
  user: string;
  handle: string;
  points: number;
  usda: string;
  isCurrentUser?: boolean;
  profileImage?: string;
  id: string;
}

// Define milestone tiers for calculation
const MILESTONE_TIERS = [
  { target: 100, reward: 350000, percentage: 35, name: 'TOP 1 - 100' },
  { target: 1000, reward: 250000, percentage: 25, name: 'TOP 101 - 1000' },
  { target: 2000, reward: 150000, percentage: 15, name: 'TOP 1,001 - 2,000' },
  { target: 5000, reward: 120000, percentage: 12, name: 'TOP 2,001 - 5,000' },
  { target: 10000, reward: 100000, percentage: 10, name: 'TOP 5,001 - 10,000' },
  { target: 20000, reward: 80000, percentage: 8, name: 'TOP 10,001 - 20,000' },
  { target: 50000, reward: 60000, percentage: 6, name: 'TOP 20,001 - 50,000' },
  { target: 100000, reward: 50000, percentage: 5, name: 'TOP 50,001 - 100,000' }
]

// Function to calculate tier rewards based on rank
function calculateTierRewards(rank: number): { additionalUsda: number } {
  let additionalUsda = 0
  
  // Find which tier the user belongs to based on rank
  for (const tier of MILESTONE_TIERS) {
    if (rank <= tier.target) {
      // Calculate reward per user in this tier (direct USDA amount)
      const rewardPerUser = tier.reward / tier.target
      additionalUsda = rewardPerUser // Direct USDA amount, no multiplication
      break
    }
  }
  
  return { additionalUsda }
}

// Function to abbreviate numbers
function abbreviateNumber(num: string): string {
  const number = parseInt(num.replace(/,/g, ''));
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }
  return num;
}

// Function to truncate text
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export default function Leaderboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Check authentication status via API
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
        
        // Get leaderboard data
        const leaderboardResponse = await fetch('/api/leaderboard');
        const leaderboardData = await leaderboardResponse.json();
        
        // Transform data to match our interface and add tier rewards
        const transformedData = leaderboardData.leaderboard.map((user: { 
          rank: number; 
          display_name: string; 
          username: string; 
          totalPoints: number; 
          totalUsda: string; 
          profile_image_url: string; 
          id: string; 
        }) => {
          // Calculate tier rewards based on rank
          const { additionalUsda } = calculateTierRewards(user.rank)
          
          // Add tier rewards only to USDA (not points)
          const totalUsdaWithTier = parseFloat(user.totalUsda) + additionalUsda
          
          return {
            rank: user.rank,
            user: user.display_name || user.username,
            handle: `@${user.username}`,
            points: user.totalPoints, // Keep original points
            usda: totalUsdaWithTier.toFixed(2),
            profileImage: user.profile_image_url,
            id: user.id,
            isCurrentUser: currentUser?.id === user.id
          }
        });
        
        // Sort data to put current user at the top
        const sortedData = transformedData.sort((a: LeaderboardEntry, b: LeaderboardEntry) => {
          if (a.isCurrentUser && !b.isCurrentUser) return -1;
          if (!a.isCurrentUser && b.isCurrentUser) return 1;
          return a.rank - b.rank;
        });
        
        setLeaderboardData(sortedData);
              } catch (error) {
          console.error('Error loading data:', error);
        }
      }

    loadData();
  }, [currentUser?.id]);

  return (
    <div className=" rounded-lg   mt-10 ">
      {/* Header */}
    

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full ">
          {/* Table Header */}
          <thead className="">
            <tr>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider sm:w-16 w-16">RANK</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider ">USER</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-20 sm:w-20">POINTS</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider sm:w-30 w-20">$USDA</th>
            </tr>
          </thead>
        </table>
        
        <div className="space-y-2">
          {leaderboardData.map((entry, index) => {
            // Determine background color based on rank
            let bgColor = 'bg-transparent';
            if (entry.isCurrentUser) {
              bgColor = 'bg-gray-800';
            } else if (entry.rank === 1) {
              bgColor = 'bg-[#f0f8f0]';
            } else if (entry.rank === 2) {
              bgColor = 'bg-[#e8f5e8]';
            } else if (entry.rank === 3) {
              bgColor = 'bg-[#f0f8f0]';
            }

            // Determine if this is a top 3 entry (excluding current user)
            const isTop3 = !entry.isCurrentUser && (entry.rank === 1 || entry.rank === 2 || entry.rank === 3);

            return (
              <div 
                key={entry.rank}
                className={`${bgColor} rounded-lg p-2  ${
                  entry.isCurrentUser ? 'text-white' : 'text-black'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-14 sm:w-16 text-xs sm:text-sm font-semibold flex-shrink-0 ${
                    entry.isCurrentUser ? 'text-[#D6E14E]' : 'text-gray-800'
                  }`}>
                    #{entry.rank}
                  </div>
                  <div className="flex-1 flex items-center min-w-0">
                    <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                      {entry.profileImage && entry.profileImage !== 'null' ? (
                        <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden ${
                          entry.isCurrentUser ? 'ring-2 ring-[#D6E14E]' : ''
                        }`}>
                          <Image
                            src={entry.profileImage}
                            alt={entry.user}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to avatar if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center ${
                            entry.isCurrentUser ? 'bg-gray-600' : 'bg-gray-300'
                          } hidden`}>
                            <span className={`text-xs sm:text-sm font-medium ${
                              entry.isCurrentUser ? 'text-white' : 'text-gray-700'
                            }`}>
                              {entry.user.charAt(0)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center ${
                          entry.isCurrentUser ? 'bg-gray-600' : 'bg-gray-300'
                        }`}>
                          <span className={`text-xs sm:text-sm font-medium ${
                            entry.isCurrentUser ? 'text-white' : 'text-gray-700'
                          }`}>
                            {entry.user.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                      <div className={`text-xs sm:text-sm font-semibold truncate ${
                        entry.isCurrentUser ? 'text-white' : 'text-gray-900'
                      }`}>
                        {truncateText(entry.user, 8)}
                      </div>
                      <div className={`text-xs sm:text-sm truncate ${
                        entry.isCurrentUser ? 'text-gray-200' : 'text-gray-600'
                      }`}>
                        {truncateText(entry.handle, 10)}
                      </div>
                    </div>
                  </div>
                  <div className={`w-16 sm:w-20 text-xs sm:text-sm font-semibold flex-shrink-0 flex items-center ${
                    entry.isCurrentUser ? 'text-[#D6E14E]' : 'text-gray-800'
                  }`}>
                    {isTop3 ? (
                      <span className="bg-[#D6E14E] text-black px-1 py-0.5 rounded inline-block">
                        {abbreviateNumber(entry.points.toString())}
                      </span>
                    ) : (
                      abbreviateNumber(entry.points.toString())
                    )}
                  </div>
                  <div className={`w-20 sm:w-24 text-xs sm:text-sm font-semibold text-right flex-shrink-0 flex items-center justify-end ${
                    entry.isCurrentUser ? 'text-[#D6E14E]' : 'text-gray-800'
                  }`}>
                    {isTop3 ? (
                      <span className="bg-[#D6E14E] text-black px-1 py-0.5 rounded inline-block">
                        ${entry.usda}
                      </span>
                    ) : (
                      <span>${entry.usda}</span>
                    )}
                    {entry.isCurrentUser && (
                      <svg className="ml-1 h-3 w-3 sm:h-4 sm:w-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 