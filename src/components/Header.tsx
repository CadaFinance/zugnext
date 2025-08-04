'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' },
]

interface HeaderProps {
  fullWidth?: boolean;
  showBothButtons?: boolean;
  showOnlyX?: boolean;
}

export default function Header({ fullWidth = false, showBothButtons = false, showOnlyX = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className={`mx-auto px-6 lg:px-8 ${fullWidth ? '' : 'max-w-7xl'}`}>
        <nav aria-label="Global" className="flex items-center justify-between pt-6">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5 flex items-center">
              <img
                alt="Logo"
                src="/Group 5195.png"
                className="h-8 w-auto mr-2"
              />
              <span className="text-xl font-bold text-gray-900">ZUG</span>
            </a>
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
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-gray-900">
                {item.name}
              </a>
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
            <a href="#" className="-m-1.5 p-1.5 flex items-center">
              <span className="sr-only">Your Company</span>
              <img
                alt="Logo"
                src="/Group 5195.png"
                className="h-8 w-auto mr-2"
              />
              <span className="text-xl font-bold text-gray-900">ZUG</span>
            </a>
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
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
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
  )
} 