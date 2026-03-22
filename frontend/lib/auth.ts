import Cookies from 'js-cookie'
import { AuthResponse } from '@/types'

export function saveAuth(data: AuthResponse) {
  Cookies.set('token', data.token, { expires: 1 })
  Cookies.set('username', data.username, { expires: 1 })
}

export function clearAuth() {
  Cookies.remove('token')
  Cookies.remove('username')
}

export function getToken(): string | undefined {
  return Cookies.get('token')
}

export function getUsername(): string | undefined {
  return Cookies.get('username')
}

export function isAuthenticated(): boolean {
  return !!Cookies.get('token')
}