'use client'

import Image from 'next/image';
import Header from '@/components/Header';
import Leaderboard from '@/components/Leaderboard';
import Tasks from '@/components/Tasks';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import { useEffect, useState, useCallback, useMemo } from 'react';

interface User {
  id: string;
  twitter_id: string;
  username: string;
  display_name: string;
  profile_image_url: string;
  created_at: string;
  updated_at: string;
}

interface MilestoneData {
  totalUsers: number;
  targetUsers: number;
  progressPercentage: number;
  currentReward: string;
  nextReward: string;
  currentTier: string;
  nextTier: string;
  totalDistributedReward: string;
}

export default function MindsharePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'tasks'>('leaderboard')
  const [milestoneData, setMilestoneData] = useState<MilestoneData>({
    totalUsers: 0,
    targetUsers: 100,
    progressPercentage: 0,
    currentReward: '0',
    nextReward: '141,750',
    currentTier: 'TOP 1 - 100',
    nextTier: 'TOP 1 - 100',
    totalDistributedReward: '0'
  })

  // Memoized data loading function
  const loadDashboardData = useCallback(async () => {
    try {
      const response = await fetch('/api/dashboard')
      const data = await response.json()
      
      if (data.user.authenticated && data.user.user) {
        setUser(data.user.user)
      }
      
      if (data.milestone) {
        setMilestoneData(data.milestone)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  const handleConnectTwitter = () => {
    // Redirect to OAuth
    window.location.href = '/api/auth/twitter';
  };

  // Memoized referral link
  const referralLink = useMemo(() => {
    if (user && typeof window !== 'undefined') {
      return `${window.location.origin}/boost/${user.username}`;
    }
    return '';
  }, [user]);

  const copyReferralLink = useCallback(async () => {
    if (referralLink) {
      try {
        await navigator.clipboard.writeText(referralLink);
        // Use a more modern approach instead of alert
        const event = new CustomEvent('showToast', { 
          detail: { message: 'Referral link copied!', type: 'success' } 
        });
        window.dispatchEvent(event);
      } catch (error) {
        console.error('Failed to copy link:', error);
      }
    }
  }, [referralLink]);

  return (
    <div className="bg-white min-h-screen relative">
      {/* Background Pattern - Full Viewport */}
      <div className="fixed inset-0 opacity-15 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #132a13 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, #132a13 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <Header fullWidth={true} showOnlyX={true}  />
      
      <div className="relative z-10 mx-auto px-2 min-h-screen lg:px-8 lg:py-35 py-30 w-full">
        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Reward Tiers with Bento Grid (80% width) */}
          <div className="lg:col-span-4">
            <div className="grid gap-2 lg:grid-cols-2 lg:grid-rows-3 h-full">
              {/* Top Section - Two Large Cards */}
              <div className="lg:col-span-2 lg:row-span-1 grid grid-cols-2 gap-2">
                {/* TOP 1 - 100 */}
                <div className="relative"> 
                  <div className="absolute inset-px rounded-lg bg-[#f2f6c9]" />
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                    <div className="px-6 pt-6 pb-3 sm:px-8 sm:pt-8 sm:pb-0 flex flex-col items-center justify-center h-full">
                                              <p className="text-lg sm:text-2xl tracking-tight text-black text-center ">
                          TOP 1 - 100
                        </p>
                      <div className="bg-[#D6E14E] text-black px-6 py-3 rounded-lg mb-2">
                        <span className="font-bold text-2xl sm:text-5xl">350,000 $USDZ </span>
                      </div>
                                              <p className="text-gray-600 text-center text-sm sm:text-xl">
                          30.17% Rewards
                        </p>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5" />
                </div>

                {/* TOP 101 - 1000 */}
                <div className="relative">
                  <div className="absolute inset-px rounded-lg bg-[#eaf0a6]" />
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                    <div className="px-6 pt-6 pb-3 sm:px-8 sm:pt-8 sm:pb-0 flex flex-col items-center justify-center h-full">
                                              <p className="text-lg sm:text-2xl tracking-tight text-black text-center ">
                          TOP 101 - 1000
                        </p>
                      <div className="bg-[#D6E14E] text-black px-6 py-3 rounded-lg mb-2">
                        <span className="font-bold text-2xl sm:text-5xl">250,000 $USDZ</span>
                      </div>
                                              <p className="text-gray-600 text-center text-sm sm:text-xl">
                          21.55% Rewards
                        </p>
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5" />
                </div>
              </div>

              {/* Bottom Section - 6 Smaller Cards in 3 Columns */}
              <div className="lg:col-span-2 lg:row-span-2 grid grid-cols-1 lg:grid-cols-3 gap-2">
                {/* TOP 7,500 - 10,000 - Full width on mobile */}
                <div className="lg:col-span-1 col-span-1">
                  <div className="relative h-full">
                    <div className="absolute inset-px rounded-lg bg-[#e6ed94]" />
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                      <div className="px-4 pt-4 sm:px-6 sm:pt-6 flex flex-col items-center justify-center h-full">
                        <p className="text-sm sm:text-xl tracking-tight text-black text-center">TOP 1,001 - 2,000</p>
                        <div className="text-black px-3 py-2 mb-2">
                          <span className="font-bold text-lg sm:text-4xl">150,000 $USDZ</span>
                        </div>
                        <p className="text-sm sm:text-2xl text-gray-600 text-center">12.93% Rewards</p>
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5" />
                  </div>
                </div>

                {/* Middle Column - 2 cards stacked vertically */}
                <div className="lg:col-span-1 col-span-1 grid grid-cols-2 lg:flex lg:flex-col gap-2">
                  {/* TOP 1,001 - 2,000 */}
                  <div className="relative flex-1">
                    <div className="absolute inset-px rounded-lg bg-[#dae45f]" />
                                          <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                        <div className="px-3 pt-3 sm:px-4 sm:pt-4 flex flex-col items-center justify-center h-full">
                          <p className="text-xs sm:text-lg tracking-tight text-black text-center ">TOP 2,001 - 5,000</p>
                          <div className="text-black px-2 py-1 mb-1">
                            <span className="font-bold text-sm sm:text-3xl">120,000 $USDZ</span>
                          </div>
                          <p className="text-xs sm:text-lg text-gray-600 text-center">10.34% Rewards</p>
                        </div>
                      </div>
                    <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5" />
                  </div>

                  {/* TOP 2,100 - 5,000 */}
                  <div className="relative flex-1">
                <div className="absolute inset-px rounded-lg bg-[#dae45f]" />
                                          <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                        <div className="px-3 pt-3 sm:px-4 sm:pt-4 flex flex-col items-center justify-center h-full">
                          <p className="text-xs sm:text-lg tracking-tight text-black text-center ">TOP 5,100 - 10,000</p>
                          <div className="text-black px-2 py-1 mb-1">
                            <span className="font-bold text-sm sm:text-3xl">100,000 $USDZ</span>
                          </div>
                          <p className="text-xs sm:text-lg text-gray-600 text-center">8.62% Rewards</p>
                        </div>
                      </div>
                    <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5" />
                  </div>
                </div>

                {/* Right Column - 3 cards stacked vertically */}
                <div className="lg:col-span-1 col-span-1 grid grid-cols-2 lg:flex lg:flex-col gap-2">
                  {/* TOP 5,100 - 10,000 */}
                  <div className="relative flex-1">
                    <div className="absolute inset-px rounded-lg bg-[#f2f6c9]" />
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                      <div className="px-3 pt-3 sm:px-4 sm:pt-4 flex flex-col items-center justify-center h-full">
                        <p className="text-xs sm:text-sm tracking-tight text-black text-center ">TOP 10,001 - 20,000</p>
                        <div className="text-black px-2 py-1 mb-1">
                          <span className="font-bold text-xs sm:text-2xl">80,000 $USDZ</span>
                        </div>
                        <p className="text-xs text-gray-600 text-center">6.90% Rewards</p>
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5" />
                  </div>

                  {/* TOP 20,001 - 50,000 */}
                  <div className="relative flex-1">
                    <div className="absolute inset-px rounded-lg bg-[#f2f6c9]" />
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                      <div className="px-3 pt-3 sm:px-4 sm:pt-4 flex flex-col items-center justify-center h-full">
                        <p className="text-xs sm:text-sm tracking-tight text-black text-center ">TOP 20,001 - 50,000</p>
                        <div className="text-black px-2 py-1 mb-1">
                          <span className="font-bold text-xs sm:text-2xl">60,000 $USDZ</span>
                        </div>
                        <p className="text-xs text-gray-600 text-center">5.17% Rewards</p>
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5" />
                  </div>

                  {/* TOP 50,001 - 100,000 */}
                  <div className="relative flex-1 col-span-2 lg:col-span-1">
                    <div className="absolute inset-px rounded-lg bg-[#f2f6c9]" />
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                      <div className="px-3 pt-3 sm:px-4 sm:pt-4 flex flex-col items-center justify-center h-full">
                        <p className="text-xs sm:text-sm font-medium tracking-tight text-black text-center ">TOP 50,001 - 100,000</p>
                        <div className="text-black px-2 py-1 mb-1">
                          <span className="font-bold text-xs sm:text-2xl">50,000 $USDZ</span>
                        </div>
                        <p className="text-xs text-gray-600 text-center">4.31% Rewards</p>
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Season Rewards & Milestone (20% width) */}
          <div className="lg:col-span-1 space-y-8">
            {/* Season 1 Rewards */}
            <div className="Season 1 Rewards rounded-lg  ">
              <div className="flex items-center mb-0">
              <div className="w-3 h-3 bg-[#D6E14E] rounded-full mr-3"></div>

                <h3 className="text-lg font-bold text-left text-black">Season 1 Rewards</h3>
              </div>
                              <div className="text-5xl sm:text-4xl mt-2 font-bold text-black mb-6 text-left">1,160,000 $USDZ</div>
              
              {/* Rewards Character */}
              <div className="relative h-48 flex items-center justify-center">
                <Image
                  src="/Group 5208.png"
                  alt="Rewards Character"
                  width={200}
                  height={200}
                  className="object-contain"
                  priority
                  loading="eager"
                />
              </div>
            </div>

        

            {/* Milestone */}
            <div className=" rounded-lg  ">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-[#D6E14E] rounded-full mr-3"></div>
                <h3 className="text-lg font-bold text-black">Milestone</h3>
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  <div className="w-full bg-gray-200 rounded h-6 animate-pulse"></div>
                  <div className="flex justify-between">
                    <div className="bg-gray-200 animate-pulse h-4 rounded w-20"></div>
                    <div className="bg-gray-200 animate-pulse h-4 rounded w-24"></div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded h-6 mb-4 relative">
                    <div 
                      className="bg-[#D6E14E] h-6 p-2 rounded"
                      style={{ width: `${milestoneData.progressPercentage}%` }}
                    >
                    </div>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">
                      {milestoneData.totalUsers.toLocaleString()}/{milestoneData.targetUsers.toLocaleString()} Users
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm font-semibold text-black">
                    <span>{milestoneData.currentReward} $USDZ</span>
                    <span className="bg-[#D6E14E] px-2 py-1 rounded">{milestoneData.nextReward} $USDZ</span>
                  </div>
                </>
              )}
            </div> 

            {/* Invite Friends */}
            <div className=" rounded-lg  ">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-[#D6E14E] rounded-full mr-3"></div>
                <h3 className="text-lg font-bold text-black">Invite friends</h3>
              </div>
              
              {loading ? (
                <div className="space-y-3">
                  <div className="bg-gray-200 animate-pulse h-20 rounded-lg"></div>
                  <div className="bg-gray-200 animate-pulse h-4 rounded w-3/4"></div>
                </div>
              ) : user ? (
                <div className="space-y-3">
                  <div className="bg-[#D6E14E] text-black px-4 py-3 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Your Referral Link:</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={referralLink}
                        readOnly
                        className="flex-1 bg-black text-white px-3 py-2 rounded text-sm"
                      />
                      <button
                        onClick={copyReferralLink}
                        className="bg-black text-[#D6E14E] px-3 py-2 rounded text-sm font-bold hover:bg-gray-800 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    Share this link to earn 100 points for each new user you refer!
                  </p>
                </div>
              ) : (
                <button 
                  onClick={handleConnectTwitter}
                  className="bg-black w-full text-[#D6E14E] px-6 py-3 rounded-lg font-bold transition-colors hover:bg-gray-800"
                >
                  Connect your X
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="-mb-10 mt-20">
          <div className="flex space-x-1 bg-[#132a13]/50 rounded-lg p-1 border border-[#D6E14E]/20">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'leaderboard'
                  ? 'bg-[#D6E14E] text-black shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Leaderboard</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'tasks'
                  ? 'bg-[#D6E14E] text-black shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span>Tasks</span>
              </div>
            </button>
          </div> 
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'leaderboard' ? (
            <Leaderboard />
          ) : (
            <Tasks referralLink={referralLink} />
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <div id="toast" className="fixed top-4 right-4 z-50 hidden">
        <div className="bg-black text-[#D6E14E] px-4 py-2 rounded-lg shadow-lg">
          <span id="toast-message"></span>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>

      <script dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener('showToast', function(event) {
            const toast = document.getElementById('toast');
            const message = document.getElementById('toast-message');
            if (toast && message) {
              message.textContent = event.detail.message;
              toast.classList.remove('hidden');
              setTimeout(() => {
                toast.classList.add('hidden');
              }, 3000);
            }
          });
        `
      }} />
      
      <PerformanceMonitor />
    </div>
  );
} 