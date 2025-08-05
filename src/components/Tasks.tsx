'use client'

import { useState, useEffect } from 'react'

interface Task {
  id: string
  title: string
  description: string
  points: number
  completed: boolean
  type: 'daily' | 'weekly' | 'one-time'
  progress?: number
  maxProgress?: number
}

interface User {
  id: string
  twitter_id: string
  username: string
  display_name: string
  profile_image_url: string
  created_at: string
  updated_at: string
}

export default function Tasks() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [userPoints, setUserPoints] = useState(0)

  useEffect(() => {
    async function checkUserAuth() {
      try {
        const response = await fetch('/api/auth/check')
        const data = await response.json()
        
        if (data.authenticated && data.user) {
          setUser(data.user)
          loadUserPoints(data.user.id)
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
    // Mock tasks data - in real app this would come from API
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Daily Login',
        description: 'Log in to your account today',
        points: 10,
        completed: false,
        type: 'daily',
        progress: 0,
        maxProgress: 1
      },
      {
        id: '2',
        title: 'Share on X',
        description: 'Share your referral link on X',
        points: 25,
        completed: false,
        type: 'daily',
        progress: 0,
        maxProgress: 3
      },
      {
        id: '3',
        title: 'Invite Friends',
        description: 'Invite 5 friends to join',
        points: 100,
        completed: false,
        type: 'one-time',
        progress: 0,
        maxProgress: 5
      },
      {
        id: '4',
        title: 'Complete Profile',
        description: 'Complete your profile information',
        points: 50,
        completed: false,
        type: 'one-time',
        progress: 0,
        maxProgress: 1
      },
      {
        id: '5',
        title: 'Weekly Engagement',
        description: 'Engage with the community this week',
        points: 75,
        completed: false,
        type: 'weekly',
        progress: 0,
        maxProgress: 7
      }
    ]
    setTasks(mockTasks)
  }

  const handleTaskComplete = async (taskId: string) => {
    // In real app, this would call an API to mark task as complete
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: true, progress: task.maxProgress }
          : task
      )
    )
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

  const completedTasks = tasks.filter(task => task.completed)
  const totalPoints = completedTasks.reduce((sum, task) => sum + task.points, 0)

  return (
    <div className="space-y-6">
      {/* User Stats */}
      <div className="bg-gradient-to-r from-[#132a13]/80 to-[#1a3a1a]/80 rounded-xl p-6 border border-[#D6E14E]/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {user.profile_image_url ? (
              <img 
                src={user.profile_image_url} 
                alt={user.display_name}
                className="w-10 h-10 rounded-full mr-3"
              />
            ) : (
              <div className="w-10 h-10 bg-[#D6E14E] rounded-full flex items-center justify-center mr-3">
                <span className="text-black font-bold">
                  {user.display_name?.charAt(0) || user.username?.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-white font-semibold">{user.display_name}</h3>
              <p className="text-[#D6E14E] text-sm">@{user.username}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[#D6E14E] font-bold text-2xl">{userPoints}</p>
            <p className="text-gray-400 text-sm">Total Points</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-[#D6E14E] font-bold text-lg">{completedTasks.length}</p>
            <p className="text-gray-400 text-xs">Completed</p>
          </div>
          <div>
            <p className="text-[#D6E14E] font-bold text-lg">{tasks.length - completedTasks.length}</p>
            <p className="text-gray-400 text-xs">Remaining</p>
          </div>
          <div>
            <p className="text-[#D6E14E] font-bold text-lg">{totalPoints}</p>
            <p className="text-gray-400 text-xs">Earned</p>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[#D6E14E]">Available Tasks</h3>
        
        {tasks.map((task) => (
          <div 
            key={task.id}
            className={`bg-gradient-to-r from-[#132a13]/60 to-[#1a3a1a]/60 rounded-lg p-4 border ${
              task.completed 
                ? 'border-[#D6E14E]/50 bg-[#D6E14E]/10' 
                : 'border-[#D6E14E]/20'
            }`}
          >
            <div className="flex items-start justify-between">
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
                </div>
                <p className="text-gray-400 text-sm mb-3">{task.description}</p>
                
                {task.maxProgress && task.maxProgress > 1 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{task.progress || 0}/{task.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-[#D6E14E] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((task.progress || 0) / task.maxProgress) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.type === 'daily' ? 'bg-blue-500/20 text-blue-300' :
                      task.type === 'weekly' ? 'bg-purple-500/20 text-purple-300' :
                      'bg-orange-500/20 text-orange-300'
                    }`}>
                      {task.type === 'daily' ? 'Daily' : task.type === 'weekly' ? 'Weekly' : 'One-time'}
                    </span>
                    <span className="text-[#D6E14E] font-bold">{task.points} pts</span>
                  </div>
                  
                  {!task.completed && (
                    <button
                      onClick={() => handleTaskComplete(task.id)}
                      className="bg-[#D6E14E] text-black px-3 py-1 rounded-lg text-sm font-medium hover:bg-[#b8c93e] transition-colors"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 