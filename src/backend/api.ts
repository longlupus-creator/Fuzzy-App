import {
  addresses,
  categories,
  coupons,
  notifications,
  paymentCards,
  products,
  type Product,
} from './data'
import type { SessionUser } from './auth'

const API_URL = 'http://127.0.0.1:4000/api'

const wait = <T,>(value: T) =>
  new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), 120)
  })

async function request<T>(path: string, options?: RequestInit, fallback?: T): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
      ...options,
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    return (await response.json()) as T
  } catch {
    if (fallback !== undefined) return wait(fallback)
    throw new Error('Backend unavailable')
  }
}

const hydrateProduct = (product: Product) => ({
  ...products.find((item) => item.id === product.id),
  ...product,
})

export const fuzzyApi = {
  getCategories: () => wait(categories),
  getProducts: async () => {
    const result = await request<Product[]>('/products', undefined, products)
    return result.map(hydrateProduct)
  },
  getProduct: async (id: number) => {
    const fallback = products.find((product) => product.id === id) ?? products[0]
    const result = await request<Product>(`/products/${id}`, undefined, fallback)

    return hydrateProduct(result)
  },
  searchProducts: (query: string, category = 'all') => {
    const normalizedQuery = query.trim().toLowerCase()
    const result = products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery)
      const matchesCategory = category === 'all' || product.category === category

      return matchesQuery && matchesCategory
    })

    return request<Product[]>(
      `/products?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`,
      undefined,
      result,
    ).then((items) => items.map(hydrateProduct))
  },
  getAddresses: () => wait(addresses),
  getPaymentCards: () => wait(paymentCards),
  getCoupons: () => wait(coupons),
  getNotifications: () => wait(notifications),
  getAdminProducts: () =>
    request<Product[]>('/products?includeHidden=true', undefined, products).then((items) =>
      items.map(hydrateProduct),
    ),
  saveProduct: (product: Product, isNew = false) =>
    request<Product>(
      isNew ? '/products' : `/products/${product.id}`,
      {
        method: isNew ? 'POST' : 'PUT',
        body: JSON.stringify(product),
      },
      product,
    ),
  hideProduct: (id: number) =>
    request<{ ok: boolean }>(
      `/products/${id}`,
      {
        method: 'DELETE',
      },
      { ok: true },
    ),
  getUsers: () => request<SessionUser[]>('/users', undefined, []),
  updateUser: (user: SessionUser) =>
    request<SessionUser>(
      `/users/${user.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(user),
      },
      user,
    ),
  deleteUser: (id: string) =>
    request<{ ok: boolean }>(
      `/users/${id}`,
      {
        method: 'DELETE',
      },
      { ok: true },
    ),
  createCategory: (name: string) =>
    request<{ name: string }>(
      '/categories',
      {
        method: 'POST',
        body: JSON.stringify({ name }),
      },
      { name },
    ),
  updateCategory: (oldName: string, name: string) =>
    request<{ name: string }>(
      `/categories/${encodeURIComponent(oldName)}`,
      {
        method: 'PUT',
        body: JSON.stringify({ name }),
      },
      { name },
    ),
  deleteCategory: (name: string) =>
    request<{ ok: boolean }>(
      `/categories/${encodeURIComponent(name)}`,
      {
        method: 'DELETE',
      },
      { ok: true },
    ),
  getOrders: () =>
    request<Array<{ id: string; status: string; total: number; createdAt?: string }>>('/orders', undefined, []),
  updateOrderStatus: (id: string, status: string) =>
    request<{ id: string; status: string }>(
      `/orders/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      },
      { id, status },
    ),
  createOrder: (items: Array<{ product: Product; quantity: number }>, total: number) =>
    request(
      '/orders',
      {
        method: 'POST',
        body: JSON.stringify({ items, total }),
      },
      {
      id: `FU-${Date.now().toString().slice(-5)}`,
      status: 'confirmed',
      items,
      total,
      eta: '30 Jun 2026',
      },
    ),
  createPayment: (method: string, amount: number, orderId?: string) =>
    request(
      '/payments/create',
      {
        method: 'POST',
        body: JSON.stringify({ method, amount, orderId }),
      },
      {
        id: `PAY-${Date.now().toString().slice(-6)}`,
        method,
        amount,
        orderId,
        status: method === 'COD' ? 'pending_cod' : 'waiting_redirect',
      },
    ),
}
