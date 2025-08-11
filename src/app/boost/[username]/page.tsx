import type { Metadata } from 'next'
import { useEffect, useState } from 'react'
import Image from 'next/image'

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

// SEO Metadata for social media sharing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const username = resolvedParams.username
  
  return {
    title: `Join ZUG Community - Invited by @${username}`,
    description: `You've been invited by @${username} to join the ZUG community! Connect your X account and earn 50 points. The fastest Ethereum Layer 2 chain with scalability and speed.`,
    keywords: ['ZUG', 'Ethereum', 'Layer 2', 'Blockchain', 'Crypto', 'Referral', 'Rewards'],
    authors: [{ name: 'ZUG Protocol' }],
    creator: 'ZUG Protocol',
    publisher: 'ZUG Protocol',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://zug-opal.vercel.app'),
    alternates: {
      canonical: `/boost/${username}`,
    },
    openGraph: {
      title: `Join ZUG Community - Invited by @${username}`,
      description: `You've been invited by @${username} to join the ZUG community! Connect your X account and earn 50 points.`,
      url: `https://zug-opal.vercel.app/boost/${username}`,
      siteName: 'ZUG Protocol',
      images: [
        {
          url: '/Group 5195.png', // ZUG logo
          width: 1200,
          height: 630,
          alt: 'ZUG Protocol - Ethereum Layer 2',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Join ZUG Community - Invited by @${username}`,
      description: `You've been invited by @${username} to join the ZUG community! Connect your X account and earn 50 points.`,
      images: ['/Group 5195.png'],
      creator: '@ZUGProtocol',
      site: '@ZUGProtocol',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

'use client'

export default function BoostPage({ params }: PageProps) {
  const [referrer, setReferrer] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string>('')
  const [isConnecting, setIsConnecting] = useState(false)

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
        console.log('Checking for username:', username)
        const response = await fetch(`/api/user/${username}`)
        const data = await response.json()

        console.log('API response:', data)

        if (data.error) {
          console.error('Error fetching referrer:', data.error)
          setReferrer(null)
        } else {
          console.log('Referrer found:', data.user)
          setReferrer(data.user)
        }
      } catch (error) {
        console.error('Error:', error)
        setReferrer(null)
      } finally {
        setLoading(false)
      }
    }

    checkReferrer()
  }, [username])

  const handleConnectTwitter = () => {
    setIsConnecting(true)
    // Redirect to OAuth with referrer ID
    window.location.href = `/api/auth/twitter?ref=${username}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #D6E14E 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, #D6E14E 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#D6E14E] border-t-transparent mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-[#D6E14E] opacity-20"></div>
          </div>
          <p className="text-lg font-semibold text-[#D6E14E]">Loading invitation...</p>
        </div>
      </div>
    )
  }

  if (!referrer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #D6E14E 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, #D6E14E 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="text-center relative z-10 max-w-sm mx-auto p-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-3 text-red-400">Invalid Invite Link</h1>
            <p className="text-gray-400 text-sm">This invitation link is not valid or has expired.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="mt-4 bg-[#D6E14E] text-black font-bold py-2 px-4 rounded-lg hover:bg-[#b8c93e] transition-all duration-300 transform hover:scale-105 text-sm"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #D6E14E 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, #D6E14E 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm text-white py-2 border-b border-[#D6E14E]/20">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center">
            <Image
              alt="Logo"
              src="/Group 5195.png"
              width={24}
              height={24}
              className="mr-2"
            />
            <span className="text-lg font-bold text-[#D6E14E]">ZUG</span>
          </div>
          <div className="text-xs text-gray-400">
            Referral Program
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full mx-auto">
          {/* Success Animation */}
          <div className="text-center mb-6 animate-fade-in">
            <div className="w-16 h-16 bg-[#D6E14E]/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-[#D6E14E]">
              <svg className="w-8 h-8 text-[#D6E14E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#D6E14E] mb-1">You&apos;re Invited!</h1>
            <p className="text-gray-400 text-sm">Join the ZUG community and earn rewards</p>
          </div>

          {/* Referrer Card */}
          <div className="bg-gradient-to-r from-[#132a13]/80 to-[#1a3a1a]/80 rounded-xl p-6 mb-6 border border-[#D6E14E]/30 backdrop-blur-sm animate-slide-up">
            <div className="flex items-center mb-4">
              {referrer.profile_image_url ? (
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3 ring-2 ring-[#D6E14E]">
                  <img
                    src={referrer.profile_image_url}
                    alt={referrer.display_name || referrer.username}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-[#D6E14E] to-[#b8c93e] rounded-full flex items-center justify-center mr-3 ring-2 ring-[#D6E14E]">
                  <span className="text-black font-bold text-lg">
                    {referrer.display_name?.charAt(0) || referrer.username?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-white">
                  {referrer.display_name || referrer.username}
                </h2>
                <p className="text-[#D6E14E] font-medium text-sm">@{referrer.username}</p>
              </div>
            </div>
            <div className="bg-[#D6E14E]/10 rounded-lg p-3 border border-[#D6E14E]/20">
              <p className="text-white text-center text-sm">
                <span className="text-[#D6E14E] font-semibold">{referrer.display_name || referrer.username}</span> has invited you to join the ZUG community!
              </p>
            </div>
          </div>

                    {/* Rewards Card */}
          <div className="bg-gradient-to-r from-[#132a13]/80 to-[#1a3a1a]/80 rounded-xl p-6 mb-6 border border-[#D6E14E]/30 backdrop-blur-sm animate-slide-up animation-delay-200">
            <h3 className="text-xl font-bold text-[#D6E14E] mb-4 text-center">Rewards Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-[#D6E14E]/10 rounded-lg border border-[#D6E14E]/20">
                <span className="text-white font-medium text-sm">You get:</span>
                <span className="text-[#D6E14E] font-bold text-lg">50 points</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#D6E14E]/10 rounded-lg border border-[#D6E14E]/20">
                <span className="text-white font-medium text-sm">{referrer.display_name || referrer.username} gets:</span>
                <span className="text-[#D6E14E] font-bold text-lg">100 points</span>
              </div>
            </div>
          </div>

          {/* Connect Button */}
          <button
            onClick={handleConnectTwitter}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-[#D6E14E] to-[#b8c93e] text-black font-bold py-3 px-6 rounded-lg text-base hover:from-[#b8c93e] hover:to-[#D6E14E] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed animate-slide-up animation-delay-400"
          >
            {isConnecting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2"></div>
                Connecting...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Connect your X Account
              </div>
            )}
          </button>

          {/* Terms */}
          <div className="text-center mt-6 animate-slide-up animation-delay-600">
            <p className="text-gray-400 text-xs">
              By connecting your X account, you agree to our{' '}
              <a href="#" className="text-[#D6E14E] hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-[#D6E14E] hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  )
} 