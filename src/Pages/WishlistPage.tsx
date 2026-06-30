import type { Product } from '../backend/data'
import { BackHeader, ProductGrid } from './shared'
import type { GoToPage, ProductActions } from './types'

export function WishlistPage({
  go,
  products,
  actions,
}: {
  go: GoToPage
  products: Product[]
  actions: ProductActions
}) {
  return (
    <main className="screen with-tab">
      <BackHeader title="Wishlist" go={go} />
      <ProductGrid products={products} actions={actions} />
    </main>
  )
}
