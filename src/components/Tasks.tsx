'use client'

import { useState, useEffect } from 'react'

interface Task {
  id: string
  title: string
  description: string
  points: number
  completed: boolean
  loading: boolean
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

export default function Tasks() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [userPoints, setUserPoints] = useState(0)
  const [allTasksCompleted, setAllTasksCompleted] = useState(false)

  useEffect(() => {
    async function checkUserAuth() {
      try {
        const response = await fetch('/api/auth/check')
        const data = await response.json()
        
        if (data.authenticated && data.user) {
          setUser(data.user)
          loadUserPoints(data.user.id)
          if (data.user.tasks) {
            setAllTasksCompleted(true)
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
        description: 'Follow ZUG on X',
        points: 25,
        completed: false,
        loading: false
      },
      {
        id: '2',
        title: 'Like & RT',
        description: 'Like and retweet our latest post',
        points: 25,
        completed: false,
        loading: false
      },
      {
        id: '3',
        title: 'Share your invite link',
        description: 'Share your referral link on X',
        points: 25,
        completed: false,
        loading: false
      },
      {
        id: '4',
        title: 'Add "ZUG" to X name & ref links to bio',
        description: 'Update your X profile with ZUG',
        points: 25,
        completed: false,
        loading: false
      }
    ]
    setTasks(mockTasks)
  }

  const handleTaskClick = async (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, loading: true }
          : task
      )
    )

    // Simulate 15 second loading
    setTimeout(() => {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId 
            ? { ...task, completed: true, loading: false }
            : task
        )
      )

      // Check if all tasks are completed
      const updatedTasks = tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: true, loading: false }
          : task
      )
      
      const allCompleted = updatedTasks.every(task => task.completed)
      if (allCompleted) {
        setAllTasksCompleted(true)
      }
    }, 15000)

    // Redirect to X profile settings
    window.open('https://x.com/settings/profile', '_blank')
  }

  const handleClaimRewards = async () => {
    if (!user) return

    try {
      const response = await fetch('/api/user/complete-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          totalPoints: 100 // 4 tasks * 25 points each
        })
      })

      if (response.ok) {
        // Update local state
        setUserPoints(prev => prev + 100)
        setAllTasksCompleted(true)
        alert('Tasks completed! 100 points added to your account.')
      }
    } catch (error) {
      console.error('Error claiming rewards:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
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

  if (allTasksCompleted) {
    return (
      <div className="space-y-6 mt-20">
        <div className="bg-gradient-to-r from-[#132a13]/80 to-[#1a3a1a]/80 rounded-xl p-6 border border-[#D6E14E]/30">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#D6E14E]/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#D6E14E]">
              <svg className="w-8 h-8 text-[#D6E14E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#D6E14E] mb-2">All Tasks Completed!</h3>
            <p className="text-gray-400">You have successfully completed all tasks.</p>
          </div>
        </div>
      </div>
    )
  }

  const completedTasks = tasks.filter(task => task.completed)

  return (
    <div className="space-y-6 mt-20">
      {/* Tasks List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[#D6E14E] text-center mb-6">Complete These Tasks</h3>
        
        {tasks.map((task) => (
          <div 
            key={task.id}
            className={`bg-gradient-to-r from-[#132a13]/60 to-[#1a3a1a]/60 rounded-lg p-4 border cursor-pointer transition-all duration-200 hover:border-[#D6E14E]/40 ${
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
                  {task.completed && (
                    <svg className="w-5 h-5 text-[#D6E14E] ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {task.loading && (
                    <div className="ml-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#D6E14E] border-t-transparent"></div>
                    </div>
                  )}
                </div>
                <p className="text-gray-400 text-sm">{task.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[#D6E14E] font-bold">{task.points} pts</span>
                  {!task.completed && !task.loading && (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Claim Button */}
      <div className="text-center mt-8">
        {completedTasks.length === 4 ? (
          <button
            onClick={handleClaimRewards}
            className="bg-[#D6E14E] text-black font-bold py-3 px-8 rounded-lg hover:bg-[#b8c93e] transition-all duration-300 transform hover:scale-105"
          >
            Claim Rewards (100 pts)
          </button>
        ) : (
          <button
            disabled
            className="bg-gray-600 text-gray-400 font-bold py-3 px-8 rounded-lg cursor-not-allowed"
          >
            Complete Tasks First ({completedTasks.length}/4)
          </button>
        )}
      </div>
    </div>
  )
} 
