'use client'

import { useState, useEffect } from 'react'

interface Task {
  id: string
  title: string
  points: number
  completed: boolean
  loading: boolean 
  type?: 'one_time' | 'daily'
  timeRemaining?: string
  isAvailable?: boolean
}

interface User {
  id: string
  twitter_id: string
  username: string
  display_name: string
  profile_image_url: string
  created_at: string
  updated_at: string
  tasks?: boolean
}

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  points: number
  type: 'daily' | 'one_time'
}

function SuccessModal({ isOpen, onClose, points, type }: SuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#132a13] to-[#1a3a1a] rounded-2xl p-8 border border-[#D6E14E]/30 max-w-md w-full transform transition-all duration-300 scale-100">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-[#D6E14E]/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-[#D6E14E]">
            <svg className="w-10 h-10 text-[#D6E14E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-[#D6E14E] mb-2">
            {type === 'daily' ? 'Daily Rewards Claimed!' : 'Rewards Claimed!'}
          </h3>
          
          <p className="text-gray-300 mb-6">
            {type === 'daily' 
              ? 'You have successfully completed your daily tasks!'
              : 'You have successfully completed all one-time tasks!'
            }
          </p>
        </div>

        {/* Points Display */}
        <div className="bg-[#D6E14E]/10 rounded-xl p-6 border border-[#D6E14E]/30 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#D6E14E] mb-2">
              +{points}
            </div>
            <div className="text-gray-300 font-semibold">
              Points Added
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="bg-[#D6E14E] text-black font-bold py-3 px-8 rounded-lg hover:bg-[#b8c93e] transition-all duration-300 transform hover:scale-105 w-full"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

interface TasksProps {
  referralLink?: string
}

export default function Tasks({ referralLink }: TasksProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [dailyTasks, setDailyTasks] = useState<Task[]>([])
  const [userPoints, setUserPoints] = useState(0)
  const [allTasksCompleted, setAllTasksCompleted] = useState(false)
  const [dailyTasksCompleted, setDailyTasksCompleted] = useState(false)
  const [countdown, setCountdown] = useState<string>('')
  const [dailyTasksAvailable, setDailyTasksAvailable] = useState(true)
  
  // Modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [modalPoints, setModalPoints] = useState(0)
  const [modalType, setModalType] = useState<'daily' | 'one_time'>('daily')
  
  // Claim button loading states
  const [claimingRewards, setClaimingRewards] = useState(false)
  const [claimingDailyRewards, setClaimingDailyRewards] = useState(false)

  useEffect(() => {
    async function checkUserAuth() {
      try {
        const response = await fetch('/api/dashboard')
        const data = await response.json()
        
        if (data.user.authenticated && data.user.user) {
          setUser(data.user.user)
          loadUserPoints(data.user.user.id)
          if (data.user.user.tasks) {
            setAllTasksCompleted(true)
            loadDailyTasks(data.user.user.id)
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUserAuth()
    loadTasks()
  }, [])

  // Refresh countdown every minute
  useEffect(() => {
    if (!user || !allTasksCompleted) return

    const interval = setInterval(() => {
      loadDailyTasks(user.id)
    }, 60000) // Refresh every minute

    return () => clearInterval(interval)
  }, [user, allTasksCompleted])

  const loadUserPoints = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/points?userId=${userId}`)
      const data = await response.json()
      if (data.points) {
        setUserPoints(data.points)
      }
    } catch (error) {
      console.error('Error loading user points:', error)
    }
  }

  const loadTasks = () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Follow X',
        points: 150,
        completed: false,
        loading: false,
        type: 'one_time'
      },
      {
        id: '2',
        title: 'Like & RT',
        points: 150,
        completed: false,
        loading: false,
        type: 'one_time'
      },
      {
        id: '3',
        title: 'Share your invite link',
        points: 150,
        completed: false,
        loading: false,
        type: 'one_time'
      },
      {
        id: '4',
        title: 'Add "ZUG" to X name & ref links to bio',
        points: 200,
        completed: false,
        loading: false,
        type: 'one_time'
      },
      {
        id: '5',
        title: 'Join our Telegram group @zugchain',
        points: 100,
        completed: false,
        loading: false,
        type: 'one_time'
      }
    ]
    setTasks(mockTasks)
  }

  const loadDailyTasks = async (userId: string) => {
    try {
      // Shorter cache for countdown accuracy - cache for 1 minute
      const cacheKey = `daily-tasks-${userId}`
      const cached = sessionStorage.getItem(cacheKey)
      
      if (cached) {
        const data = JSON.parse(cached)
        const cacheTime = data.timestamp || 0
        const now = Date.now()
        
        // Cache expires after 1 minute for countdown accuracy
        if (now - cacheTime < 60000) {
          setDailyTasks(data.tasks)
          setDailyTasksAvailable(data.available)
          setCountdown(data.nextReset)
          return
        }
      }

      // Show loading state immediately
      setDailyTasks([
        {
          id: 'daily_1',
          title: 'Daily: Vote on Coinsniper',
          points: 100,
          completed: false,
          loading: true,
          type: 'daily',
          isAvailable: false,
          timeRemaining: ''
        }
      ])

      const response = await fetch(`/api/daily-tasks?userId=${userId}`)
      const data = await response.json()
      
      const dailyTasksData: Task[] = [
        {
          id: 'daily_1',
          title: 'Daily: Vote on Coinsniper',
          points: 100,
          completed: false,
          loading: false,
          type: 'daily',
          isAvailable: data.tasks?.daily_1?.available || false,
          timeRemaining: data.tasks?.daily_1?.timeRemaining || ''
        }
      ]
      
      // Cache the data for 1 minute for countdown accuracy
      const cacheData = {
        tasks: dailyTasksData,
        available: data.tasks?.daily_1?.available || false,
        nextReset: data.nextReset || '',
        timestamp: Date.now()
      }
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheData))
      
      setDailyTasks(dailyTasksData)
      setDailyTasksAvailable(data.tasks?.daily_1?.available || false)
      setCountdown(data.nextReset || '')
    } catch (error) {
      console.error('Error loading daily tasks:', error)
    }
  }

  const handleTaskClick = async (taskId: string) => {
    const isDailyTask = taskId.startsWith('daily_')
    
    if (isDailyTask) {
      setDailyTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, loading: true }
            : task
        )
      )
    } else {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, loading: true }
            : task
        )
      )
    }

    // Simulate 1 second loading (reduced from 15 seconds)
    setTimeout(async () => {
      if (isDailyTask) {
        // Complete daily task in browser and check completion
        setDailyTasks(prevTasks => {
          const updatedTasks = prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, completed: true, loading: false }
              : task
          )
          
          // Check if daily task is completed
          const dailyTaskCompleted = updatedTasks.every(task => task.completed)
          setDailyTasksCompleted(dailyTaskCompleted)
          
          // Clear cache when daily tasks are completed to ensure fresh data
          if (user) {
            const cacheKey = `daily-tasks-${user.id}`
            sessionStorage.removeItem(cacheKey)
          }
          
          return updatedTasks
        })
      } else {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, completed: true, loading: false }
              : task
          )
        )

        // Check if all one-time tasks are completed
        const updatedTasks = tasks.map(task => 
          task.id === taskId 
            ? { ...task, completed: true, loading: false }
            : task
        )
        
        const allCompleted = updatedTasks.every(task => task.completed)
        if (allCompleted) {
          setAllTasksCompleted(true)
          // Load daily tasks when one-time tasks are completed
          if (user) {
            loadDailyTasks(user.id)
          }
        }
      }
    }, 15000) // Back to 15 seconds as requested

    // Redirect based on task type
    if (isDailyTask) {
      window.open('https://coinsniper.net/coin/84547', '_blank')
    } else if (taskId === '1') {
      // Follow X task
      window.open('https://x.com/intent/follow?screen_name=ZugChain_org', '_blank')
    } else if (taskId === '2') {
      // Like & RT task - Intent reply with referral link
      if (referralLink) {
        const encodedText = encodeURIComponent(`🚀 Join the fastest Ethereum Layer 2 chain! $ZUG\n\n${referralLink}\n\n#ZUG #Ethereum #Layer2 #Crypto`);
        window.open(`https://x.com/intent/tweet?in_reply_to=1959613010617545139&text=${encodedText}`, '_blank')
      } else {
        // Fallback if no referral link
        const encodedText = encodeURIComponent(`🚀 Join the fastest Ethereum Layer 2 chain! $ZUG #ZUG #Ethereum #Layer2 #Crypto`);
        window.open(`https://x.com/intent/tweet?in_reply_to=1959613010617545139&text=${encodedText}`, '_blank')
      }
    } else if (taskId === '3') {
      // Share your invite link task
      if (referralLink) {
        const encodedText = encodeURIComponent(`🚀 Join the fastest Ethereum Layer 2 chain! $ZUG\n\n${referralLink}\n\n#ZUG #Ethereum #Layer2 #Crypto`);
        window.open(`https://x.com/intent/tweet?text=${encodedText}`, '_blank')
      } else {
        // Fallback if no referral link
        window.open('https://x.com/intent/tweet?text=🚀 Join the fastest Ethereum Layer 2 chain! $ZUG #ZUG #Ethereum #Layer2 #Crypto', '_blank')
      }
    } else if (taskId === '5') {
      // Telegram task
      window.open('https://t.me/zugchain', '_blank')
    } else {
      window.open('https://x.com/settings/profile', '_blank')
    }
  }

  const handleClaimRewards = async () => {
    if (!user || claimingRewards) return

    setClaimingRewards(true)
    
    try {
      const response = await fetch('/api/user/complete-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          totalPoints: 750 // 3 tasks * 150 + 1 task * 200 + 1 task * 100 points
        })
      })

      if (response.ok) {
        // Update local state
        setUserPoints(prev => prev + 750)
        setAllTasksCompleted(true)
        
        // Clear daily tasks cache to force fresh data
        const cacheKey = `daily-tasks-${user.id}`
        sessionStorage.removeItem(cacheKey)
        
        // Load daily tasks after claiming rewards
        loadDailyTasks(user.id)
        
        // Show success modal
        setModalPoints(750)
        setModalType('one_time')
        setShowSuccessModal(true)
      }
    } catch (error) {
      console.error('Error claiming rewards:', error)
    } finally {
      setClaimingRewards(false)
    }
  }

  const handleClaimDailyRewards = async () => {
    if (!user || claimingDailyRewards) return

    setClaimingDailyRewards(true)
    
    try {
      const response = await fetch('/api/daily-tasks/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Update local state
        setUserPoints(prev => prev + data.points)
        setDailyTasksCompleted(false)
        
        // Clear the cache to force fresh data
        const cacheKey = `daily-tasks-${user.id}`
        sessionStorage.removeItem(cacheKey)
        
        // Reset daily tasks to not completed
        setDailyTasks(prevTasks => 
          prevTasks.map(task => ({ ...task, completed: false }))
        )
        // Reload daily tasks to check availability
        loadDailyTasks(user.id)
        
        // Show success modal
        setModalPoints(data.points)
        setModalType('daily')
        setShowSuccessModal(true)
      }
    } catch (error) {
      console.error('Error claiming daily rewards:', error)
    } finally {
      setClaimingDailyRewards(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 mt-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#D6E14E] border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center mt-20">
        <p className="text-gray-500">Please connect your X account to view tasks</p>
      </div>
    )
  }

  const completedTasks = tasks.filter(task => task.completed)

  return (
    <>
      {allTasksCompleted ? (
        <div className="space-y-6 mt-15">
          {/* Daily Tasks Section */}
          <div className="space-y-4">
            <div className="text-center mb-6">
              {countdown && (
                <p className="text-gray-400 text-sm mt-2">Next reset:  <span className='text-gray-800 font-bold text-lg'>{countdown}</span> </p>
              )}
            </div>

            {/* Daily Tasks List */}
            <div className="space-y-4">
              {dailyTasks.map((task) => (
                <div 
                  key={task.id}
                  className={`bg-gradient-to-r from-[#132a13]/90 to-[#1a3a1a]/90 rounded-lg p-4 border transition-all duration-200 ${
                    task.completed 
                      ? 'border-[#D6E14E]/50 bg-[#D6E14E]/10' 
                      : dailyTasksAvailable
                      ? 'border-[#D6E14E]/20 cursor-pointer hover:border-[#D6E14E]/40'
                      : 'border-gray-600/30 opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => dailyTasksAvailable && !task.completed && !task.loading && handleTaskClick(task.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className={`font-semibold ${task.completed ? 'text-[#D6E14E]' : 'text-white'}`}>
                          {task.title}
                        </h4>
                        {!task.isAvailable && task.timeRemaining && (
                          <span className="ml-2 text-xs text-gray-400">
                            ({task.timeRemaining})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="bg-[#D6E14E]/20 px-3 py-1 rounded-lg">
                          <span className="text-[#D6E14E] font-bold text-sm">{task.points} Points</span>
                        </div>
                        <div className="flex items-center">
                          {task.completed && (
                            <svg className="w-5 h-5 text-[#D6E14E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {task.loading && (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#D6E14E] border-t-transparent"></div>
                          )}
                          {!task.completed && !task.loading && dailyTasksAvailable && (
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                          {!task.completed && !task.loading && !dailyTasksAvailable && (
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Daily Claim Button */}
            <div className="text-center mt-8">
              {dailyTasksCompleted ? (
                <button
                  onClick={handleClaimDailyRewards}
                  disabled={claimingDailyRewards}
                  className={`w-full font-bold py-3 px-8 rounded-lg transition-all duration-300 transform ${
                    claimingDailyRewards 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-[#D6E14E] text-black hover:bg-[#b8c93e]'
                  }`}
                >
                  {claimingDailyRewards ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent mr-2"></div>
                      Claiming...
                    </div>
                  ) : (
                    'Claim Daily Reward (100 pts)'
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="bg-gray-600 w-full text-gray-400 font-bold py-3 px-8 rounded-lg cursor-not-allowed"
                >
                  Complete Daily Task First ({dailyTasks.filter(t => t.completed).length}/1)
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 mt-15">
          {/* One-time Tasks Section */}
          <div className="space-y-4">
            

            {/* Tasks List */}
            <div className="space-y-4">
              {tasks.map((task) => (
                <div  
                  key={task.id}
                  className={`bg-gradient-to-r from-[#132a13]/90 to-[#1a3a1a]/90 rounded-lg p-4 border cursor-pointer transition-all duration-200 hover:border-[#D6E14E]/40 ${
                    task.completed 
                      ? 'border-[#D6E14E]/50 bg-[#D6E14E]/10' 
                      : 'border-[#D6E14E]/20'
                  }`}
                  onClick={() => !task.completed && !task.loading && handleTaskClick(task.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className={`font-semibold ${task.completed ? 'text-[#D6E14E]' : 'text-white'}`}>
                          {task.title}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="bg-[#D6E14E]/20 px-3 py-1 rounded-lg">
                          <span className="text-[#D6E14E] font-bold text-sm">{task.points} Points</span>
                        </div>
                        <div className="flex items-center">
                          {task.completed && (
                            <svg className="w-5 h-5 text-[#D6E14E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {task.loading && (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#D6E14E] border-t-transparent"></div>
                          )}
                          {!task.completed && !task.loading && (
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Claim Button */}
            <div className="text-center mt-8">
              {completedTasks.length === 5 ? (
                <button
                  onClick={handleClaimRewards}
                  disabled={claimingRewards}
                  className={`w-full font-bold py-3 px-8 rounded-lg transition-all duration-300 transform ${
                    claimingRewards 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-[#D6E14E] text-black hover:bg-[#b8c93e] hover:scale-105'
                  }`}
                >
                  {claimingRewards ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent mr-2"></div>
                      Claiming...
                    </div>
                  ) : (
                    'Claim Rewards (750 pts)'
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="bg-gray-600 text-gray-400 w-full font-bold py-3 px-8 rounded-lg cursor-not-allowed"
                >
                  Complete Tasks First ({completedTasks.length}/5)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        points={modalPoints}
        type={modalType}
      />
    </>
  )
} 
