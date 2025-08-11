import type { Metadata } from 'next'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{
    username: string
  }>
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const resolvedParams = await params
  const username = resolvedParams.username
  
  return {
    title: `Join ZUG Community - Invited by @${username}`,
    description: `You've been invited by @${username} to join the ZUG community! Connect your X account and earn 50 points. The fastest Ethereum Layer 2 chain with scalability and speed.`,
    keywords: ['ZUG', 'Ethereum', 'Layer 2', 'Blockchain', 'Crypto', 'Referral', 'Rewards'],
    authors: [{ name: 'ZUG Chain' }],
    creator: 'ZUG Chain',
    publisher: 'ZUG Chain',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://zugchain.org'),
    alternates: {
      canonical: `/boost/${username}`,
    },
    openGraph: {
      title: `Join ZUG Community - Invited by @${username}`,
      description: `You've been invited by @${username} to join the ZUG community! Connect your X account and earn 50 points.`,
      url: `https://zugchain.org/boost/${username}`,
      siteName: 'ZUG Chain',
      images: [
        {
          url: '/Hiring training.png', // ZUG logo
          width: 1200,
          height: 630,
          alt: 'ZUG Chain - Ethereum Layer 2',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Join ZUG Community - Invited by @${username}`,
      description: `You've been invited by @${username} to join the ZUG community! Connect your X account and earn 50 points.`,
      images: ['/Hiring training.png'],
      creator: '@ZugChain_org',
      site: '@ZugChain_org',
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

export default function BoostLayout({ children }: LayoutProps) {
  return children
}
