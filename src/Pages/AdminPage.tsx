import { useEffect, useState } from 'react'
import { fuzzyApi } from '../backend/api'
import { asset, products as fallbackProducts, type Product } from '../backend/data'
import type { SessionUser } from '../backend/auth'
import { BackHeader } from './shared'
import type { GoToPage } from './types'

type AdminOrder = {
  id: string
  status: string
  total: number
  createdAt?: string
}

const orderStatuses = [
  ['pending', 'Chờ xác nhận'],
  ['preparing', 'Đang chuẩn bị'],
  ['shipping', 'Đang giao'],
  ['completed', 'Hoàn thành'],
  ['cancelled', 'Đã hủy'],
]

const userStatuses = [
  ['active', 'Đang hoạt động'],
  ['inactive', 'Không hoạt động'],
] as const

const getUserStatus = (user: SessionUser) => user.status ?? 'inactive'

const formatDate = (value?: string) => {
  if (!value) return 'Chưa có ngày'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const blankProduct = (): Product => ({
  ...fallbackProducts[0],
  id: Date.now(),
  name: 'Sản phẩm mới',
  category: 'sofa',
  color: 'Brown',
  sizes: ['M'],
  price: 100,
  oldPrice: 120,
  stock: 1,
  hidden: false,
  rating: 4.5,
  reviews: 0,
  image: asset('product/1.png'),
  images: [asset('product/1.png')],
  description: 'Mô tả sản phẩm mới.',
})

export function AdminPage({ go }: { go: GoToPage }) {
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [users, setUsers] = useState<SessionUser[]>([])
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingUser, setEditingUser] = useState<SessionUser | null>(null)
  const [categoryDraft, setCategoryDraft] = useState('')
  const [message, setMessage] = useState('')

  const activeUsers = users.filter((user) => getUserStatus(user) === 'active').length
  const inactiveUsers = users.length - activeUsers
  const visibleProducts = products.filter((product) => !product.hidden).length
  const lowStockProducts = products.filter((product) => !product.hidden && product.stock <= 5).length
  const orderRevenue = orders.reduce((total, order) => total + order.total, 0)
  const sortedUsers = [...users].sort((left, right) =>
    getUserStatus(left).localeCompare(getUserStatus(right)) || left.name.localeCompare(right.name),
  )

  const loadAdminData = async () => {
    const [nextProducts, nextUsers, nextOrders, nextCategories] = await Promise.all([
      fuzzyApi.getAdminProducts(),
      fuzzyApi.getUsers(),
      fuzzyApi.getOrders(),
      fuzzyApi.getCategories(),
    ])

    setProducts(nextProducts)
    setUsers(nextUsers)
    setOrders(nextOrders)
    setCategories(nextCategories.map((category) => (typeof category === 'string' ? category : category.id)))
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAdminData()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  const saveProduct = async () => {
    if (!editingProduct) return

    await fuzzyApi.saveProduct(editingProduct, !products.some((product) => product.id === editingProduct.id))
    setEditingProduct(null)
    setMessage('Đã lưu sản phẩm.')
    await loadAdminData()
  }

  const updateProductVisibility = async (product: Product, hidden: boolean) => {
    await fuzzyApi.saveProduct({ ...product, hidden })
    setMessage(hidden ? 'Đã ẩn sản phẩm.' : 'Đã hiển thị sản phẩm.')
    await loadAdminData()
  }

  const saveUser = async () => {
    if (!editingUser) return

    await fuzzyApi.updateUser(editingUser)
    setEditingUser(null)
    setMessage('Đã lưu tài khoản.')
    await loadAdminData()
  }

  const deleteUser = async (id: string) => {
    await fuzzyApi.deleteUser(id)
    setMessage('Đã xóa tài khoản.')
    await loadAdminData()
  }

  const addCategory = async () => {
    if (!categoryDraft.trim()) return

    await fuzzyApi.createCategory(categoryDraft)
    setCategoryDraft('')
    setMessage('Đã thêm danh mục.')
    await loadAdminData()
  }

  const renameCategory = async (oldName: string) => {
    const nextName = window.prompt('Tên danh mục mới', oldName)

    if (!nextName) return

    await fuzzyApi.updateCategory(oldName, nextName)
    setMessage('Đã cập nhật danh mục.')
    await loadAdminData()
  }

  const deleteCategory = async (name: string) => {
    await fuzzyApi.deleteCategory(name)
    setMessage('Đã xóa danh mục.')
    await loadAdminData()
  }

  const updateOrderStatus = async (id: string, status: string) => {
    await fuzzyApi.updateOrderStatus(id, status)
    setMessage('Đã cập nhật đơn hàng.')
    await loadAdminData()
  }

  return (
    <main className="screen admin-screen">
      <BackHeader title="Admin" go={go} />
      {message && <p className="admin-message">{message}</p>}

      <section className="admin-hero">
        <span>
          <small>Bảng điều khiển</small>
          <h2>Quản lý cửa hàng Fuzzy</h2>
        </span>
        <div className="admin-hero-metrics">
          <strong>${orderRevenue}</strong>
          <small>Doanh thu đơn hàng</small>
        </div>
      </section>

      <section className="admin-metrics" aria-label="Tổng quan quản trị">
        <article>
          <small>Đơn hàng</small>
          <strong>{orders.length}</strong>
        </article>
        <article>
          <small>Sản phẩm</small>
          <strong>{visibleProducts}</strong>
        </article>
        <article>
          <small>Tài khoản</small>
          <strong>{users.length}</strong>
        </article>
        <article>
          <small>Sắp hết</small>
          <strong>{lowStockProducts}</strong>
        </article>
      </section>

      <section className="admin-section admin-orders">
        <div className="admin-section-head">
          <span>
            <small>Vận hành</small>
            <h2>Đơn hàng</h2>
          </span>
          <b>{orders.length}</b>
        </div>
        <div className="stack">
          {orders.length ? (
            orders.map((order) => (
              <article className="admin-order-card" key={order.id}>
                <div>
                  <strong>{order.id}</strong>
                  <span className="admin-price">${order.total}</span>
                </div>
                <p>{formatDate(order.createdAt)}</p>
                <select value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value)}>
                  {orderStatuses.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </article>
            ))
          ) : (
            <p className="admin-empty">Chưa có đơn hàng.</p>
          )}
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <span>
            <small>Kho hàng</small>
            <h2>Sản phẩm</h2>
          </span>
          <button className="admin-add-btn" onClick={() => setEditingProduct(blankProduct())}>
            Thêm
          </button>
        </div>
        <div className="admin-product-list">
          {products.map((product) => (
            <article className="admin-product-card" key={product.id}>
              <img src={product.image} alt="" />
              <div>
                <strong>{product.name}</strong>
                <p>{product.category}</p>
                <div className="admin-card-meta">
                  <span>${product.price}</span>
                  <span>Tồn: {product.stock}</span>
                  <span className={product.hidden ? 'muted-badge' : 'live-badge'}>
                    {product.hidden ? 'Đã ẩn' : 'Hiển thị'}
                  </span>
                </div>
                <div className="inline-actions">
                  <button onClick={() => setEditingProduct(product)}>Sửa</button>
                  <button onClick={() => updateProductVisibility(product, !product.hidden)}>
                    {product.hidden ? 'Hiển thị' : 'Ẩn'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <span>
            <small>Phân loại</small>
            <h2>Danh mục</h2>
          </span>
          <b>{categories.length}</b>
        </div>
        <div className="admin-inline-form">
          <input
            value={categoryDraft}
            onChange={(event) => setCategoryDraft(event.target.value)}
            placeholder="Tên danh mục"
          />
          <button className="primary-btn" onClick={addCategory}>
            Thêm
          </button>
        </div>
        <div className="admin-category-grid">
          {categories.map((category) => (
            <span className="admin-pill" key={category}>
              {category}
              <button onClick={() => renameCategory(category)}>Sửa</button>
              <button onClick={() => deleteCategory(category)}>Xóa</button>
            </span>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <span>
            <small>Khách hàng</small>
            <h2>Tài khoản</h2>
          </span>
          <b>{users.length}</b>
        </div>
        <div className="admin-user-stats" aria-label="Tổng quan tài khoản">
          <span>
            <strong>{users.length}</strong>
            Tổng
          </span>
          <span>
            <strong>{activeUsers}</strong>
            Hoạt động
          </span>
          <span>
            <strong>{inactiveUsers}</strong>
            Không hoạt động
          </span>
        </div>
        <div className="stack admin-user-list">
          {sortedUsers.length ? (
            sortedUsers.map((user) => {
              const status = getUserStatus(user)

              return (
                <article className="admin-user-card" key={user.id}>
                  <div className="admin-user-main">
                    <span className="admin-user-avatar">{user.name.slice(0, 1).toUpperCase()}</span>
                    <span>
                      <strong>{user.name}</strong>
                      <small>{user.email}</small>
                    </span>
                  </div>
                  <span className={`status-badge ${status}`}>
                    {status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                  </span>
                  <p>Số điện thoại: {user.phone || 'Chưa có số điện thoại'}</p>
                  <p>Lần đăng nhập cuối: {formatDate(user.lastLoginAt).replace('Chưa có ngày', 'Chưa đăng nhập')}</p>
                  <div className="inline-actions">
                    <button onClick={() => setEditingUser(user)}>Sửa</button>
                    <button onClick={() => deleteUser(user.id)}>Xóa</button>
                  </div>
                </article>
              )
            })
          ) : (
            <p className="admin-empty">Chưa có tài khoản đăng ký.</p>
          )}
        </div>
      </section>

      {editingProduct && (
        <section className="bottom-sheet open">
          <div className="sheet-panel">
            <h2>Sửa sản phẩm</h2>
            <input
              value={editingProduct.name}
              onChange={(event) => setEditingProduct({ ...editingProduct, name: event.target.value })}
              placeholder="Tên sản phẩm"
            />
            <input
              value={editingProduct.category}
              onChange={(event) => setEditingProduct({ ...editingProduct, category: event.target.value })}
              placeholder="Danh mục"
            />
            <input
              type="number"
              value={editingProduct.price}
              onChange={(event) => setEditingProduct({ ...editingProduct, price: Number(event.target.value) })}
              placeholder="Giá"
            />
            <input
              type="number"
              value={editingProduct.stock}
              onChange={(event) => setEditingProduct({ ...editingProduct, stock: Number(event.target.value) })}
              placeholder="Tồn kho"
            />
            <input
              value={editingProduct.color}
              onChange={(event) => setEditingProduct({ ...editingProduct, color: event.target.value })}
              placeholder="Màu sắc"
            />
            <input
              value={editingProduct.sizes.join(',')}
              onChange={(event) =>
                setEditingProduct({
                  ...editingProduct,
                  sizes: event.target.value.split(',').map((item) => item.trim()).filter(Boolean),
                })
              }
              placeholder="Kích thước"
            />
            <label className="switch-row">
              <span>Hiển thị sản phẩm</span>
              <input
                type="checkbox"
                checked={!editingProduct.hidden}
                onChange={(event) => setEditingProduct({ ...editingProduct, hidden: !event.target.checked })}
              />
            </label>
            <div className="sheet-actions">
              <button onClick={() => setEditingProduct(null)}>Hủy</button>
              <button className="primary-btn" onClick={saveProduct}>
                Lưu
              </button>
            </div>
          </div>
        </section>
      )}

      {editingUser && (
        <section className="bottom-sheet open">
          <div className="sheet-panel">
            <h2>Sửa tài khoản</h2>
            <input
              value={editingUser.name}
              onChange={(event) => setEditingUser({ ...editingUser, name: event.target.value })}
              placeholder="Họ tên"
            />
            <input
              value={editingUser.phone}
              onChange={(event) => setEditingUser({ ...editingUser, phone: event.target.value })}
              placeholder="Số điện thoại"
            />
            <input
              type="date"
              value={editingUser.birthDate}
              onChange={(event) => setEditingUser({ ...editingUser, birthDate: event.target.value })}
            />
            <select
              value={getUserStatus(editingUser)}
              onChange={(event) =>
                setEditingUser({
                  ...editingUser,
                  status: event.target.value as SessionUser['status'],
                })
              }
            >
              {userStatuses.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <div className="sheet-actions">
              <button onClick={() => setEditingUser(null)}>Hủy</button>
              <button className="primary-btn" onClick={saveUser}>
                Lưu
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
