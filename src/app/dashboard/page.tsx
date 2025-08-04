'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [points, setPoints] = useState<any[]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [totalUsda, setTotalUsda] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUserData() {
      try {
        // In a real app, you'd get the user from auth context
        // For now, we'll simulate getting the current user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          // Redirect to login if no user
          window.location.href = '/'
          return
        }

        // Get user data
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('twitter_id', user.id)
          .single()

        if (userData) {
          setUser(userData)

          // Get user points
          const { data: pointsData } = await supabase
            .from('user_points')
            .select('*')
            .eq('user_id', userData.id)
            .order('created_at', { ascending: false })

          if (pointsData) {
            setPoints(pointsData)
            
            // Calculate totals
            const totalP = pointsData.reduce((sum, p) => sum + p.points, 0)
            const totalU = pointsData.reduce((sum, p) => sum + parseFloat(p.usda_amount), 0)
            
            setTotalPoints(totalP)
            setTotalUsda(totalU)
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  const copyReferralLink = () => {
    if (user) {
      const link = `${window.location.origin}/boost/${user.username}`
      navigator.clipboard.writeText(link)
      alert('Referral link copied!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D6E14E] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Not Found</h1>
          <p className="text-gray-400">User not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black text-white py-2 overflow-hidden">
        <div className="flex items-center">
          <span className="inline-block px-4 font-bold text-sm whitespace-nowrap bg-black relative z-10">
            LATEST PURCHASES
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="scroll-animation whitespace-nowrap">
              <span className="inline-block px-4">
                [0x1234...] bought 50K $ZUG worth $625.00 [0x5678...] bought 25K $ZUG worth $312.50 [0x9abc...] bought 100K $ZUG worth $1,250.00
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .scroll-animation {
          animation: scroll 10s linear infinite;
          display: flex;
        }
      `}</style>

      {/* Main Content */}
      <div className="pt-16 min-h-screen">
        <div className="max-w-4xl mx-auto p-6">
          {/* User Info */}
          <div className="bg-[#132a13] rounded-lg p-6 mb-6 border-2 border-[#D6E14E]">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-[#D6E14E] rounded-full flex items-center justify-center mr-4">
                <span className="text-black font-bold text-2xl">
                  {user.display_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#D6E14E]">
                  {user.display_name || user.username}
                </h1>
                <p className="text-gray-400">@{user.username}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-[#132a13] rounded-lg p-6 border-2 border-[#D6E14E]">
              <h3 className="text-lg font-bold text-[#D6E14E] mb-2">Total Points</h3>
              <p className="text-3xl font-bold text-white">{totalPoints.toLocaleString()}</p>
            </div>
            <div className="bg-[#132a13] rounded-lg p-6 border-2 border-[#D6E14E]">
              <h3 className="text-lg font-bold text-[#D6E14E] mb-2">Total $USDA</h3>
              <p className="text-3xl font-bold text-white">{totalUsda.toFixed(3)}</p>
            </div>
          </div>

          {/* Referral Link */}
          <div className="bg-[#132a13] rounded-lg p-6 mb-6 border-2 border-[#D6E14E]">
            <h3 className="text-lg font-bold text-[#D6E14E] mb-4">Your Referral Link</h3>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/boost/${user.username}`}
                readOnly
                className="flex-1 bg-black text-white px-4 py-2 rounded border border-gray-600"
              />
              <button
                onClick={copyReferralLink}
                className="bg-[#D6E14E] text-black font-bold px-4 py-2 rounded hover:bg-[#b8c93e] transition-colors"
              >
                Copy
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Share this link to earn 100 points for each new user you refer!
            </p>
          </div>

          {/* Points History */}
          <div className="bg-[#132a13] rounded-lg p-6 border-2 border-[#D6E14E]">
            <h3 className="text-lg font-bold text-[#D6E14E] mb-4">Points History</h3>
            <div className="space-y-3">
              {points.map((point) => (
                <div key={point.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                  <div>
                    <p className="text-white font-semibold">
                      +{point.points} points (+{point.usda_amount} $USDA)
                    </p>
                    <p className="text-gray-400 text-sm">
                      {point.source === 'signup' ? 'Sign up bonus' : 
                       point.source === 'referral' ? 'Referral bonus' : point.source}
                    </p>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {new Date(point.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {points.length === 0 && (
                <p className="text-gray-400 text-center py-4">No points earned yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 