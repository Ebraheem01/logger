'use client'

import { useState } from 'react'
import { supabase } from '@/app/utils/supabase'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Dev Logger</h1>
          <p className="mt-2 text-muted-foreground">Sign in to continue</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Sending magic link...' : 'Send magic link'}
          </Button>
        </form>
      </div>
    </div>
  )
} 