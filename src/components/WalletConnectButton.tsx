'use client'

import { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import WalletModal from './WalletModal'

export default function WalletConnectButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const handleConnect = () => {
    setIsModalOpen(true)
  }

  const handleDisconnect = () => {
    disconnect()
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
        <button
          onClick={handleDisconnect}
          className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold text-xs hover:bg-red-700 transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={handleConnect}
        className="bg-black text-[#D6E14E] px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors"
      >
        Connect your wallet
      </button>
      
      <WalletModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
} 