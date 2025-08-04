'use client'

import Image from 'next/image';
import Header from '@/components/Header';
import Leaderboard from '@/components/Leaderboard';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface User {
  id: string;
  twitter_id: string;
  username: string;
  display_name: string;
  profile_image_url: string;
  created_at: string;
  updated_at: string;
}

export default function MindsharePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUserAuth() {
      try {
        // Check if user is authenticated with Supabase
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          // Get user data from our users table
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('twitter_id', authUser.id)
            .single();

          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error checking user auth:', error);
      } finally {
        setLoading(false);
      }
    }

    checkUserAuth();
  }, []);

  const handleConnectTwitter = () => {
    // Redirect to OAuth
    window.location.href = '/api/auth/twitter';
  };

  const copyReferralLink = () => {
    if (user) {
      const link = `${window.location.origin}/boost/${user.username}`;
      navigator.clipboard.writeText(link);
      alert('Referral link copied!');
    }
  };

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

      <Header fullWidth={true} showOnlyX={true} />
      
      <div className="relative z-10 mx-auto px-2 min-h-screen lg:px-8 py-20 w-full">
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
                        <span className="font-bold text-2xl sm:text-5xl">141,750 $USDA</span>
                      </div>
                                              <p className="text-gray-600 text-center text-sm sm:text-xl">
                          35% Rewards
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
                        <span className="font-bold text-2xl sm:text-5xl">101,250 $USDA</span>
                      </div>
                                              <p className="text-gray-600 text-center text-sm sm:text-xl">
                          25% Rewards
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
                        <p className="text-sm sm:text-xl tracking-tight text-black text-center">TOP 7,500 - 10,000</p>
                        <div className="text-black px-3 py-2 mb-2">
                          <span className="font-bold text-lg sm:text-4xl">15,750 $USDA</span>
                        </div>
                        <p className="text-sm sm:text-2xl text-gray-600 text-center">4% Rewards</p>
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
                        <p className="text-xs sm:text-lg tracking-tight text-black text-center ">TOP 1,001 - 2,000</p>
                        <div className="text-black px-2 py-1 mb-1">
                          <span className="font-bold text-sm sm:text-3xl">60,750 $USDA</span>
                        </div>
                        <p className="text-xs sm:text-lg text-gray-600 text-center">15% Rewards</p>
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5" />
                  </div>

                  {/* TOP 2,100 - 5,000 */}
                  <div className="relative flex-1">
                <div className="absolute inset-px rounded-lg bg-[#dae45f]" />
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                      <div className="px-3 pt-3 sm:px-4 sm:pt-4 flex flex-col items-center justify-center h-full">
                        <p className="text-xs sm:text-lg tracking-tight text-black text-center ">TOP 2,100 - 5,000</p>
                        <div className="text-black px-2 py-1 mb-1">
                          <span className="font-bold text-sm sm:text-3xl">40,500 $USDA</span>
                        </div>
                        <p className="text-xs sm:text-lg text-gray-600 text-center">10% Rewards</p>
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
                        <p className="text-xs sm:text-sm tracking-tight text-black text-center ">TOP 5,100 - 10,000</p>
                        <div className="text-black px-2 py-1 mb-1">
                          <span className="font-bold text-xs sm:text-2xl">28,350 $USDA</span>
                        </div>
                        <p className="text-xs text-gray-600 text-center">7% Rewards</p>
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5" />
                  </div>

                  {/* TOP 10,001 - 20,000 */}
                  <div className="relative flex-1">
                    <div className="absolute inset-px rounded-lg bg-[#f2f6c9]" />
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                      <div className="px-3 pt-3 sm:px-4 sm:pt-4 flex flex-col items-center justify-center h-full">
                        <p className="text-xs sm:text-sm tracking-tight text-black text-center ">TOP 10,001 - 20,000</p>
                        <div className="text-black px-2 py-1 mb-1">
                          <span className="font-bold text-xs sm:text-2xl">20,250 $USDA</span>
                        </div>
                        <p className="text-xs text-gray-600 text-center">5% Rewards</p>
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5" />
                  </div>

                  {/* TOP 20,001 - 100,000 */}
                  <div className="relative flex-1 col-span-2 lg:col-span-1">
                    <div className="absolute inset-px rounded-lg bg-[#f2f6c9]" />
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
                      <div className="px-3 pt-3 sm:px-4 sm:pt-4 flex flex-col items-center justify-center h-full">
                        <p className="text-xs sm:text-sm font-medium tracking-tight text-black text-center ">TOP 20,001 - 100,000</p>
                        <div className="text-black px-2 py-1 mb-1">
                          <span className="font-bold text-xs sm:text-2xl">12,150 $USDA</span>
                        </div>
                        <p className="text-xs text-gray-600 text-center">3% Rewards</p>
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
            {/* Season 2 Rewards */}
            <div className="Season 2 Rewards rounded-lg  ">
              <div className="flex items-center mb-0">
              <div className="w-3 h-3 bg-[#D6E14E] rounded-full mr-3"></div>

                <h3 className="text-lg font-bold text-left text-black">Season 2 Rewards</h3>
              </div>
                              <div className="text-5xl sm:text-5xl mt-2 font-bold text-black mb-6 text-left">390,000 $USDA</div>
              
              {/* Rewards Character */}
              <div className="relative h-48 flex items-center justify-center">
                <Image
                  src="/Group 5208.png"
                  alt="Rewards Character"
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Milestone */}
            <div className=" rounded-lg  ">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-[#D6E14E] rounded-full mr-3"></div>
                <h3 className="text-lg font-bold text-black">Milestone</h3>
              </div>
              
              {/* Progress Bar */}
                              <div className="w-full bg-gray-200 rounded h-6 mb-4 relative">
                  <div 
                    className="bg-[#D6E14E] h-6 p-2 rounded"
                    style={{ width: '69%' }}
                  >
                  </div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-black">
                    113,804/115,000 Users
                  </span>
                </div>
              
              <div className="flex justify-between text-sm font-semibold text-black">
                <span>390,000 $USDA</span>
                <span className="bg-[#D6E14E] px-2 py-1 rounded">405,000 $USDA</span>
              </div>
            </div>

            {/* Invite Friends */}
            <div className=" rounded-lg  ">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-[#D6E14E] rounded-full mr-3"></div>
                <h3 className="text-lg font-bold text-black">Invite friends</h3>
              </div>
              
              {loading ? (
                <div className="bg-gray-200 w-full text-gray-500 px-6 py-3 rounded-lg font-bold">
                  Loading...
                </div>
              ) : user ? (
                <div className="space-y-3">
                  <div className="bg-[#D6E14E] text-black px-4 py-3 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Your Referral Link:</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/boost/${user.username}`}
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

        {/* Leaderboard Section */}
        <div >
          <Leaderboard />
        </div>
      </div>
    </div>
  );
} 