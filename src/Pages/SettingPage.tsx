import { useState } from 'react'
import { defaultUser, updateStoredUser, type SessionUser } from '../backend/auth'
import { BackHeader } from './shared'
import type { GoToPage } from './types'

export function SettingPage({
  go,
  user,
  onUserChange,
}: {
  go: GoToPage
  user?: SessionUser | null
  onUserChange?: (user: SessionUser) => void
}) {
  const [form, setForm] = useState<SessionUser>(user ?? defaultUser)
  const updateField = (field: keyof SessionUser, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const saveProfile = () => {
    updateStoredUser(form)
    onUserChange?.(form)
    go('profile')
  }

  return (
    <main className="screen">
      <BackHeader title="Profile Setting" go={go} />
      <div className="stack">
        <label className="profile-field">
          <span>Họ tên</span>
          <input value={form.name} onChange={(event) => updateField('name', event.target.value)} />
        </label>
        <label className="profile-field">
          <span>Số điện thoại</span>
          <input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
        </label>
        <label className="profile-field">
          <span>Ngày sinh</span>
          <input
            type="date"
            value={form.birthDate}
            onChange={(event) => updateField('birthDate', event.target.value)}
          />
        </label>
        <label className="profile-field">
          <span>Avatar URL</span>
          <input value={form.avatar} onChange={(event) => updateField('avatar', event.target.value)} />
        </label>
        <label className="switch-row">
          <span>RTL</span>
          <input type="checkbox" />
        </label>
        <label className="switch-row">
          <span>Dark mode</span>
          <input type="checkbox" />
        </label>
        <label className="switch-row">
          <span>Push notification</span>
          <input type="checkbox" defaultChecked />
        </label>
      </div>
      <button className="primary-btn sticky-action" onClick={saveProfile}>
        Save Profile
      </button>
    </main>
  )
}

export const ProfileSettingPage = SettingPage
