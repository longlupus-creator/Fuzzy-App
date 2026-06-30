import { categories, products } from '../backend/data'
import { BackHeader } from './shared'
import type { GoToPage } from './types'

export function CategoriesPage({
  go,
  category,
  setCategory,
}: {
  go: GoToPage
  category: string
  setCategory: (value: string) => void
}) {
  return (
    <main className="screen with-tab">
      <BackHeader title="Categories" go={go} />
      <div className="category-list">
        {categories.map((item) => (
          <button
            key={item.id}
            className={category === item.id ? 'selected' : ''}
            onClick={() => {
              setCategory(item.id)
              go('shop')
            }}
          >
            {item.icon ? <img src={item.icon} alt="" /> : <span className="category-letter">{item.name[0]}</span>}
            <strong>{item.name}</strong>
            <small>{products.filter((product) => product.category === item.id).length} items</small>
          </button>
        ))}
      </div>
    </main>
  )
}
