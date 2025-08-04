import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  
  // Get stored state, referrer ID, and code verifier from cookies
  const storedState = request.cookies.get('oauth_state')?.value
  const referrerId = request.cookies.get('referrer_id')?.value
  const codeVerifier = request.cookies.get('code_verifier')?.value
  
  // Get the base URL for absolute redirects
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${request.headers.get('host')}`
  
  // Validate state parameter
  if (!state || !storedState || state !== storedState) {
    return NextResponse.redirect(`${baseUrl}/error?message=Invalid state parameter`)
  }
  
  if (!code) {
    return NextResponse.redirect(`${baseUrl}/error?message=No authorization code received`)
  }
  
  if (!codeVerifier) {
    return NextResponse.redirect(`${baseUrl}/error?message=No code verifier found`)
  }
  
  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.TWITTER_CALLBACK_URL!,
        code_verifier: codeVerifier
      })
    })
    
    const tokenData = await tokenResponse.json()
    
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData)
      return NextResponse.redirect(`${baseUrl}/error?message=Token exchange failed`)
    }
    
    // Get user info from Twitter
    const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    })
    
    const userData = await userResponse.json()
    
    if (!userResponse.ok) {
      console.error('Failed to get user data:', userData)
      return NextResponse.redirect(`${baseUrl}/error?message=Failed to get user data`)
    }
    
    console.log('Twitter API response:', userData)
    const twitterUser = userData.data
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('twitter_id', twitterUser.id)
      .single()
    
    if (existingUser) {
      // User already exists, just log in
      const response = NextResponse.redirect(`${baseUrl}/Airdrop`)
      response.cookies.delete('oauth_state')
      response.cookies.delete('referrer_id')
      response.cookies.delete('code_verifier')
      // Set session token
      response.cookies.set('session_token', existingUser.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
      
      // Update session token in database
      await supabase
        .from('users')
        .update({ session_token: existingUser.id })
        .eq('id', existingUser.id)
      
      return response
    }
    
    // Create new user
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        twitter_id: twitterUser.id,
        username: twitterUser.username,
        display_name: twitterUser.name,
        profile_image_url: twitterUser.profile_image_url || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (userError) {
      console.error('Error creating user:', userError)
      return NextResponse.redirect(`${baseUrl}/error?message=Failed to create user`)
    }
    
    // Add points to new user
    const { error: pointsError } = await supabase
      .from('user_points')
      .insert({
        user_id: newUser.id,
        points: 50,
        usda_amount: 0.125, // 50 points * 0.0025
        source: 'signup',
        created_at: new Date().toISOString()
      })
    
    if (pointsError) {
      console.error('Error adding points to new user:', pointsError)
    }
    
    // If there's a referrer, add points to them
    if (referrerId) {
      const { data: referrer } = await supabase
        .from('users')
        .select('*')
        .eq('username', referrerId)
        .single()
      
      if (referrer) {
        const { error: referrerPointsError } = await supabase
          .from('user_points')
          .insert({
            user_id: referrer.id,
            points: 100,
            usda_amount: 0.25, // 100 points * 0.0025
            source: 'referral',
            referred_user_id: newUser.id,
            created_at: new Date().toISOString()
          })
        
        if (referrerPointsError) {
          console.error('Error adding points to referrer:', referrerPointsError)
        }
      }
    }
    
    // Clear cookies and redirect
    const response = NextResponse.redirect(`${baseUrl}/Airdrop`)
    response.cookies.delete('oauth_state')
    response.cookies.delete('referrer_id')
    response.cookies.delete('code_verifier')
    // Set session token
    response.cookies.set('session_token', newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    // Update session token in database
    await supabase
      .from('users')
      .update({ session_token: newUser.id })
      .eq('id', newUser.id)
    
    return response
    
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(`${baseUrl}/error?message=OAuth callback failed`)
  }
} 