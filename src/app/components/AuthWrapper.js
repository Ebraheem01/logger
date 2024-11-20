'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import Auth from '@/app/components/Auth'

const AuthWrapper = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Auth />
  }

  return children
}

export default AuthWrapper 