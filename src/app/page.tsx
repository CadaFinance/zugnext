'use client'

import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import Features from '@/components/Features'
import FeaturedIn from '@/components/FeaturedIn'
import PoweredBy from '@/components/PoweredBy'
import NewsSection from '@/components/NewsSection'
import Tokenomics from '@/components/Tokenomics'
import BitcoinLayer2 from '@/components/BitcoinLayer2'


import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
export default function Home() {
  return (
    <div className='bg-white  white-pattern-bg'>
      <Header />
      <HeroSection />
      <div id="about">
        <Features />
      </div>
      <FeaturedIn />
      <div id="how-to-buy">
        <BitcoinLayer2 />
      </div>
      <NewsSection />
      <PoweredBy />
      <div id="tokenomics">
        <Tokenomics />
      </div>
     
      <div id="faq">
        <FAQ />
      </div>
      <Footer />
    </div>
  )
}
