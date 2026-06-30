import { useState } from 'react'
import type { Product } from '../backend/data'
import { BackHeader, HorizontalProducts, SectionTitle } from './shared'
import type { ProductActions } from './types'

export function ProductDetailsPage({
  product,
  products,
  actions,
}: {
  product: Product
  products: Product[]
  actions: ProductActions
}) {
  const related = products.filter((item) => item.category === product.category && item.id !== product.id)
  const [activeImage, setActiveImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const colors = ['#ae8b2d', '#1e3140', '#6f573f', '#e6e0d5']
  const [selectedColor, setSelectedColor] = useState(colors[0])

  return (
    <main className="screen details-screen">
      <BackHeader title="Product Details" go={actions.go} />
      <section className="detail-image">
        <img src={product.images[activeImage] ?? product.image} alt={product.name} />
      </section>
      <div className="carousel-dots">
        {product.images.map((image, index) => (
          <button
            className={activeImage === index ? 'active' : ''}
            key={image}
            onClick={() => setActiveImage(index)}
            aria-label={`Image ${index + 1}`}
          />
        ))}
      </div>
      <section className="detail-card">
        <div className="detail-title">
          <span>
            <h1>{product.name}</h1>
            <p>
              {product.color} - {product.rating} rating ({product.reviews})
            </p>
          </span>
          <button onClick={() => actions.toggleWishlist(product.id)}>
            {actions.wishlist.includes(product.id) ? '♥' : '♡'}
          </button>
        </div>
        <p>{product.description}</p>
        <div className="choice-group">
          <strong>Size</strong>
          <div className="filter-pills compact">
            {product.sizes.map((size) => (
              <button
                className={selectedSize === size ? 'active' : ''}
                key={size}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div className="swatches">
          {colors.map((color) => (
            <button
              className={selectedColor === color ? 'active' : ''}
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
              aria-label={color}
            />
          ))}
        </div>
        <SectionTitle title="Similar Product" />
        <HorizontalProducts products={related.length ? related : products.slice(0, 3)} actions={actions} />
      </section>
      <div className="pay-popup">
        <div>
          <small>Total price</small>
          <strong>${product.price}.00</strong>
        </div>
        <button onClick={() => actions.addToCart(product)}>Add to cart</button>
      </div>
    </main>
  )
}

export const Product2DetailsPage = ProductDetailsPage
