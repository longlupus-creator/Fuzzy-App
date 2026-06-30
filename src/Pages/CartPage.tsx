import { useState } from 'react'
import { BackHeader, EmptyState } from './shared'
import type { CartItem, GoToPage } from './types'

export function CartPage({
  go,
  cart,
  subtotal,
  total,
  updateQuantity,
  removeFromCart,
}: {
  go: GoToPage
  cart: CartItem[]
  subtotal: number
  total: number
  updateQuantity: (id: number, delta: number) => void
  removeFromCart: (id: number) => void
}) {
  const [dragStart, setDragStart] = useState<Record<number, number>>({})
  const [dragOffset, setDragOffset] = useState<Record<number, number>>({})
  const startSwipe = (id: number, x: number) => {
    setDragStart((items) => ({ ...items, [id]: x }))
  }
  const moveSwipe = (id: number, x: number) => {
    const start = dragStart[id]

    if (start === undefined) return

    setDragOffset((items) => ({ ...items, [id]: Math.min(0, x - start) }))
  }
  const endSwipe = (id: number) => {
    if ((dragOffset[id] ?? 0) < -90) {
      removeFromCart(id)
    }

    setDragStart((items) => ({ ...items, [id]: 0 }))
    setDragOffset((items) => ({ ...items, [id]: 0 }))
  }

  return (
    <main className="screen cart-screen">
      <BackHeader title="Cart" go={go} />
      {cart.length ? (
        <div className="cart-list">
          {cart.map((item) => (
            <article
              className="cart-item"
              key={item.product.id}
              style={{ transform: `translateX(${dragOffset[item.product.id] ?? 0}px)` }}
              onPointerDown={(event) => startSwipe(item.product.id, event.clientX)}
              onPointerMove={(event) => moveSwipe(item.product.id, event.clientX)}
              onPointerUp={() => endSwipe(item.product.id)}
              onPointerCancel={() => endSwipe(item.product.id)}
            >
              <img src={item.product.image} alt="" />
              <span>
                <strong>{item.product.name}</strong>
                <small>
                  Qty: {item.quantity} - {item.product.color}
                </small>
                <b>${item.product.price * item.quantity}</b>
              </span>
              <div className="quantity">
                <button onClick={() => updateQuantity(item.product.id, -1)}>-</button>
                <input value={item.quantity} readOnly />
                <button onClick={() => updateQuantity(item.product.id, 1)}>+</button>
              </div>
              <button className="trash-btn" onClick={() => removeFromCart(item.product.id)}>
                Remove
              </button>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="Your cart is empty" action="Shop now" onAction={() => go('shop')} />
      )}
      <div className="pay-popup">
        <div>
          <small>Total price</small>
          <strong>${cart.length ? total : subtotal}.00</strong>
        </div>
        <button disabled={!cart.length} onClick={() => go('checkout')}>
          Checkout
        </button>
      </div>
    </main>
  )
}
