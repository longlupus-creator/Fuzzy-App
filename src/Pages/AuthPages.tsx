import { useState } from 'react'
import { loginUser, oauthLogin, registerUser, type SessionUser } from '../backend/auth'
import { asset } from '../backend/data'
import type { GoToPage, Page } from './types'

type AuthMode = 'login' | 'signup' | 'forgot' | 'otp' | 'reset'

export function AuthPage({
  mode,
  go,
  onUserChange,
}: {
  mode: AuthMode
  go: GoToPage
  onUserChange?: (user: SessionUser) => void
}) {
  const [email, setEmail] = useState('agasya@example.com')
  const [password, setPassword] = useState('Fuzzy@123')
  const [confirmPassword, setConfirmPassword] = useState('Fuzzy@123')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const copy = {
    login: ['Login Account', 'Welcome back to Fuzzy.'],
    signup: ['Create Account', 'Build your furniture wish list.'],
    forgot: ['Forgot Password', 'Enter your email to receive a code.'],
    otp: ['OTP Verification', 'Enter the 4 digit verification code.'],
    reset: ['Reset Password', 'Create a new secure password.'],
  }[mode]
  const nextPage: Record<AuthMode, Page> = {
    login: 'home',
    signup: 'home',
    forgot: 'otp',
    otp: 'reset',
    reset: 'login',
  }
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const passwordStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)

  const submit = async () => {
    if (mode !== 'otp' && !emailValid) {
      setMessage('Email không đúng định dạng.')
      return
    }

    if ((mode === 'login' || mode === 'signup' || mode === 'reset') && !passwordStrong) {
      setMessage('Mật khẩu cần tối thiểu 8 ký tự, có chữ hoa, chữ thường và số.')
      return
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setMessage('Mật khẩu xác nhận chưa khớp.')
      return
    }

    if (mode === 'login' || mode === 'signup') {
      try {
        const session =
          mode === 'login'
            ? await loginUser(email, password)
            : await registerUser(email, password, email.split('@')[0])
        onUserChange?.(session.user)
      } catch {
        setMessage('Sai mật khẩu, vui lòng nhập lại.')
        return
      }
    }

    setMessage('')
    go(nextPage[mode])
  }

  const socialLogin = async (provider: string) => {
    const session = await oauthLogin(provider)
    onUserChange?.(session.user)
    go('home')
  }

  return (
    <main className="auth-page">
      <div className="auth-visual">
        <img src={asset('background/auth_bg.jpg')} alt="" />
        <h1>{copy[0]}</h1>
        <p>{copy[1]}</p>
      </div>
      <section className="auth-form">
        {mode !== 'otp' && (
          <input
            aria-invalid={!emailValid}
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        )}
        {(mode === 'login' || mode === 'signup' || mode === 'reset') && (
          <label className="password-field">
            <input
              aria-invalid={!passwordStrong}
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button type="button" onClick={() => setShowPassword((value) => !value)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </label>
        )}
        {mode === 'signup' && (
          <input
            placeholder="Confirm password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        )}
        {mode === 'otp' && (
          <div className="otp-row">
            {[1, 2, 3, 4].map((item) => (
              <input key={item} maxLength={1} defaultValue={item === 1 ? '2' : ''} />
            ))}
          </div>
        )}
        {message && <p className="form-error">{message}</p>}
        <button className="primary-btn" onClick={submit}>
          {mode === 'login' ? 'Login' : mode === 'signup' ? 'Sign Up' : 'Continue'}
        </button>
        {mode === 'login' && (
          <>
            <button className="text-btn" onClick={() => go('forgot')}>
              Forgot password?
            </button>
            <div className="social-row">
              <button onClick={() => socialLogin('Google')} aria-label="Google login">
                <img src={asset('svg/google.svg')} alt="Google" />
              </button>
              <button onClick={() => socialLogin('Facebook')} aria-label="Facebook login">
                <img src={asset('svg/facebook.svg')} alt="Facebook" />
              </button>
              <button onClick={() => socialLogin('Apple')} aria-label="Apple login">
                <img src={asset('svg/apple.svg')} alt="Apple" />
              </button>
            </div>
            <p className="switch-copy">
              Do not have an account? <button onClick={() => go('signup')}>Sign up</button>
            </p>
          </>
        )}
        {mode === 'signup' && (
          <p className="switch-copy">
            Already have an account? <button onClick={() => go('login')}>Login</button>
          </p>
        )}
      </section>
    </main>
  )
}

export const LoginPage = ({ go, onUserChange }: { go: GoToPage; onUserChange?: (user: SessionUser) => void }) => (
  <AuthPage mode="login" go={go} onUserChange={onUserChange} />
)
export const CreateAccountPage = ({
  go,
  onUserChange,
}: {
  go: GoToPage
  onUserChange?: (user: SessionUser) => void
}) => <AuthPage mode="signup" go={go} onUserChange={onUserChange} />
export const ForgotPasswordPage = ({ go }: { go: GoToPage }) => <AuthPage mode="forgot" go={go} />
export const OtpPage = ({ go }: { go: GoToPage }) => <AuthPage mode="otp" go={go} />
export const ResetPasswordPage = ({ go }: { go: GoToPage }) => <AuthPage mode="reset" go={go} />
