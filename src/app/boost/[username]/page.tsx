'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface User {
  id: string;
  twitter_id: string;
  username: string;
  display_name: string;
  profile_image_url: string;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  params: Promise<{
    username: string
  }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function BoostPage({ params }: PageProps) {
  const [referrer, setReferrer] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string>('')

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params
      setUsername(resolvedParams.username)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (!username) return

    async function checkReferrer() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .single()

        if (error) {
          console.error('Error fetching referrer:', error)
          return
        }

        setReferrer(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkReferrer()
  }, [username])

  const handleConnectTwitter = () => {
    // Redirect to OAuth with referrer ID
    window.location.href = `/api/auth/twitter?ref=${username}`
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

  if (!referrer) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Invite Link</h1>
          <p className="text-gray-400">This invite link is not valid.</p>
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
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          {/* Referrer Info */}
          <div className="bg-[#132a13] rounded-lg p-6 mb-6 border-2 border-[#D6E14E]">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[#D6E14E] rounded-full flex items-center justify-center mr-4">
                <span className="text-black font-bold text-lg">
                  {referrer.display_name?.charAt(0) || referrer.username?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#D6E14E]">
                  {referrer.display_name || referrer.username}
                </h2>
                <p className="text-gray-400">@{referrer.username}</p>
              </div>
            </div>
            <p className="text-white text-sm">
              You&apos;ve been invited by {referrer.display_name || referrer.username}! 
              Connect your X account to earn rewards.
            </p>
          </div>

          {/* Rewards Info */}
          <div className="bg-[#132a13] rounded-lg p-6 mb-6 border-2 border-[#D6E14E]">
            <h3 className="text-lg font-bold text-[#D6E14E] mb-4">Rewards</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white">You get:</span>
                <span className="text-[#D6E14E] font-bold">50 points + 0.125 $USDA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white">{referrer.display_name || referrer.username} gets:</span>
                <span className="text-[#D6E14E] font-bold">100 points + 0.25 $USDA</span>
              </div>
            </div>
          </div>

          {/* Connect Button */}
          <button
            onClick={handleConnectTwitter}
            className="w-full bg-[#D6E14E] text-black font-bold py-4 px-6 rounded-lg text-lg hover:bg-[#b8c93e] transition-colors"
          >
            Connect your X
          </button>

          {/* Terms */}
          <p className="text-gray-400 text-xs text-center mt-4">
            By connecting your X account, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  )
} 