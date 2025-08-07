'use client'

import { Suspense, lazy } from 'react'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import PerformanceMonitor from '@/components/PerformanceMonitor'

// Lazy load heavy components
const Features = lazy(() => import('@/components/Features'))
const FeaturedIn = lazy(() => import('@/components/FeaturedIn'))
const PoweredBy = lazy(() => import('@/components/PoweredBy'))
const NewsSection = lazy(() => import('@/components/NewsSection'))
const Tokenomics = lazy(() => import('@/components/Tokenomics'))
const BitcoinLayer2 = lazy(() => import('@/components/BitcoinLayer2'))
const FAQ = lazy(() => import('@/components/FAQ'))
const Footer = lazy(() => import('@/components/Footer'))

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D6E14E]"></div>
  </div>
)

export default function Home() {
  return (
    <div className='bg-white white-pattern-bg'>
      <Header />
      <HeroSection />
      
      <Suspense fallback={<LoadingSpinner />}>
        <div id="about" className="scroll-mt-28 md:scroll-mt-40">
          <Features />
        </div>
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <FeaturedIn />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <div id="how-to-buy" className="scroll-mt-28 md:scroll-mt-40">
          <BitcoinLayer2 />
        </div>
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <NewsSection />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <PoweredBy />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <div id="tokenomics" className="scroll-mt-28 md:scroll-mt-40">
          <Tokenomics />
        </div>
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <div id="faq" className="scroll-mt-28 md:scroll-mt-40">
          <FAQ />
        </div>
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <Footer />
      </Suspense>
      <PerformanceMonitor />
    </div>
  )
}
