import { useEffect, useState } from 'react'
import { fuzzyApi } from '../backend/api'
import { asset } from '../backend/data'
import { BackHeader, InfoPage } from './shared'
import type { GoToPage } from './types'

type TrackingOrder = {
  id: string
  status: string
  total: number
  createdAt?: string
}

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const orderStatusLabels: Record<string, string> = {
  pending: 'Chờ xác nhận',
  preparing: 'Đang chuẩn bị',
  shipping: 'Đang trên đường giao',
  completed: 'Đã giao hàng',
  cancelled: 'Đã hủy',
  confirmed: 'Chờ xác nhận',
}

const trackingSteps = [
  ['pending', 'Chờ xác nhận'],
  ['preparing', 'Đang chuẩn bị'],
  ['shipping', 'Đang trên đường giao'],
  ['completed', 'Đã giao hàng'],
]

const statusStepIndex: Record<string, number> = {
  pending: 0,
  confirmed: 0,
  preparing: 1,
  shipping: 2,
  completed: 3,
}

export function OrderTrackingPage({
  go,
  orderId,
  total,
}: {
  go: GoToPage
  orderId: string
  total: number
}) {
  const [order, setOrder] = useState<TrackingOrder | null>(null)

  useEffect(() => {
    void fuzzyApi.getOrders().then((orders) => {
      setOrder(orders.find((item) => item.id === orderId) ?? null)
    })
  }, [orderId])

  const status = order?.status ?? 'pending'
  const paidTotal = order?.total ?? total
  const statusLabel = orderStatusLabels[status] ?? status
  const activeStep = statusStepIndex[status] ?? 0
  const isCancelled = status === 'cancelled'

  return (
    <main className="screen tracking-screen">
      <BackHeader title="Order Tracking" go={go} />
      <img className="success-gif" src={asset('gif/success.gif')} alt="" />
      <h1>{isCancelled ? 'Đơn hàng đã hủy' : 'Đơn hàng đã đặt'}</h1>
      <strong className={`tracking-status ${isCancelled ? 'cancelled' : ''}`}>{statusLabel}</strong>
      <p>
        {orderId} - Tổng tiền đơn hàng: {money.format(paidTotal)}
      </p>
      <div className="timeline">
        {isCancelled ? (
          <span className="cancelled">Đơn hàng đã bị hủy</span>
        ) : (
          trackingSteps.map(([, step], index) => (
          <span className={index < activeStep ? 'done' : index === activeStep ? 'current' : ''} key={step}>
            {step}
          </span>
          ))
        )}
      </div>
      <button className="primary-btn" onClick={() => go('home')}>
        Continue Shopping
      </button>
    </main>
  )
}

export function OrderHistoryPage({ go, orderId }: { go: GoToPage; orderId: string }) {
  const [orders, setOrders] = useState<string[]>([`${orderId} - Processing`])

  useEffect(() => {
    void fuzzyApi.getOrders().then((items) => {
      setOrders(
        items.length
          ? items.map((item) => `${item.id} - ${item.status} - $${item.total}`)
          : [`${orderId} - Processing`],
      )
    })
  }, [orderId])

  return <InfoPage title="Order History" go={go} lines={orders} />
}

export const OrderDetailsPage = OrderHistoryPage
