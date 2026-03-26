'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { clearAuth, getUsername, isAuthenticated } from '@/lib/auth'
import { Task, TaskRequest } from '@/types'
import { useTheme } from '@/components/ThemeProvider'

export default function DashboardPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM')
  const [dueDate, setDueDate] = useState('')
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL')
  const username = getUsername()
  const { dark, toggle } = useTheme()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    fetchTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await api.get<Task[]>('/api/tasks')
      setTasks(res.data)
    } catch {
      console.error('Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const request: TaskRequest = {
      title,
      description: description || undefined,
      priority,
      dueDate: dueDate || undefined,
    }

    try {
      const res = await api.post<Task>('/api/tasks', request)
      setTasks(prev => [res.data, ...prev])
      setTitle('')
      setDescription('')
      setDueDate('')
      setPriority('MEDIUM')
    } catch {
      console.error('Failed to add task')
    }
  }

  const toggleTask = async (id: number) => {
    try {
      const res = await api.patch<Task>(`/api/tasks/${id}/toggle`)
      setTasks(prev => prev.map(t => t.id === id ? res.data : t))
    } catch {
      console.error('Failed to toggle task')
    }
  }

  const deleteTask = async (id: number) => {
    try {
      await api.delete(`/api/tasks/${id}`)
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch {
      console.error('Failed to delete task')
    }
  }

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  const filtered = tasks.filter(t => {
    if (filter === 'ACTIVE') return t.status === 'ACTIVE'
    if (filter === 'COMPLETED') return t.status === 'COMPLETED'
    return true
  })

  const priorityColor = {
    LOW: 'bg-zinc-600',
    MEDIUM: 'bg-indigo-500',
    HIGH: 'bg-rose-500',
  }

  const isOverdue = (dueDate?: string, status?: string) => {
    if (!dueDate || status === 'COMPLETED') return false
    return new Date(dueDate) < new Date(new Date().toDateString())
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
            <h1 className="text-3xl font-light font-mono tracking-tight">tasks</h1>
            <p className="text-xs font-mono mt-1" style={{ color: 'var(--tv-text-muted)' }}>
              hey, {username}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="text-sm font-mono transition-colors"
              style={{ color: 'var(--tv-text-muted)' }}
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? '☀' : '☾'}
            </button>
            <button
              onClick={handleLogout}
              className="text-sm font-mono transition-colors"
              style={{ color: 'var(--tv-text-muted)' }}
            >
              sign out
            </button>
          </div>
        </div>

        {/* Add task form */}
        <form onSubmit={addTask} className="mb-8 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 rounded-md px-4 py-2.5 text-sm outline-none transition-colors border"
              style={{ background: 'var(--tv-bg-input)', borderColor: 'var(--tv-border)', color: 'var(--tv-text)' }}
            />
            <div className="flex gap-1">
              {(['LOW', 'MEDIUM', 'HIGH'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`w-8 h-10 rounded-md border text-xs font-mono transition-all ${
                    priority === p
                      ? p === 'LOW' ? 'border-zinc-500 text-zinc-400'
                        : p === 'MEDIUM' ? 'border-indigo-500 text-indigo-400'
                        : 'border-rose-500 text-rose-400'
                      : ''
                  }`}
                  style={priority !== p ? { borderColor: 'var(--tv-border)', color: 'var(--tv-text-faint)' } : {}}
                >
                  {p[0]}
                </button>
              ))}
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
              style={{ background: 'var(--tv-btn)', color: 'var(--tv-btn-text)' }}
            >
              Add
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-xs font-mono" style={{ color: 'var(--tv-text-muted)' }}>Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="rounded-md px-3 py-1.5 text-xs outline-none transition-colors border"
              style={{ background: 'var(--tv-bg-input)', borderColor: 'var(--tv-border)', color: 'var(--tv-text)' }}
            />
          </div>
        </form>

        {/* Filter */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs font-mono" style={{ color: 'var(--tv-text-muted)' }}>
            {tasks.filter(t => t.status === 'ACTIVE').length} tasks left
          </p>
          <div className="flex gap-1">
            {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1 rounded-md text-xs font-mono transition-all border"
                style={filter === f
                  ? { borderColor: 'var(--tv-border)', color: 'var(--tv-text)' }
                  : { borderColor: 'transparent', color: 'var(--tv-text-muted)' }
                }
              >
                {f.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Task list */}
        {filtered.length === 0 ? (
          <p className="text-sm font-mono text-center py-12" style={{ color: 'var(--tv-text-faint)' }}>
            {filter === 'COMPLETED' ? 'Nothing completed yet.' : 'No tasks yet.'}
          </p>
        ) : (
          <ul className="rounded-md overflow-hidden border" style={{ borderColor: 'var(--tv-border)' }}>
            {filtered.map((task, i) => (
              <li
                key={task.id}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${task.status === 'COMPLETED' ? 'opacity-40' : ''}`}
                style={{
                  background: 'var(--tv-bg-card)',
                  borderBottom: i !== filtered.length - 1 ? `1px solid var(--tv-border)` : undefined,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--tv-bg-hover)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--tv-bg-card)')}
              >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${priorityColor[task.priority]}`} />
                <input
                  type="checkbox"
                  checked={task.status === 'COMPLETED'}
                  onChange={() => toggleTask(task.id)}
                  className="accent-indigo-500 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${task.status === 'COMPLETED' ? 'line-through' : ''}`}>
                    {task.title}
                  </p>
                  {task.dueDate && (
                    <p className={`text-xs font-mono mt-0.5 ${isOverdue(task.dueDate, task.status) ? 'text-rose-400' : ''}`}
                      style={!isOverdue(task.dueDate, task.status) ? { color: 'var(--tv-text-muted)' } : {}}>
                      {isOverdue(task.dueDate, task.status) ? '⚠ ' : ''}{task.dueDate}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="hover:text-rose-400 transition-colors text-lg"
                  style={{ color: 'var(--tv-text-faint)' }}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}