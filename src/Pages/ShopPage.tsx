import { useEffect, useMemo, useState } from 'react'
import { categories, type Product } from '../backend/data'
import { BackHeader, ProductGrid, SearchBar } from './shared'
import type { GoToPage, ProductActions } from './types'

export function ShopPage({
  go,
  title = 'Shop',
  products,
  query,
  setQuery,
  category,
  setCategory,
  actions,
}: {
  go: GoToPage
  title?: string
  products: Product[]
  query: string
  setQuery: (value: string) => void
  category: string
  setCategory: (value: string) => void
  actions: ProductActions
}) {
  const [visibleCount, setVisibleCount] = useState(4)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sort, setSort] = useState('featured')
  const sortedProducts = useMemo(() => {
    const next = [...products]

    if (sort === 'low') next.sort((a, b) => a.price - b.price)
    if (sort === 'high') next.sort((a, b) => b.price - a.price)
    if (sort === 'rating') next.sort((a, b) => b.rating - a.rating)

    return next
  }, [products, sort])
  const visibleProducts = sortedProducts.slice(0, visibleCount)

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 180

      if (nearBottom) {
        setVisibleCount((count) => Math.min(count + 4, sortedProducts.length))
      }
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [sortedProducts.length])

  return (
    <main className="screen with-tab">
      <BackHeader title={title} go={go} />
      <SearchBar query={query} setQuery={setQuery} go={go} />
      <button className="secondary-btn full" onClick={() => setSheetOpen(true)}>
        Filter & Sort
      </button>
      <div className="filter-pills">
        <button
          className={category === 'all' ? 'active' : ''}
          onClick={() => {
            setVisibleCount(4)
            setCategory('all')
          }}
        >
          All
        </button>
        {categories.map((item) => (
          <button
            key={item.id}
            className={category === item.id ? 'active' : ''}
            onClick={() => {
              setVisibleCount(4)
              setCategory(item.id)
            }}
          >
            {item.name}
          </button>
        ))}
      </div>
      <ProductGrid products={visibleProducts} actions={actions} />
      {visibleCount < sortedProducts.length && <p className="loading-note">Loading more products...</p>}
      {sheetOpen && (
        <section className="bottom-sheet open">
          <div className="sheet-panel">
            <h2>Filter & Sort</h2>
            <strong>Category</strong>
            <div className="filter-pills wrap">
              <button
                className={category === 'all' ? 'active' : ''}
                onClick={() => {
                  setVisibleCount(4)
                  setCategory('all')
                }}
              >
                All
              </button>
              {categories.map((item) => (
                <button
                  key={item.id}
                  className={category === item.id ? 'active' : ''}
                  onClick={() => {
                    setVisibleCount(4)
                    setCategory(item.id)
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <strong>Sort</strong>
            <div className="filter-pills wrap">
              {[
                ['featured', 'Featured'],
                ['low', 'Price Low'],
                ['high', 'Price High'],
                ['rating', 'Top Rated'],
              ].map(([value, label]) => (
                <button
                  className={sort === value ? 'active' : ''}
                  key={value}
                  onClick={() => {
                    setVisibleCount(4)
                    setSort(value)
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <button className="primary-btn" onClick={() => setSheetOpen(false)}>
              Apply
            </button>
          </div>
        </section>
      )}
    </main>
  )
}
