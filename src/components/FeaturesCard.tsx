'use client'

import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react'
import { useReadContract, useAccount, useBalance, usePublicClient, useWriteContract, useSwitchChain } from 'wagmi'
import { toast } from 'sonner'
import ZUGPresaleABI from '@/contract/ZUGPresale.json'
import WalletModal from './WalletModal'

// Glow button styles
const glowButtonStyles = {
  '--glow-color': '#D6E14E',
  '--glow-spread-color': 'rgba(214, 225, 78, 0.781)',
  '--enhanced-glow-color': '#E8F15A',
  '--btn-color': '#B8C93A',
  border: '.25em solid var(--glow-color)',
  padding: '1em 3em',
  color: '#1a1a1a',
  fontSize: '15px',
  fontWeight: 'bold',
  backgroundColor: 'var(--btn-color)',
  borderRadius: '1em',
  outline: 'none',
  boxShadow: '0 0 1em .25em var(--glow-color), 0 0 4em 1em var(--glow-spread-color), inset 0 0 .75em .25em var(--glow-color)',
  textShadow: 'none',
  position: 'relative' as const,
  transition: 'all 0.3s',
  cursor: 'pointer'
} as React.CSSProperties

const glowButtonHoverStyles = {
  ...glowButtonStyles,
  color: '#1a1a1a',
  backgroundColor: 'var(--glow-color)',
  boxShadow: '0 0 1em .25em var(--glow-color), 0 0 4em 2em var(--glow-spread-color), inset 0 0 .75em .25em var(--glow-color)'
} as React.CSSProperties
 
const glowButtonActiveStyles = {
  ...glowButtonStyles,
  boxShadow: '0 0 0.6em .25em var(--glow-color), 0 0 2.5em 2em var(--glow-spread-color), inset 0 0 .5em .25em var(--glow-color)'
} as React.CSSProperties

const ZUG_PRESALE_ADDRESS = '0x1CA4a1029356540fb66f62403289bCB6804f352F'
const ZUG_TOKEN_ADDRESS = '0xF5C0A842DCdd43b3A23e06EB6e49bAaE9B92b248'

