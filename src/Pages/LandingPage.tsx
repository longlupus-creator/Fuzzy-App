import { asset, categories, type Product } from '../backend/data'
import type { SessionUser } from '../backend/auth'
import type { GoToPage, ProductActions } from './types'

function LandingProductCard({ product, actions }: { product: Product; actions: ProductActions }) {
  const liked = actions.wishlist.includes(product.id)

  return (
    <article className="landing-product-card">
      <button className="landing-product-image" onClick={() => actions.go('product', product.id)}>
        <img src={product.image} alt={product.name} />
      </button>
      <button
        className={`landing-heart ${liked ? 'active' : ''}`}
        onClick={() => actions.toggleWishlist(product.id)}
        aria-label="Wishlist"
      >
        {liked ? '♥' : '♡'}
      </button>
      <button className="landing-bag" onClick={() => actions.addToCart(product)} aria-label="Add to cart">
        <img src={asset('svg/bag.svg')} alt="" />
      </button>
      <h3>{product.name}</h3>
      <p>{product.description.split('.').at(0) ?? product.category}</p>
      <div className="landing-price-row">
        <strong>${product.price}</strong>
        <del>${product.oldPrice}</del>
        <span>★ {product.rating}</span>
      </div>
    </article>
  )
}

function LandingTrendItem({ product, actions }: { product: Product; actions: ProductActions }) {
  return (
    <button className="landing-trend-item" onClick={() => actions.go('product', product.id)}>
      <img src={product.image} alt="" />
      <span>
        <strong>{product.name}</strong>
        <small>{product.category}</small>
      </span>
      <b>${product.price}</b>
    </button>
  )
}

export function LandingPage({
  go,
  query,
  setQuery,
  products,
  actions,
  user,
}: {
  go: GoToPage
  query: string
  setQuery: (value: string) => void
  products: Product[]
  actions: ProductActions
  user?: SessionUser | null
}) {
  const featuredProducts = products.slice(1, 3)
  const trendingProducts = products.slice(3, 6)
  const displayName = user?.name || user?.email?.split('@')[0] || 'Agasya'

  return (
    <main className="screen with-tab landing-screen">
      <header className="landing-header">
        <button className="landing-icon-btn" onClick={() => go('pages')} aria-label="Menu">
          ☰
        </button>
        <div className="landing-user">
          <img src={user?.avatar || asset('icons/profile.png')} alt="" />
          <span>
            <small>Hello</small>
            <strong>{displayName}!</strong>
          </span>
        </div>
        <button className="landing-icon-btn" onClick={() => go('notifications')} aria-label="Notifications">
          <span className="landing-bell-icon" />
        </button>
      </header>

      <div className="landing-search">
        <label>
          <span>⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => go('search')}
            placeholder="Search here..."
          />
        </label>
        <button onClick={() => go('shop')} aria-label="Filter">
          ≡
        </button>
      </div>

      <button className="landing-banner" onClick={() => go('shop')}>
        <img src={asset('banner/banner-1.jpg')} alt="" />
        <span className="landing-banner-copy">
          <strong>Best Selling</strong>
          Comforts & Modern life Stylish Sofa
          <small>View More →</small>
        </span>
      </button>

      <div className="landing-categories">
        {categories.slice(0, 5).map((category, index) => (
          <button className={index === 0 ? 'active' : ''} key={category.id} onClick={() => go('categories')}>
            {category.icon && <img src={category.icon} alt="" />}
            {category.name === 'Cabinet' ? 'Cabinets' : category.name}
          </button>
        ))}
      </div>

      <section className="landing-section">
        <div className="landing-section-title">
          <h2>New Arrivals</h2>
          <button onClick={() => go('shop')}>View All</button>
        </div>
        <div className="landing-product-grid">
          {featuredProducts.map((product) => (
            <LandingProductCard key={product.id} product={product} actions={actions} />
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-title">
          <h2>Trending Furniture</h2>
          <button onClick={() => go('shop')}>View All</button>
        </div>
        <div className="landing-trend-list">
          {trendingProducts.map((product) => (
            <LandingTrendItem key={product.id} product={product} actions={actions} />
          ))}
        </div>
      </section>
    </main>
  )
}
