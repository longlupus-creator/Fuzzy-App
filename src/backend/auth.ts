export type SessionUser = {
  id: string
  name: string
  email: string
  phone: string
  birthDate: string
  avatar: string
  status?: 'active' | 'inactive'
  isBlocked?: boolean
  lastLoginAt?: string
}

export type Session = {
  token: string
  expiresAt: number
  user: SessionUser
}

const SESSION_KEY = 'fuzzy_session'
const API_URL = 'http://127.0.0.1:4000/api'

const encode = (value: string) => window.btoa(encodeURIComponent(value))
const decode = (value: string) => decodeURIComponent(window.atob(value))

export const defaultUser: SessionUser = {
  id: 'user-1',
  name: 'Agasya',
  email: 'agasya@example.com',
  phone: '+1 234 567 8900',
  birthDate: '1998-06-18',
  avatar: '/fuzzy/assets/images/icons/profile.png',
}

export function createSession(email: string, name = 'Agasya'): Session {
  return {
    token: `jwt.${crypto.randomUUID()}.fuzzy`,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    user: {
      ...defaultUser,
      id: crypto.randomUUID(),
      name,
      email,
    },
  }
}

export function saveSession(session: Session) {
  localStorage.setItem(SESSION_KEY, encode(JSON.stringify(session)))
}

export function readSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY)

  if (!raw) return null

  try {
    const session = JSON.parse(decode(raw)) as Session

    if (session.expiresAt <= Date.now()) {
      clearSession()
      return null
    }

    return session
  } catch {
    clearSession()
    return null
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function updateStoredUser(user: SessionUser) {
  const session = readSession()

  if (!session) return

  saveSession({ ...session, user })
}

async function authRequest(path: string, body: unknown): Promise<Session> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({ message: 'Auth failed' }))) as {
      message?: string
    }
    throw new Error(payload.message ?? 'Auth failed')
  }

  return (await response.json()) as Session
}

export async function loginUser(email: string, password: string) {
  try {
    const session = await authRequest('/auth/login', { email, password })
    saveSession(session)
    return session
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid credentials') {
      throw error
    }

    const session = createSession(email, email.split('@')[0] || 'Agasya')
    saveSession(session)
    return session
  }
}

export async function registerUser(email: string, password: string, name?: string) {
  try {
    const session = await authRequest('/auth/register', { email, password, name })
    saveSession(session)
    return session
  } catch {
    const session = createSession(email, name ?? email.split('@')[0] ?? 'Agasya')
    saveSession(session)
    return session
  }
}

export async function oauthLogin(provider: string) {
  try {
    const session = await authRequest(`/auth/oauth/${provider.toLowerCase()}`, {
      email: `${provider.toLowerCase()}@fuzzy.local`,
      name: provider,
    })
    saveSession(session)
    return session
  } catch {
    const session = createSession(`${provider.toLowerCase()}@fuzzy.local`, provider)
    saveSession(session)
    return session
  }
}
