export interface User {
  username: string
  email: string
  token: string
}

export interface Task {
  id: number
  title: string
  description?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  status: 'ACTIVE' | 'COMPLETED'
  dueDate?: string
  createdAt: string
}

export interface TaskRequest {
  title: string
  description?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate?: string
}

export interface AuthResponse {
  token: string
  username: string
  email: string
}