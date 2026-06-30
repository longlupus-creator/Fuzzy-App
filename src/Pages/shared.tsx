import { asset, categories, products, type Product } from '../backend/data'
import type { GoToPage, Page, ProductActions } from './types'

export function BackHeader({ title, go }: { title: string; go: GoToPage }) {
  return (
    <header className="back-header">
      <button onClick={() => window.history.back()} aria-label="Back">
        &lt;-
      </button>
      <h1>{title}</h1>
      <button onClick={() => go('cart')} aria-label="Cart">
        Bag
      </button>
    </header>
  )
}

export function Header({ go, title = 'Agasya!' }: { go: GoToPage; title?: string }) {
  return (
    <header className="top-header">
      <button className="icon-btn" onClick={() => go('pages')} aria-label="Menu">
        =
      </button>
      <div className="user-chip">
        <img src={asset('icons/profile.png')} alt="" />
        <span>
          <small>Hello</small>
          <strong>{title}</strong>
        </span>
      </div>
      <button className="icon-btn" onClick={() => go('notifications')} aria-label="Notifications">
        !
      </button>
    </header>
  )
}

export function SearchBar({
  query,
  setQuery,
  go,
}: {
  query: string
  setQuery: (value: string) => void
  go: GoToPage
}) {
  return (
    <div className="search-row">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => go('search')}
        placeholder="Search here..."
      />
      <button onClick={() => go('shop')} aria-label="Filter">
        Filter
      </button>
    </div>
  )
}

export function CategoryRail({ go }: { go: GoToPage }) {
  return (
    <div className="category-rail">
      {categories.map((item) => (
        <button key={item.id} onClick={() => go('categories')}>
          {item.icon && <img src={item.icon} alt="" />}
          <span>{item.name}</span>
        </button>
      ))}
    </div>
  )
}

export function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string
  action?: string
  onAction?: () => void
}) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {action && <button onClick={onAction}>{action}</button>}
    </div>
  )
}

export function ProductGrid({ products, actions }: { products: Product[]; actions: ProductActions }) {
  if (!products.length) {
    return <EmptyState title="No products found" action="Home" onAction={() => actions.go('home')} />
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} actions={actions} />
      ))}
    </div>
  )
}

export function ProductCard({ product, actions }: { product: Product; actions: ProductActions }) {
  const liked = actions.wishlist.includes(product.id)

  return (
    <article className="product-card">
      <button className="product-image" onClick={() => actions.go('product', product.id)}>
        <img src={product.image} alt={product.name} />
      </button>
      <button
        className={`heart-btn ${liked ? 'active' : ''}`}
        onClick={() => actions.toggleWishlist(product.id)}
        aria-label="Wishlist"
      >
        {liked ? '♥' : '♡'}
      </button>
      <h3>{product.name}</h3>
      <p>{product.category}</p>
      <div className="price-row">
        <strong>${product.price}</strong>
        <del>${product.oldPrice}</del>
        <button onClick={() => actions.addToCart(product)}>Bag</button>
      </div>
    </article>
  )
}

export function HorizontalProducts({ products, actions }: { products: Product[]; actions: ProductActions }) {
  return (
    <div className="horizontal-list">
      {products.map((product) => (
        <button key={product.id} className="mini-product" onClick={() => actions.go('product', product.id)}>
          <img src={product.image} alt="" />
          <span>
            <strong>{product.name}</strong>
            <small>${product.price}</small>
          </span>
        </button>
      ))}
    </div>
  )
}

export function EmptyState({
  title,
  action,
  onAction,
}: {
  title: string
  action: string
  onAction: () => void
}) {
  return (
    <section className="empty-state">
      <img src={asset('gif/cart.gif')} alt="" />
      <h2>{title}</h2>
      <button className="primary-btn" onClick={onAction}>
        {action}
      </button>
    </section>
  )
}

export function InfoPage({ title, go, lines }: { title: string; go: GoToPage; lines: string[] }) {
  return (
    <main className="screen">
      <BackHeader title={title} go={go} />
      <div className="stack">
        {lines.length ? (
          lines.map((line) => (
            <article className="option-card" key={line}>
              <p>{line}</p>
            </article>
          ))
        ) : (
          <EmptyState title={`No ${title.toLowerCase()}`} action="Home" onAction={() => go('home')} />
        )}
      </div>
    </main>
  )
}

export function TabBar({ page, go, cartCount }: { page: Page; go: GoToPage; cartCount: number }) {
  const tabs: Array<[Page, string, string]> = [
    ['home', 'Home', 'home.svg'],
    ['categories', 'Categories', 'categories.svg'],
    ['cart', `Cart${cartCount ? ` ${cartCount}` : ''}`, 'bag.svg'],
    ['wishlist', 'Wishlist', 'heart.svg'],
    ['profile', 'Profile', 'profile.svg'],
  ]

  return (
    <nav className="tab-bar">
      {tabs.map(([tab, label, icon]) => (
        <button className={page === tab ? 'active' : ''} key={tab} onClick={() => go(tab)}>
          <img src={asset(`svg/${icon}`)} alt="" />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

export function PageMenu({ go, title, pages }: { go: GoToPage; title: string; pages: Array<[string, Page]> }) {
  return (
    <main className="screen">
      <BackHeader title={title} go={go} />
      <div className="menu-list">
        {pages.map(([label, page]) => (
          <button key={label} onClick={() => go(page, page === 'product' ? products[0].id : undefined)}>
            {label}
            <span>-&gt;</span>
          </button>
        ))}
      </div>
    </main>
  )
}
