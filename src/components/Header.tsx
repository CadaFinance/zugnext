'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'

const navigation = [
  { name: 'HOW TO BUY', href: '/#how-to-buy' },
  { name: 'TOKENOMICS', href: '/#tokenomics' },
  { name: 'FAQ', href: '/#faq' },
  { name: 'ABOUT', href: '/#about' },
  { name: 'AIRDROP', href: '/Airdrop' },
]

interface HeaderProps {
  fullWidth?: boolean;
  showBothButtons?: boolean;
  showOnlyX?: boolean;
}

// Generate random wallet address
const generateWalletAddress = () => {
  const chars = '0123456789abcdef';
  let address = '0x';
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)];
  }
  return address;
}

// Generate random transaction data
const generateTransactionData = () => {
  const transactions = [];
  const zugPrice = 0.012525;
  
  for (let i = 0; i < 30; i++) {
    const usdAmount = Math.random() * (1021.82 - 82.23) + 82.23;
    const zugAmount = usdAmount / zugPrice;
    const walletAddress = generateWalletAddress();
    
    transactions.push({
      usd: usdAmount.toFixed(2),
      zug: zugAmount.toFixed(0),
      wallet: walletAddress.substring(0, 6) + '...' + walletAddress.substring(36)
    });
  }
  
  return transactions;
}

export default function Header({ fullWidth = false, showBothButtons = false, showOnlyX = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [transactionData, setTransactionData] = useState<string>('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const generateTransactions = () => {
      const transactions = generateTransactionData();
      const transactionString = transactions.map(t => 
        `[${t.wallet}] bought ${t.zug}K $ZUG worth $${t.usd}`
      ).join(' ');
      setTransactionData(transactionString);
    };

    generateTransactions();
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    let animationId: number;
    let position = 0;
    const speed = 50; // pixels per second

    const animate = () => {
      position -= speed / 60; // 60fps
      
      // Reset position when content has scrolled completely
      const containerWidth = scrollElement.parentElement?.offsetWidth || 0;
      const contentWidth = scrollElement.offsetWidth;
      
      if (position <= -contentWidth) {
        position = containerWidth;
      }
      
      scrollElement.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [transactionData]);

  return (
    <>
      {/* Scrolling Ticker Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black text-white py-2 overflow-hidden">
        <div className="flex items-center">
          <span className="inline-block px-4 font-bold text-sm whitespace-nowrap bg-black relative z-10">
            LATEST PURCHASES
          </span>
          <div className="flex-1 overflow-hidden">
            <div 
              ref={scrollRef}
              className="whitespace-nowrap flex" 
              style={{ 
                transform: 'translateX(0px)'
              }}
            >
              <span className="inline-block px-4">
                {transactionData}
              </span>
              <span className="inline-block px-4">
                {transactionData}
              </span>
              <span className="inline-block px-4">
                {transactionData}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <header className="fixed inset-x-0 top-8 z-50 bg-white shadow-sm">
      <div className={`mx-auto px-6 lg:px-8 ${fullWidth ? '' : 'max-w-7xl'}`}>
        <nav aria-label="Global" className="flex items-center justify-between py-4">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center">
              <Image
                alt="Logo"
                src="/Group 5195.png"
                width={32}
                height={32}
                className="h-8 w-auto mr-2"
              />
              <span className="text-xl font-bold text-gray-900">ZUG</span>
            </Link>
          </div>
          <div className="flex lg:hidden items-center gap-2">
            {!showOnlyX && (
              <button className="bg-black text-[#D6E14E] px-3 py-1.5 rounded-lg font-semibold text-xs hover:bg-gray-800 transition-colors">
                Connect your wallet
              </button>
            )}
            {(showBothButtons || showOnlyX) && (
              <button className="bg-black text-[#D6E14E] px-3 py-1.5 rounded-lg font-semibold text-xs hover:bg-gray-800 transition-colors">
                Connect your X
              </button>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors">
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-3">
            {!showOnlyX && (
              <button className="bg-black text-[#D6E14E] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors">
                Connect your wallet
              </button>
            )}
            {(showBothButtons || showOnlyX) && (
              <button className="bg-black text-[#D6E14E] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors">
                Connect your X
              </button>
            )}
          </div>
        </nav>
      </div>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center">
              <span className="sr-only">Your Company</span>
              <Image
                alt="Logo"
                src="/Group 5195.png"
                width={32}
                height={32}
                className="h-8 w-auto mr-2"
              />
              <span className="text-xl font-bold text-gray-900">ZUG</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6 space-y-3">
                {!showOnlyX && (
                  <button className="w-full bg-[#132a13] text-white px-3 py-2.5 rounded-lg font-semibold text-base hover:bg-gray-800 transition-colors">
                    Connect your wallet
                  </button>
                )}
                {(showBothButtons || showOnlyX) && (
                  <button className="w-full bg-[#132a13] text-white px-3 py-2.5 rounded-lg font-semibold text-base hover:bg-gray-800 transition-colors">
                    Connect your X
                  </button>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
    </>
  )
} 