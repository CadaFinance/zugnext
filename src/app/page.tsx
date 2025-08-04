'use client'

import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import Features from '@/components/Features'
import FeaturedIn from '@/components/FeaturedIn'
import PoweredBy from '@/components/PoweredBy'
import NewsSection from '@/components/NewsSection'
import Tokenomics from '@/components/Tokenomics'
import BitcoinLayer2 from '@/components/BitcoinLayer2'
import Updates from '@/components/Updates'
import OurFriends from '@/components/OurFriends'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
export default function Home() {
  return (
    <div className='bg-white  white-pattern-bg'>
      <Header />
      <HeroSection />
      <Features />
      <FeaturedIn />
      <BitcoinLayer2 />
      <NewsSection />
      <PoweredBy />
      <Tokenomics />
      <Updates />
      <OurFriends />
      <FAQ />
      <Footer />

     

    </div>
  )
}
