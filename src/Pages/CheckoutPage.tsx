import { paymentCards } from '../backend/data'
import { BackHeader } from './shared'
import type { CartItem, Coupon, GoToPage } from './types'

export function CheckoutPage({
  go,
  cart,
  subtotal,
  shipping,
  discount,
  total,
  selectedCoupon,
  placeOrder,
}: {
  go: GoToPage
  cart: CartItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  selectedCoupon: Coupon
  placeOrder: () => void
}) {
  return (
    <main className="screen checkout-screen">
      <BackHeader title="Checkout" go={go} />
      <CheckoutRow title="Shipping" value="Standard delivery" onClick={() => go('shipping')} />
      <CheckoutRow title="Address" value="4517 Washington Ave." onClick={() => go('address')} />
      <CheckoutRow title="Payment" value={paymentCards[0].number} onClick={() => go('payment')} />
      <CheckoutRow title="Coupon" value={selectedCoupon.code} onClick={() => go('coupon')} />
      <section className="summary-box">
        <h2>Order Summary</h2>
        <dl>
          <dt>Items ({cart.length})</dt>
          <dd>${subtotal}.00</dd>
          <dt>Shipping</dt>
          <dd>${shipping}.00</dd>
          <dt>Discount</dt>
          <dd>-${discount}.00</dd>
          <dt>Total</dt>
          <dd>${total}.00</dd>
        </dl>
      </section>
      <button className="primary-btn sticky-action" disabled={!cart.length} onClick={placeOrder}>
        Pay Now
      </button>
    </main>
  )
}

function CheckoutRow({ title, value, onClick }: { title: string; value: string; onClick: () => void }) {
  return (
    <button className="checkout-row" onClick={onClick}>
      <span>
        <strong>{title}</strong>
        <small>{value}</small>
      </span>
      <b>-&gt;</b>
    </button>
  )
}
