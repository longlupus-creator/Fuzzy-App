import { useState } from 'react'
import { paymentCards } from '../backend/data'
import { addresses as defaultAddresses, type Address } from '../backend/data'
import { BackHeader } from './shared'
import type { GoToPage, Page } from './types'

export function SimplePicker({
  title,
  go,
  items,
  next,
}: {
  title: string
  go: GoToPage
  items: string[]
  next: Page
}) {
  return (
    <main className="screen">
      <BackHeader title={title} go={go} />
      <div className="stack">
        {items.map((item, index) => (
          <label className="radio-row" key={item}>
            <span>{item}</span>
            <input name={title} type="radio" defaultChecked={index === 0} />
          </label>
        ))}
      </div>
      <button className="primary-btn sticky-action" onClick={() => go(next)}>
        Continue
      </button>
    </main>
  )
}

export function ShippingPage({ go }: { go: GoToPage }) {
  return <SimplePicker title="Shipping" go={go} items={['Standard', 'Express', 'Same day']} next="checkout" />
}

export function LanguagePage({ go }: { go: GoToPage }) {
  return <SimplePicker title="Language" go={go} items={['English', 'Vietnamese', 'French']} next="profile" />
}

export function ManageAddressPage({ go }: { go: GoToPage }) {
  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('fuzzy_addresses') ?? 'null') ?? defaultAddresses
    } catch {
      return defaultAddresses
    }
  })
  const [editing, setEditing] = useState<Address | null>(null)
  const persist = (next: Address[]) => {
    setAddresses(next)
    localStorage.setItem('fuzzy_addresses', JSON.stringify(next))
  }
  const saveAddress = () => {
    if (!editing) return

    const exists = addresses.some((address) => address.id === editing.id)
    const next = exists
      ? addresses.map((address) => (address.id === editing.id ? editing : address))
      : [...addresses, editing]

    persist(editing.isDefault ? next.map((item) => ({ ...item, isDefault: item.id === editing.id })) : next)
    setEditing(null)
  }

  return (
    <main className="screen">
      <BackHeader title="Shipping Address" go={go} />
      <div className="stack">
        {addresses.map((address) => (
          <article className="option-card address-card" key={address.id}>
            <strong>
              {address.label} {address.isDefault ? '(Default)' : ''}
            </strong>
            <p>{address.line}</p>
            <small>{address.phone}</small>
            <div className="inline-actions">
              <button onClick={() => setEditing(address)}>Edit</button>
              <button onClick={() => persist(addresses.filter((item) => item.id !== address.id))}>Delete</button>
              <button
                onClick={() =>
                  persist(addresses.map((item) => ({ ...item, isDefault: item.id === address.id })))
                }
              >
                Default
              </button>
            </div>
          </article>
        ))}
      </div>
      {editing && (
        <section className="bottom-sheet open">
          <div className="sheet-panel">
            <h2>{addresses.some((address) => address.id === editing.id) ? 'Edit address' : 'New address'}</h2>
            <input
              value={editing.label}
              onChange={(event) => setEditing({ ...editing, label: event.target.value })}
              placeholder="Label"
            />
            <input
              value={editing.line}
              onChange={(event) => setEditing({ ...editing, line: event.target.value })}
              placeholder="Address"
            />
            <input
              value={editing.phone}
              onChange={(event) => setEditing({ ...editing, phone: event.target.value })}
              placeholder="Phone"
            />
            <label className="switch-row">
              <span>Default address</span>
              <input
                type="checkbox"
                checked={editing.isDefault}
                onChange={(event) => setEditing({ ...editing, isDefault: event.target.checked })}
              />
            </label>
            <div className="sheet-actions">
              <button onClick={() => setEditing(null)}>Cancel</button>
              <button className="primary-btn" onClick={saveAddress}>
                Save
              </button>
            </div>
          </div>
        </section>
      )}
      <button
        className="secondary-btn"
        onClick={() =>
          setEditing({
            id: crypto.randomUUID(),
            label: 'New Address',
            name: 'Agasya',
            line: '',
            phone: '',
            isDefault: !addresses.length,
          })
        }
      >
        Add Address
      </button>
      <button className="primary-btn sticky-action" onClick={() => go('checkout')}>
        Use Address
      </button>
    </main>
  )
}

export const ShippingAddressPage = ManageAddressPage
export const NewAddressPage = ManageAddressPage

export function ManagePaymentPage({ go }: { go: GoToPage }) {
  const paymentMethods = ['COD', 'Bank Transfer', 'VNPay', 'Momo']

  return (
    <main className="screen">
      <BackHeader title="Payment" go={go} />
      <div className="stack">
        {paymentMethods.map((method, index) => (
          <label className="radio-row" key={method}>
            <span>{method}</span>
            <input
              name="payment-method"
              type="radio"
              defaultChecked={index === 0}
              onChange={() => localStorage.setItem('fuzzy_payment_method', method)}
            />
          </label>
        ))}
        {paymentCards.map((card) => (
          <article className="payment-card" key={card.id}>
            <strong>{card.type}</strong>
            <p>{card.number}</p>
            <small>
              {card.holder} - {card.expiry}
            </small>
          </article>
        ))}
      </div>
      <button className="primary-btn sticky-action" onClick={() => go('checkout')}>
        Continue
      </button>
    </main>
  )
}

export const PaymentPage = ManagePaymentPage
export const NewCardPage = ManagePaymentPage
