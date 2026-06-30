import type { coupons, Product } from '../backend/data'

export type Page =
  | 'onboarding'
  | 'login'
  | 'signup'
  | 'forgot'
  | 'otp'
  | 'reset'
  | 'home'
  | 'shop'
  | 'categories'
  | 'search'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'shipping'
  | 'address'
  | 'payment'
  | 'coupon'
  | 'tracking'
  | 'orders'
  | 'wishlist'
  | 'profile'
  | 'settings'
  | 'language'
  | 'help'
  | 'terms'
  | 'notifications'
  | 'pages'
  | 'admin'

export type GoToPage = (page: Page, id?: number) => void

export type CartItem = {
  product: Product
  quantity: number
}

export type ProductActions = {
  go: GoToPage
  addToCart: (product: Product) => void
  toggleWishlist: (productId: number) => void
  wishlist: number[]
}

export type CheckoutTotals = {
  subtotal: number
  shipping: number
  discount: number
  total: number
}

export type Coupon = (typeof coupons)[number]