// Memoized countdown calculation
const useCountdown = () => {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [currentAmount, setCurrentAmount] = useState(0)
  const [isLoadingAmount, setIsLoadingAmount] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate amount based on time progression (no API call)
  const calculateAmountByTime = () => {
    const now = new Date()
    const targetDate = new Date('2025-11-05T23:59:59Z') // 5 November 2025
    const startDate = new Date('2025-08-11T02:00:00Z') // Presale start date
    const totalDuration = targetDate.getTime() - startDate.getTime()
    const elapsed = now.getTime() - startDate.getTime()
    const progress = Math.min(Math.max(elapsed / totalDuration, 0), 1) // Clamp between 0 and 1
    const targetAmount = 2502850.49 // Target amount: $2,502,850.49
    const currentAmount = progress * targetAmount
    
    console.log('📊 Time-based calculation:', {
      progress: (progress * 100).toFixed(2) + '%',
      currentAmount: currentAmount.toFixed(2),
      targetAmount
    })
    
    setCurrentAmount(currentAmount)
    setIsLoadingAmount(false)
  }

  useEffect(() => {
    const targetDate = new Date('2025-11-05T23:59:59Z') // 5 November 2025
    
    const updateCountdown = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        
        setCountdown({ days, hours, minutes, seconds })
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }
    
    updateCountdown()
    // Timer runs every second for accurate countdown
    intervalRef.current = setInterval(updateCountdown, 1000)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Calculate amount once on mount
  useEffect(() => {
    calculateAmountByTime()
  }, [])

  return { countdown, currentAmount, isLoadingAmount }
}

const FeaturesCard = memo(function FeaturesCard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [ethAmount, setEthAmount] = useState('0')
  const [zugAmount, setZugAmount] = useState('0')
  const [buttonStyle, setButtonStyle] = useState(glowButtonStyles)
  const [hasTransactionCompleted, setHasTransactionCompleted] = useState(false)
  const [showPriceInfo, setShowPriceInfo] = useState(false)
  const { address, isConnected, chainId } = useAccount()
  const { switchChain } = useSwitchChain()
  
  // Use memoized countdown
  const { countdown, currentAmount, isLoadingAmount } = useCountdown()

  // Memoized contract reads - only when connected
  const { data: tokenPriceUsd } = useReadContract({
    address: ZUG_PRESALE_ADDRESS as `0x${string}`,
    abi: ZUGPresaleABI.abi,
    functionName: 'tokenPriceUsd',
    chainId: 1,
  })

  // Memoized balance reads - only when connected
  const { data: ethBalance } = useBalance({
    address: address,
    chainId: 1,
  })

  const { data: zugBalance } = useBalance({
    address: address,
    token: ZUG_TOKEN_ADDRESS as `0x${string}`,
    chainId: 1,
  })

  const publicClient = usePublicClient()
  const { writeContract, isPending, error } = useWriteContract()

  // ETH/USD price from Chainlink
  const [ethUsdPrice, setEthUsdPrice] = useState<number>(0)
  const [isLoadingPrice, setIsLoadingPrice] = useState(false)
 
  // Fetch ETH/USD price from Chainlink
  useEffect(() => {
    const fetchEthPrice = async () => {
      setIsLoadingPrice(true)
      try {
        const response = await publicClient.readContract({
          address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419' as `0x${string}`, // Chainlink ETH/USD Price Feed
          abi: [
            {
              "inputs": [],
              "name": "latestRoundData",
              "outputs": [
                { "internalType": "uint80", "name": "roundId", "type": "uint80" },
                { "internalType": "int256", "name": "answer", "type": "int256" },
                { "internalType": "uint256", "name": "startedAt", "type": "uint256" },
                { "internalType": "uint256", "name": "updatedAt", "type": "uint256" },
                { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }
              ],
              "stateMutability": "view",
              "type": "function"
            }
          ],
          functionName: 'latestRoundData',
        })
        
        // Convert from 8 decimal places to USD
        const ethPrice = Number(response[1]) / 1e8
        setEthUsdPrice(ethPrice)
      } catch (error) {
        console.error('Error fetching ETH price:', error)
        setEthUsdPrice(3000) // Fallback price
      } finally {
        setIsLoadingPrice(false)
      }
    }

    fetchEthPrice()
    // Refresh price every 30 seconds
    const interval = setInterval(fetchEthPrice, 30000)
    return () => clearInterval(interval)
  }, [publicClient])

  // Memoized calculation function
  const calculateZugAmount = useCallback(async (ethValue: string) => {
    if (!ethValue || parseFloat(ethValue) <= 0) {
      setZugAmount('0')
      return
    }

    try {
      // Calculate USD value of ETH
      const ethAmount = parseFloat(ethValue)
      const usdValue = ethAmount * ethUsdPrice
      
      // Calculate ZUG tokens based on USD value and token price
      const zugTokenPriceUsd = tokenPriceUsd ? Number(tokenPriceUsd) / 1e18 : 0.000240 // 18 decimal places
      const zugAmount = usdValue / zugTokenPriceUsd
      
      const finalAmount = Math.max(0, zugAmount)
      if (isNaN(finalAmount)) {
        setZugAmount('0')
      } else {
        setZugAmount(finalAmount.toFixed(0))
      }
    } catch (error) {
      // console.error('Error calculating ZUG amount:', error)
      setZugAmount('0')
    }
  }, [ethUsdPrice, tokenPriceUsd])

  // Memoized handlers
  const handleConnect = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleMaxClick = useCallback(async () => {
    if (!address || !ethBalance) return

    try {
      // Estimate gas for buyTokens function
      const gasEstimate = await publicClient.estimateGas({
        account: address,
        to: ZUG_PRESALE_ADDRESS as `0x${string}`,
        value: ethBalance.value,
        data: '0x', // buyTokens function call
      })

      // Get current gas price
      const gasPrice = await publicClient.getGasPrice()
      
      // Calculate gas cost
      const gasCost = gasEstimate * gasPrice
      
      // Calculate available amount (balance - gas cost)
      const availableAmount = ethBalance.value - gasCost
      
      // Convert to ETH for display
      const availableEth = Number(availableAmount) / 1e18
      
      // Ensure we don't have negative values
      const finalAmount = Math.max(0, availableEth)
      
      // Set the input value to available amount
      const availableEthStr = finalAmount.toFixed(6)
      setEthAmount(availableEthStr)
      await calculateZugAmount(availableEthStr)
      
    } catch (error) {
      // console.error('Error estimating gas:', error)
      // Fallback: use 90% of balance
      const balanceInEth = Number(ethBalance.formatted)
      const fallbackAmount = balanceInEth * 0.9
      const fallbackStr = fallbackAmount.toFixed(6)
      setEthAmount(fallbackStr)
      await calculateZugAmount(fallbackStr)
    }
  }, [address, ethBalance, publicClient, calculateZugAmount])



  // Handle contract errors and success with toast
  useEffect(() => {
    if (error) {
      let errorMessage = 'Transaction failed'
      
      if (error.message.includes('User rejected')) {
        errorMessage = 'Transaction was cancelled by user'
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for transaction'
      } else if (error.message.includes('gas')) {
        errorMessage = 'Gas estimation failed'
      }
      
      toast.error(errorMessage)
    }
  }, [error])

  // Handle successful transaction
  useEffect(() => {
    if (!isPending && !error && hasTransactionCompleted) {
      toast.success(`Successfully bought ${zugAmount} ZUG tokens!`)
      setHasTransactionCompleted(false) // Reset for next transaction
    }
  }, [isPending, error, hasTransactionCompleted, zugAmount])

  // Memoized progress calculation
  const progressPercentage = useMemo(() => {
    const targetAmount = 2502850.49 // $2,502,850.49 hedef
    return Math.min((currentAmount / targetAmount) * 100, 100)
  }, [currentAmount])

  // Memoized formatted amounts
  const formattedCurrentAmount = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(currentAmount)
  }, [currentAmount])

  const formattedTargetAmount = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(2502850.49) // $2,502,850.49 hedef
  }, [])

  // Check if user has sufficient balance
  const hasSufficientBalance = useMemo(() => {
    if (!isConnected || !ethBalance || !ethAmount) return false
    
    const userBalance = Number(ethBalance.formatted)
    const requestedAmount = Number(ethAmount)
    
    return userBalance >= requestedAmount
  }, [isConnected, ethBalance, ethAmount])

    // Contract address for reference
  // console.log('Contract Address:', ZUG_PRESALE_ADDRESS)



  // Format data for display
  const formattedPrice = useMemo(() => {
    console.log('Raw tokenPriceUsd:', tokenPriceUsd)
    if (!tokenPriceUsd) return '0.00024' // Default fallback price
    // Price 18 decimal olarak set edilmiş (yeni kontrat)
    // 120000000000000 = 0.00012 USD (120000000000000 / 10^18)
    const price = (Number(tokenPriceUsd) / 1e18).toFixed(6)
    // Remove trailing zeros but keep at least 6 decimal places
    const cleanPrice = price.replace(/\.?0+$/, '')
    return cleanPrice || '0.00024' // Fallback if empty
  }, [tokenPriceUsd])

  return (
    <>
      <div 
        className="relative rounded-xl shadow-xl h-full flex flex-col items-center justify-center overflow-hidden p-4"
        style={{
          backgroundColor: '#1a1a1a',
          backgroundImage: `
            linear-gradient(45deg, rgba(214, 225, 78, 0.1) 25%, transparent 25%, transparent 75%, rgba(214, 225, 78, 0.1) 75%),
            linear-gradient(-45deg, rgba(214, 225, 78, 0.1) 25%, transparent 25%, transparent 75%, rgba(214, 225, 78, 0.1) 75%)
          `,
          backgroundSize: '30px 30px, 30px 30px',
          backgroundPosition: '0 0, 15px 15px'
        }}
      >
        {/* Content */}
        <div className="relative z-10 w-full max-w-md">
            {/* ZUG Token Presale Title - Grid 1 */}
            <div className="grid grid-cols-1 mb-6">
              <h3 className="text-4xl font-bold text-center">
                <span className="text-white">BUY </span>
                <span className="text-[#D6E14E]">$ZUG</span>
                <span className="text-white"> NOW</span>
              </h3>
            </div>
            
            {/* Countdown Timer */} 
            <div className="grid grid-cols-1 mb-6">
              <div className="text-center">
                <div className="flex justify-center space-x-2 sm:space-x-3">
                  <div className="text-center">
                    <div className="bg-gray-800 border-2 border-[#D6E14E] rounded-lg px-2 py-2 sm:px-4 sm:py-3 mb-2 w-16 sm:w-20">
                      <div className="text-xl sm:text-3xl font-bold text-[#D6E14E]">{countdown.days}</div>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300 font-medium">Days</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-gray-800 border-2 border-[#D6E14E] rounded-lg px-2 py-2 sm:px-4 sm:py-3 mb-2 w-16 sm:w-20">
                      <div className="text-xl sm:text-3xl font-bold text-[#D6E14E]">{countdown.hours.toString().padStart(2, '0')}</div>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300 font-medium">Hours</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-gray-800 border-2 border-[#D6E14E] rounded-lg px-2 py-2 sm:px-4 sm:py-3 mb-2 w-16 sm:w-20">
                      <div className="text-xl sm:text-3xl font-bold text-[#D6E14E]">{countdown.minutes.toString().padStart(2, '0')}</div>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300 font-medium">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-gray-800 border-2 border-[#D6E14E] rounded-lg px-2 py-2 sm:px-4 sm:py-3 mb-2 w-16 sm:w-20">
                      <div className="text-xl sm:text-3xl font-bold text-[#D6E14E]">{countdown.seconds.toString().padStart(2, '0')}</div>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300 font-medium">Seconds</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="grid grid-cols-1 mb-6">
              <div className="text-center">
                <div className="text-sm text-gray-300 mb-2">
                  USD Raised: 
                  {isLoadingAmount ? (
                    <span className='text-[#D6E14E] lg:text-xl font-bold text-lg'>
                      <div className="inline-block w-4 h-4 border-2 border-[#D6E14E] border-t-transparent rounded-full animate-spin mr-2"></div>
                      Loading...
                    </span>
                  ) : (
                    <span className='text-[#D6E14E] lg:text-xl font-bold text-lg'>
                      {formattedCurrentAmount} / {formattedTargetAmount}
                    </span>
                  )}

                </div>
                <div className="relative w-full bg-gray-700 rounded-full h-6 mb-2">
                  <div 
                    className="bg-gradient-to-r from-[#D6E14E] to-[#E8F15A] h-6 rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white drop-shadow-lg">UNTIL PRICE RISE</span>
                  </div>
                </div>
              </div>
                             {isConnected && (
                 <div className="flex items-center -mt-1 justify-between">
                   <div className="flex items-center space-x-2">
                     <span className="text-xs font-medium text-gray-300">
                       PURCHASED $ZUG: {zugBalance ? 
                         (Number(zugBalance.formatted) >= 1000000000 ? 
                           (Number(zugBalance.formatted) / 1000000000).toFixed(2) + 'B' : 
                           Number(zugBalance.formatted) >= 1000000 ? 
                             (Number(zugBalance.formatted) / 1000000).toFixed(2) + 'M' : 
                             Number(zugBalance.formatted).toFixed(2)
                         ) : '0.00'}
                     </span>
                   </div>
                   <div className="text-xs text-gray-300">
                   STAKEABLE $ZUG: {zugBalance ? 
                       (Number(zugBalance.formatted) >= 1000000000 ? 
                         (Number(zugBalance.formatted) / 1000000000).toFixed(2) + 'B' : 
                         Number(zugBalance.formatted) >= 1000000 ? 
                           (Number(zugBalance.formatted) / 1000000).toFixed(2) + 'M' : 
                           Number(zugBalance.formatted).toFixed(2)
                       ) : '0.00'}
                   </div>
                 </div>
               )}

            </div>
            
            {!isConnected ? (
              <div className="space-y-4">
                {/* Price Display Only */}
                <div className="text-center">
                  <div className="text-xl font-bold mb-2">
                    <span className="text-white">1 </span>
                    <span className="text-[#D6E14E]">$ZUG</span>
                    <span className="text-white"> = ${formattedPrice} USD</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* PAY WITH ETH and Balance - Grid 2 */}
                <div className="grid grid-cols-2 mb-1 gap-2">
                  <div className="text-sm text-gray-300 font-medium">PAY WITH ETH</div>
                  <div className="text-xs text-gray-400 text-right">
                    Balance = {ethBalance ? Math.max(0, Number(ethBalance.formatted)).toFixed(4) : '0.0000'}
                  </div>
                </div>
                
                {/* Input Field and ETH Dropdown - Grid 2 */}
                <div className="grid grid-cols-10 gap-3 relative">
                  <div className="relative col-span-7">
                    <input 
                      type="number" 
                      placeholder="0" 
                      min="0"
                      step="0.000001"
                      value={ethAmount}
                      onChange={(e) => {
                        const value = e.target.value
                        // Prevent negative numbers and ensure minimum 0
                        const numValue = Number(value)
                        if (numValue < 0) return
                        
                        // Set to 0 if empty or invalid
                        const finalValue = isNaN(numValue) ? '0' : value
                        setEthAmount(finalValue)
                        calculateZugAmount(finalValue)
                      }}
                      className="w-full bg-gray-700 text-xl font-bold text-white outline-none px-4 py-3 rounded-lg border border-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div className="flex items-center space-x-1 bg-gray-700 px-3 py-3 rounded-lg border border-gray-600 justify-center col-span-3">
                    <img src="/Ethereum-Icon-Purple-Logo.wine.svg" alt="ETH" className="w-6 h-6" />
                    <span className="text-lg font-medium text-white">ETH</span>
                  </div>
                  {/* MAX Button positioned at top-right of input card */}
                  <button 
                    onClick={handleMaxClick}
                    className="absolute right-40 -mr-10 lg:right-40 -mt-6 lg:-mr-5 text-sm text-[#D6E14E] underline hover:text-[#E8F15A] font-medium"
                  >
                    MAX
                  </button>
                </div>

                {/* RECEIVE ZUG and Price - Grid 2 */}
                <div className="grid grid-cols-2 mb-0.5 gap-2">
                  <div className="text-sm text-gray-300 font-medium">RECEIVE ZUG</div>
                  <div className="text-sm font-bold text-right relative group">
                    <span className="text-white">1 ZUG = ${formattedPrice} USD</span>
                    <button 
                      onClick={() => setShowPriceInfo(!showPriceInfo)}
                      className="ml-1 text-[#D6E14E] cursor-help hover:text-[#E8F15A] transition-colors"
                    >
                      ⓘ
                    </button>
                  
                  {/* Desktop Tooltip */}
                  <div className="absolute right-0 bottom-full mb-2 w-64 bg-gray-900 border border-[#D6E14E]/30 rounded-lg p-3 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus:opacity-100 group-focus:visible transition-all duration-200 z-50 hidden md:block">
                    <div className="text-xs text-gray-300 mb-2 text-left">Future Stage Prices:</div>
                    <div className="flex flex-col gap-1 text-xs text-left">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-white">Stage 1: <span className="text-[#D6E14E]">$0.00012</span></div>
                        <div className="text-white">Stage 8: <span className="text-[#D6E14E]">$0.008</span></div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-white">Stage 2: <span className="text-[#D6E14E]">$0.00024</span></div>
                        <div className="text-white">Stage 9: <span className="text-[#D6E14E]">$0.01</span></div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-white">Stage 3: <span className="text-[#D6E14E]">$0.00048</span></div>
                        <div className="text-white">Stage 10: <span className="text-[#D6E14E]">$0.02</span></div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-white">Stage 4: <span className="text-[#D6E14E]">$0.00096</span></div>
                        <div className="text-white">Stage 11: <span className="text-[#D6E14E]">$0.04</span></div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-white">Stage 5: <span className="text-[#D6E14E]">$0.001</span></div>
                        <div className="text-white">Stage 12: <span className="text-[#D6E14E]">$0.08</span></div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-white">Stage 6: <span className="text-[#D6E14E]">$0.002</span></div>
                        <div className="text-white">Stage 13: <span className="text-[#D6E14E]">$0.1</span></div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-white">Stage 7: <span className="text-[#D6E14E]">$0.004</span></div>
                        <div className="text-white">Stage 14: <span className="text-[#D6E14E]">$0.2</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                
                {/* Mobile Price Info Dropdown */}
                {showPriceInfo && (
                  <div className="md:hidden mt-2 bg-gray-900 border border-[#D6E14E]/30 rounded-lg p-3">
                    <div className="text-xs text-gray-300 mb-2 text-left">Future Stage Prices:</div>
                    <div className="flex flex-col gap-1 text-xs text-left">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-white">Stage 1: <span className="text-[#D6E14E]">$0.00012</span></div>
                        <div className="text-white">Stage 8: <span className="text-[#D6E14E]">$0.008</span></div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-white">Stage 2: <span className="text-[#D6E14E]">$0.00024</span></div>
                        <div className="text-white">Stage 9: <span className="text-[#D6E14E]">$0.01</span></div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-white">Stage 3: <span className="text-[#D6E14E]">$0.00048</span></div>
                        <div className="text-white">Stage 10: <span className="text-[#D6E14E]">$0.02</span></div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-white">Stage 4: <span className="text-[#D6E14E]">$0.00096</span></div>
                        <div className="text-white">Stage 11: <span className="text-[#D6E14E]">$0.04</span></div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-white">Stage 5: <span className="text-[#D6E14E]">$0.001</span></div>
                        <div className="text-white">Stage 12: <span className="text-[#D6E14E]">$0.08</span></div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-white">Stage 6: <span className="text-[#D6E14E]">$0.002</span></div>
                        <div className="text-white">Stage 13: <span className="text-[#D6E14E]">$0.1</span></div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-white">Stage 7: <span className="text-[#D6E14E]">$0.004</span></div>
                        <div className="text-white">Stage 14: <span className="text-[#D6E14E]">$0.2</span></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* ZUG Input Field with ZUG logo inside */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="0" 
                      min="0"
                      value={(() => {
                        const num = Math.max(0, Math.floor(Number(zugAmount)))
                        return isNaN(num) ? 0 : num
                      })()}
                      readOnly
                      className="w-full bg-gray-700 text-xl font-bold text-white outline-none px-4 py-3 rounded-lg border border-gray-600 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none pr-16"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                      <img src="/Group 5195.png" alt="ZUG" className="w-5 h-5" />
                    </div>
                  </div> 
                </div>
              </div>
            )}
            
            {!isConnected && (
              <div className="mt-6">
                <button
                  onClick={handleConnect}
                  className="w-full relative overflow-hidden font-semibold text-lg"
                  style={buttonStyle}
                  onMouseEnter={() => setButtonStyle(glowButtonHoverStyles)}
                  onMouseLeave={() => setButtonStyle(glowButtonStyles)}
                  onMouseDown={() => setButtonStyle(glowButtonActiveStyles)}
                  onMouseUp={() => setButtonStyle(glowButtonHoverStyles)}
                >
                   BUY WITH ETH
                </button>
              </div>
            )}
            
            {isConnected && (
              <div className="mt-6 space-y-4">
              
                {/* Check if user is on Ethereum mainnet */}
                {chainId === 1 ? (
                  /* Buy Button - Show when on Ethereum mainnet */
                  <button
                    onClick={() => {
                      if (!ethAmount || Number(ethAmount) === 0) {
                        toast.error('Please enter an amount to buy')
                        return
                      }
                      
                      if (!hasSufficientBalance) {
                        toast.error('Insufficient balance')
                        return
                      }
                      
                      const ethInWei = BigInt(Math.floor(Number(ethAmount) * 1e18))
                      
                      setHasTransactionCompleted(true) // Mark that we started a transaction
                      
                      writeContract({
                        address: ZUG_PRESALE_ADDRESS as `0x${string}`,
                        abi: ZUGPresaleABI.abi,
                        functionName: 'buyTokens',
                        value: ethInWei,
                        chainId: 1, // Ethereum mainnet
                      })
                    }}
                    disabled={!ethAmount || Number(ethAmount) === 0 || isPending || !hasSufficientBalance}
                    className="w-full relative overflow-hidden font-semibold text-lg disabled:cursor-not-allowed disabled:opacity-50"
                    style={buttonStyle}
                    onMouseEnter={() => setButtonStyle(glowButtonHoverStyles)}
                    onMouseLeave={() => setButtonStyle(glowButtonStyles)}
                    onMouseDown={() => setButtonStyle(glowButtonActiveStyles)}
                    onMouseUp={() => setButtonStyle(glowButtonHoverStyles)}
                  >
                    {isPending ? 'Buying...' : 
                     !ethAmount || Number(ethAmount) === 0 ? 'Enter Amount' : 
                     !hasSufficientBalance ? 'Insufficient Balance' : 
                     'Buy ZUG Tokens'}
                  </button>
                ) : (
                  /* Switch to Ethereum mainnet Button - Show when not on Ethereum mainnet */
                  <button
                    onClick={() => {
                      try {
                        switchChain({ chainId: 1 })
                        toast.success('Switching to Ethereum mainnet...')
                      } catch (error) {
                        console.error('Error switching chain:', error)
                        toast.error('Failed to switch network')
                      }
                    }}
                    className="w-full relative overflow-hidden font-semibold text-lg"
                    style={buttonStyle}
                    onMouseEnter={() => setButtonStyle(glowButtonHoverStyles)}
                    onMouseLeave={() => setButtonStyle(glowButtonStyles)}
                    onMouseDown={() => setButtonStyle(glowButtonActiveStyles)}
                    onMouseUp={() => setButtonStyle(glowButtonHoverStyles)}
                  >
                    Switch to Ethereum
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
   

      <WalletModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
})

export default FeaturesCard 
