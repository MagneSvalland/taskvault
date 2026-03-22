'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { saveAuth } from '@/lib/auth'
import { AuthResponse } from '@/types'

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await api.post<AuthResponse>('/api/auth/register', {
        username,
        email,
        password,
      })
      saveAuth(res.data)
      router.push('/dashboard')
    } catch {
      setError('Username or email already taken')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-light text-white font-mono tracking-tight mb-2">
          taskvault
        </h1>
        <p className="text-zinc-500 text-sm font-mono mb-8">create an account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-md px-4 py-3 text-sm outline-none focus:border-zinc-600 transition-colors"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-md px-4 py-3 text-sm outline-none focus:border-zinc-600 transition-colors"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-md px-4 py-3 text-sm outline-none focus:border-zinc-600 transition-colors"
            required
          />

          {error && (
            <p className="text-red-400 text-sm font-mono">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-medium py-3 rounded-md text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {loading ? 'creating account...' : 'create account'}
          </button>
        </form>

        <p className="text-zinc-500 text-sm mt-6 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-white hover:underline">
            sign in
          </Link>
        </p>
      </div>
    </div>
  )
}