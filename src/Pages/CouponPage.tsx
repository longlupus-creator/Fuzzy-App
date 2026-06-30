import { coupons } from '../backend/data'
import { BackHeader } from './shared'
import type { Coupon, GoToPage } from './types'

export function CouponPage({
  go,
  selectedCoupon,
  setSelectedCoupon,
}: {
  go: GoToPage
  selectedCoupon: string
  setSelectedCoupon: (coupon: Coupon) => void
}) {
  return (
    <main className="screen">
      <BackHeader title="Coupon" go={go} />
      <div className="stack">
        {coupons.map((coupon) => (
          <button
            className={`coupon-card ${selectedCoupon === coupon.id ? 'selected' : ''}`}
            key={coupon.id}
            onClick={() => {
              setSelectedCoupon(coupon)
              go('checkout')
            }}
          >
            <span>
              <strong>{coupon.code}</strong>
              <small>{coupon.title}</small>
            </span>
            <b>{coupon.id === 'new' ? '$50' : `${coupon.value}%`}</b>
          </button>
        ))}
      </div>
    </main>
  )
}
