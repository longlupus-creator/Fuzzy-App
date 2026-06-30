import { notifications } from '../backend/data'
import { EmptyState, InfoPage } from './shared'
import type { GoToPage } from './types'

export const HelpPage = ({ go }: { go: GoToPage }) => (
  <InfoPage title="Help" go={go} lines={['Order support', 'Payment questions', 'Return request']} />
)

export const TermsConditionsPage = ({ go }: { go: GoToPage }) => (
  <InfoPage title="Terms" go={go} lines={['Secure checkout', 'Easy returns', 'Warranty on selected products']} />
)

export const NotificationPage = ({ go }: { go: GoToPage }) => (
  <InfoPage title="Notification" go={go} lines={notifications} />
)

export const EmptyCartPage = ({ go }: { go: GoToPage }) => (
  <main className="screen">
    <EmptyState title="Your cart is empty" action="Shop now" onAction={() => go('shop')} />
  </main>
)

export const EmptyNotificationPage = ({ go }: { go: GoToPage }) => (
  <main className="screen">
    <EmptyState title="No notifications" action="Home" onAction={() => go('home')} />
  </main>
)

export const EmptyOrderHistoryPage = ({ go }: { go: GoToPage }) => (
  <main className="screen">
    <EmptyState title="No order history" action="Shop now" onAction={() => go('shop')} />
  </main>
)

export const EmptySearchPage = ({ go }: { go: GoToPage }) => (
  <main className="screen">
    <EmptyState title="No search results" action="Home" onAction={() => go('home')} />
  </main>
)

export const EmptyWishlistPage = ({ go }: { go: GoToPage }) => (
  <main className="screen">
    <EmptyState title="Your wishlist is empty" action="Shop now" onAction={() => go('shop')} />
  </main>
)
