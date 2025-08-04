'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || 'An error occurred'

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md mx-auto p-6 text-center">
        <div className="bg-red-900 text-white px-6 py-4 rounded-lg mb-6">
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p className="text-red-200">{message}</p>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-400">
            There was a problem with the authentication process.
          </p>
          
          <div className="space-y-2 text-sm text-gray-500">
            <p>Possible causes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Environment variables not configured</li>
              <li>Twitter OAuth settings incorrect</li>
              <li>Database connection issues</li>
              <li>Network connectivity problems</li>
            </ul>
          </div>
          
          <div className="pt-4">
            <Link 
              href="/"
              className="bg-[#D6E14E] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#b8c93e] transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 