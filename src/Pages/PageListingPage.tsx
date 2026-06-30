import { PageMenu } from './shared'
import type { GoToPage, Page } from './types'

export function PageListingPage({ go }: { go: GoToPage }) {
  const pages: Array<[string, Page]> = [
    ['Login', 'login'],
    ['Create Account', 'signup'],
    ['Forgot Password', 'forgot'],
    ['Landing', 'home'],
    ['Categories', 'categories'],
    ['Shop', 'shop'],
    ['Product Details', 'product'],
    ['Cart', 'cart'],
    ['Checkout', 'checkout'],
    ['Coupon', 'coupon'],
    ['Shipping Address', 'address'],
    ['Payment', 'payment'],
    ['Order Tracking', 'tracking'],
    ['Wishlist', 'wishlist'],
    ['Profile', 'profile'],
    ['Setting', 'settings'],
    ['Admin', 'admin'],
  ]

  return <PageMenu title="Pages List" go={go} pages={pages} />
}
