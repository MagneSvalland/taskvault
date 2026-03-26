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
      <div className="min-h-screen bg-white dark:bg-[#0e0e10] flex items-center justify-center">
        <p className="text-gray-400 dark:text-zinc-500 font-mono text-sm">loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0e0e10] text-gray-900 dark:text-white p-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-light font-mono tracking-tight">tasks</h1>
            <p className="text-gray-500 dark:text-zinc-500 text-xs font-mono mt-1">
              hey, {username}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="text-gray-400 dark:text-zinc-500 text-sm font-mono hover:text-gray-900 dark:hover:text-white transition-colors"
              title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? '☀' : '☾'}
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-500 dark:text-zinc-500 text-sm font-mono hover:text-gray-900 dark:hover:text-white transition-colors"
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
              className="flex-1 bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white rounded-md px-4 py-2.5 text-sm outline-none focus:border-gray-400 dark:focus:border-zinc-600 transition-colors"
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
                      : 'border-gray-200 dark:border-zinc-800 text-gray-400 dark:text-zinc-600'
                  }`}
                >
                  {p[0]}
                </button>
              ))}
            </div>
            <button
              type="submit"
              className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Add
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-gray-500 dark:text-zinc-500 text-xs font-mono">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white rounded-md px-3 py-1.5 text-xs outline-none focus:border-gray-400 dark:focus:border-zinc-600 transition-colors"
            />
          </div>
        </form>

        {/* Filter */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-500 dark:text-zinc-500 text-xs font-mono">
            {tasks.filter(t => t.status === 'ACTIVE').length} tasks left
          </p>
          <div className="flex gap-1">
            {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
                  filter === f
                    ? 'border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {f.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Task list */}
        {filtered.length === 0 ? (
          <p className="text-gray-400 dark:text-zinc-600 text-sm font-mono text-center py-12">
            {filter === 'COMPLETED' ? 'Nothing completed yet.' : 'No tasks yet.'}
          </p>
        ) : (
          <ul className="border border-gray-200 dark:border-zinc-800 rounded-md overflow-hidden">
            {filtered.map((task, i) => (
              <li
                key={task.id}
                className={`flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors ${
                  i !== filtered.length - 1 ? 'border-b border-gray-200 dark:border-zinc-800' : ''
                } ${task.status === 'COMPLETED' ? 'opacity-40' : ''}`}
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
                    <p className={`text-xs font-mono mt-0.5 ${isOverdue(task.dueDate, task.status) ? 'text-rose-400' : 'text-gray-400 dark:text-zinc-500'}`}>
                      {isOverdue(task.dueDate, task.status) ? '⚠ ' : ''}{task.dueDate}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-400 dark:text-zinc-600 hover:text-rose-400 transition-colors text-lg"
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