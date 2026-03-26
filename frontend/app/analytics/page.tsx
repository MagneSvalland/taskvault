'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import api from '@/lib/api'
import { isAuthenticated } from '@/lib/auth'
import { Task } from '@/types'
import { useTheme } from '@/components/ThemeProvider'

export default function AnalyticsPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { dark, toggle } = useTheme()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    api.get<Task[]>('/api/tasks').then(res => {
      setTasks(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const completed = tasks.filter(t => t.status === 'COMPLETED').length
  const active = tasks.filter(t => t.status === 'ACTIVE').length
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0

  const priorityData = [
    { name: 'Low', value: tasks.filter(t => t.priority === 'LOW').length, color: '#71717a' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'MEDIUM').length, color: '#6366f1' },
    { name: 'High', value: tasks.filter(t => t.priority === 'HIGH').length, color: '#f43f5e' },
  ]

  const statusData = [
    { name: 'Active', value: active },
    { name: 'Completed', value: completed },
  ]

  const axisColor = dark ? '#52525b' : '#9ca3af'
  const tooltipStyle = {
    background: dark ? '#18181b' : '#ffffff',
    border: `1px solid ${dark ? '#27272a' : '#e5e7eb'}`,
    color: dark ? '#ffffff' : '#111827',
    borderRadius: '6px',
    fontSize: '12px',
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--tv-bg)' }}>
        <p className="font-mono text-sm" style={{ color: 'var(--tv-text-muted)' }}>loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--tv-bg)', color: 'var(--tv-text)' }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-light font-mono tracking-tight">stats</h1>
            <p className="text-xs font-mono mt-1" style={{ color: 'var(--tv-text-muted)' }}>
              your productivity overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="text-sm font-mono" style={{ color: 'var(--tv-text-muted)' }}>
              {dark ? '☀' : '☾'}
            </button>
            <Link href="/dashboard" className="text-sm font-mono" style={{ color: 'var(--tv-text-muted)' }}>
              ← back
            </Link>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'total', value: tasks.length },
            { label: 'completed', value: completed },
            { label: 'completion', value: `${completionRate}%` },
          ].map(card => (
            <div key={card.label} className="rounded-md p-4 border" style={{ background: 'var(--tv-bg-card)', borderColor: 'var(--tv-border)' }}>
              <p className="text-2xl font-mono font-light">{card.value}</p>
              <p className="text-xs font-mono mt-1" style={{ color: 'var(--tv-text-muted)' }}>{card.label}</p>
            </div>
          ))}
        </div>

        {tasks.length === 0 ? (
          <p className="text-sm font-mono text-center py-12" style={{ color: 'var(--tv-text-faint)' }}>
            No tasks yet — add some to see stats.
          </p>
        ) : (
          <>
            {/* Priority breakdown bar chart */}
            <div className="rounded-md p-5 border mb-4" style={{ background: 'var(--tv-bg-card)', borderColor: 'var(--tv-border)' }}>
              <p className="text-xs font-mono mb-4" style={{ color: 'var(--tv-text-muted)' }}>tasks by priority</p>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={priorityData} barSize={32}>
                  <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 11, fontFamily: 'monospace' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: axisColor, fontSize: 11, fontFamily: 'monospace' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={false} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {priorityData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Status pie chart */}
            <div className="rounded-md p-5 border" style={{ background: 'var(--tv-bg-card)', borderColor: 'var(--tv-border)' }}>
              <p className="text-xs font-mono mb-4" style={{ color: 'var(--tv-text-muted)' }}>active vs completed</p>
              <div className="flex items-center gap-8">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                      <Cell fill="#6366f1" />
                      <Cell fill={dark ? '#27272a' : '#e5e7eb'} />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-sm font-mono">{active} active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: dark ? '#27272a' : '#e5e7eb', border: '1px solid var(--tv-border)' }} />
                    <span className="text-sm font-mono">{completed} completed</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
