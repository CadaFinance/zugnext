'use client'

import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  apiResponseTime: number
  componentLoadTime: number
  totalRequests: number
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    apiResponseTime: 0,
    componentLoadTime: 0,
    totalRequests: 0
  })

  useEffect(() => {
    const startTime = performance.now()
    
    // Monitor API calls
    const originalFetch = window.fetch
    let requestCount = 0
    
    window.fetch = async (...args) => {
      const start = performance.now()
      requestCount++
      
      try {
        const response = await originalFetch(...args)
        const end = performance.now()
        
        setMetrics(prev => ({
          ...prev,
          apiResponseTime: end - start,
          totalRequests: requestCount
        }))
        
        return response
      } catch (error) {
        const end = performance.now()
        setMetrics(prev => ({
          ...prev,
          apiResponseTime: end - start,
          totalRequests: requestCount
        }))
        throw error
      }
    }
    
    const endTime = performance.now()
    setMetrics(prev => ({
      ...prev,
      componentLoadTime: endTime - startTime
    }))
    
    return () => {
      window.fetch = originalFetch
    }
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs z-50">
      <div>API: {metrics.apiResponseTime.toFixed(0)}ms</div>
      <div>Load: {metrics.componentLoadTime.toFixed(0)}ms</div>
      <div>Requests: {metrics.totalRequests}</div>
    </div>
  )
} 