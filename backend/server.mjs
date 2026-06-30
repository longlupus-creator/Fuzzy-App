import { randomUUID } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))
const dbPath = join(rootDir, 'db.json')
const oneDay = 1000 * 60 * 60 * 24

const defaultDb = {
  users: [
    {
      id: 'user-1',
      name: 'Agasya',
      email: 'agasya@example.com',
      password: 'Fuzzy@123',
      phone: '+1 234 567 8900',
      birthDate: '1998-06-18',
      avatar: '/fuzzy/assets/images/icons/profile.png',
      addresses: [
        {
          id: 'home',
          label: 'Home',
          line: '4517 Washington Ave. Manchester',
          phone: '+1 234 567 8900',
          isDefault: true,
        },
      ],
    },
  ],
  sessions: [],
  products: [
    { id: 1, name: 'Modern Sofa', category: 'sofa', color: 'Yellow', sizes: ['S', 'M', 'L'], price: 150, oldPrice: 200, stock: 12, hidden: false },
    { id: 2, name: 'Club Chair', category: 'chair', color: 'Cream', sizes: ['S', 'M'], price: 110, oldPrice: 140, stock: 8, hidden: false },
    { id: 7, name: 'Side Table', category: 'table', color: 'Brown', sizes: ['One size'], price: 50, oldPrice: 80, stock: 18, hidden: false },
    { id: 11, name: 'Lounge Chair', category: 'chair', color: 'Blue', sizes: ['M', 'L'], price: 130, oldPrice: 160, stock: 9, hidden: false },
    { id: 13, name: 'Hanging Light', category: 'lamp', color: 'Black', sizes: ['One size'], price: 30, oldPrice: 60, stock: 25, hidden: false },
    { id: 16, name: 'Cabinet Shelf', category: 'cabinet', color: 'Walnut', sizes: ['M', 'L', 'XL'], price: 180, oldPrice: 230, stock: 7, hidden: false },
  ],
  categories: ['sofa', 'chair', 'table', 'cabinet', 'lamp', 'decor'],
  coupons: [
    { id: 'fuzzy20', code: 'FUZZY20', value: 20 },
    { id: 'ship', code: 'FREESHIP', value: 12 },
    { id: 'new', code: 'NEW50', value: 50 },
  ],
  orders: [],
  payments: [],
}

const orderStatuses = ['pending', 'preparing', 'shipping', 'completed', 'cancelled']

function ensureDb() {
  if (!existsSync(dbPath)) {
    writeFileSync(dbPath, JSON.stringify(defaultDb, null, 2))
  }
}

function readDb() {
  ensureDb()
  return JSON.parse(readFileSync(dbPath, 'utf8'))
}

function writeDb(db) {
  writeFileSync(dbPath, JSON.stringify(db, null, 2))
}

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  })
  response.end(JSON.stringify(data))
}

function readBody(request) {
  return new Promise((resolve) => {
    let raw = ''
    request.on('data', (chunk) => {
      raw += chunk
    })
    request.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch {
        resolve({})
      }
    })
  })
}

function publicUser(user, db) {
  const { password, ...safeUser } = user
  const hasActiveSession = db?.sessions?.some(
    (session) => session.userId === user.id && session.expiresAt > Date.now(),
  )

  return {
    ...safeUser,
    status: safeUser.status ?? (hasActiveSession ? 'active' : 'inactive'),
  }
}

function createSession(db, user) {
  const session = {
    token: `jwt.${randomUUID()}.fuzzy`,
    userId: user.id,
    expiresAt: Date.now() + oneDay,
  }

  user.status = 'active'
  user.lastLoginAt = new Date().toISOString()
  db.sessions = db.sessions.filter((item) => item.expiresAt > Date.now())
  db.sessions.push(session)

  return session
}

function getSessionUser(request, db) {
  const token = request.headers.authorization?.replace('Bearer ', '')
  const session = db.sessions.find((item) => item.token === token && item.expiresAt > Date.now())

  if (!session) return null

  return db.users.find((user) => user.id === session.userId) ?? null
}

function requireAuth(request, response, db) {
  const user = getSessionUser(request, db)

  if (!user) {
    sendJson(response, 401, { message: 'Unauthorized' })
    return null
  }

  return user
}

function validateProduct(product) {
  return product.name && product.category && Number(product.price) >= 0 && Number(product.stock) >= 0
}

createServer(async (request, response) => {
  const db = readDb()
  const url = new URL(request.url ?? '/', 'http://127.0.0.1:4000')
  const method = request.method ?? 'GET'

  if (method === 'OPTIONS') {
    sendJson(response, 204, {})
    return
  }

  if (url.pathname === '/api/auth/register' && method === 'POST') {
    const body = await readBody(request)

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email ?? '')) {
      sendJson(response, 400, { message: 'Invalid email' })
      return
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(body.password ?? '')) {
      sendJson(response, 400, { message: 'Weak password' })
      return
    }

    if (db.users.some((user) => user.email === body.email)) {
      sendJson(response, 409, { message: 'Email already exists' })
      return
    }

    const user = {
      id: randomUUID(),
      name: body.name ?? body.email.split('@')[0],
      email: body.email,
      password: body.password,
      phone: body.phone ?? '',
      birthDate: body.birthDate ?? '',
      avatar: '/fuzzy/assets/images/icons/profile.png',
      addresses: [],
    }
    db.users.push(user)
    const session = createSession(db, user)
    writeDb(db)
    sendJson(response, 201, { token: session.token, expiresAt: session.expiresAt, user: publicUser(user, db) })
    return
  }

  if (url.pathname === '/api/auth/login' && method === 'POST') {
    const body = await readBody(request)
    const user = db.users.find((item) => item.email === body.email && item.password === body.password)

    if (!user) {
      sendJson(response, 401, { message: 'Invalid credentials' })
      return
    }

    const session = createSession(db, user)
    writeDb(db)
    sendJson(response, 200, { token: session.token, expiresAt: session.expiresAt, user: publicUser(user, db) })
    return
  }

  if (url.pathname.startsWith('/api/auth/oauth/') && method === 'POST') {
    const provider = url.pathname.split('/').pop()
    const body = await readBody(request)
    const email = body.email ?? `${provider}@fuzzy.local`
    let user = db.users.find((item) => item.email === email)

    if (!user) {
      user = {
        id: randomUUID(),
        name: body.name ?? provider,
        email,
        password: `${provider}-oauth`,
        phone: '',
        birthDate: '',
        avatar: '/fuzzy/assets/images/icons/profile.png',
        addresses: [],
      }
      db.users.push(user)
    }

    const session = createSession(db, user)
    writeDb(db)
    sendJson(response, 200, { provider, token: session.token, expiresAt: session.expiresAt, user: publicUser(user, db) })
    return
  }

  if (url.pathname === '/api/user' || url.pathname.startsWith('/api/user/')) {
    const user = requireAuth(request, response, db)
    if (!user) return

    if (url.pathname === '/api/user/profile' && method === 'GET') {
      sendJson(response, 200, publicUser(user, db))
      return
    }

    if (url.pathname === '/api/user/profile' && method === 'PUT') {
      Object.assign(user, await readBody(request))
      writeDb(db)
      sendJson(response, 200, publicUser(user, db))
      return
    }

    if (url.pathname === '/api/user/addresses' && method === 'GET') {
      sendJson(response, 200, user.addresses)
      return
    }

    if (url.pathname === '/api/user/addresses' && method === 'POST') {
      const address = { id: randomUUID(), ...(await readBody(request)) }
      user.addresses.push(address)
      writeDb(db)
      sendJson(response, 201, address)
      return
    }

    if (url.pathname.startsWith('/api/user/addresses/')) {
      const id = url.pathname.split('/').pop()

      if (method === 'PUT') {
        const body = await readBody(request)
        user.addresses = user.addresses.map((address) => (address.id === id ? { ...address, ...body } : address))
        writeDb(db)
        sendJson(response, 200, user.addresses.find((address) => address.id === id))
        return
      }

      if (method === 'DELETE') {
        user.addresses = user.addresses.filter((address) => address.id !== id)
        writeDb(db)
        sendJson(response, 200, { ok: true })
        return
      }
    }
  }

  if (url.pathname === '/api/users' && method === 'GET') {
    sendJson(response, 200, db.users.map((user) => publicUser(user, db)))
    return
  }

  if (url.pathname.startsWith('/api/users/')) {
    const id = url.pathname.split('/').pop()
    const user = db.users.find((item) => item.id === id)

    if (!user) {
      sendJson(response, 404, { message: 'User not found' })
      return
    }

    if (method === 'GET') {
      sendJson(response, 200, publicUser(user, db))
      return
    }

    if (method === 'PUT' || method === 'PATCH') {
      Object.assign(user, await readBody(request))
      writeDb(db)
      sendJson(response, 200, publicUser(user, db))
      return
    }

    if (method === 'DELETE') {
      db.users = db.users.filter((item) => item.id !== id)
      db.sessions = db.sessions.filter((item) => item.userId !== id)
      writeDb(db)
      sendJson(response, 200, { ok: true })
      return
    }
  }

  if (url.pathname === '/api/products' && method === 'GET') {
    const query = url.searchParams.get('q')?.toLowerCase() ?? ''
    const category = url.searchParams.get('category') ?? 'all'
    const includeHidden = url.searchParams.get('includeHidden') === 'true'
    const result = db.products.filter((product) => {
      const matchesQuery = !query || product.name.toLowerCase().includes(query)
      const matchesCategory = category === 'all' || product.category === category

      return matchesQuery && matchesCategory && (includeHidden || !product.hidden)
    })

    sendJson(response, 200, result)
    return
  }

  if (url.pathname === '/api/products' && method === 'POST') {
    const body = await readBody(request)
    const product = { id: Date.now(), hidden: false, ...body }

    if (!validateProduct(product)) {
      sendJson(response, 400, { message: 'Invalid product' })
      return
    }

    db.products.push(product)
    writeDb(db)
    sendJson(response, 201, product)
    return
  }

  if (url.pathname.startsWith('/api/products/')) {
    const id = Number(url.pathname.split('/').pop())
    const product = db.products.find((item) => item.id === id)

    if (!product) {
      sendJson(response, 404, { message: 'Product not found' })
      return
    }

    if (method === 'GET') {
      sendJson(response, 200, product)
      return
    }

    if (method === 'PUT' || method === 'PATCH') {
      Object.assign(product, await readBody(request))
      writeDb(db)
      sendJson(response, 200, product)
      return
    }

    if (method === 'DELETE') {
      product.hidden = true
      writeDb(db)
      sendJson(response, 200, { ok: true })
      return
    }
  }

  if (url.pathname === '/api/categories' && method === 'GET') {
    sendJson(response, 200, db.categories)
    return
  }

  if (url.pathname === '/api/categories' && method === 'POST') {
    const body = await readBody(request)
    const category = String(body.name ?? '').trim().toLowerCase()

    if (!category) {
      sendJson(response, 400, { message: 'Category name is required' })
      return
    }

    if (!db.categories.includes(category)) {
      db.categories.push(category)
      writeDb(db)
    }

    sendJson(response, 201, { name: category })
    return
  }

  if (url.pathname.startsWith('/api/categories/')) {
    const oldName = decodeURIComponent(url.pathname.split('/').pop() ?? '')

    if (!db.categories.includes(oldName)) {
      sendJson(response, 404, { message: 'Category not found' })
      return
    }

    if (method === 'PUT' || method === 'PATCH') {
      const body = await readBody(request)
      const nextName = String(body.name ?? '').trim().toLowerCase()

      if (!nextName) {
        sendJson(response, 400, { message: 'Category name is required' })
        return
      }

      db.categories = db.categories.map((item) => (item === oldName ? nextName : item))
      db.products = db.products.map((product) =>
        product.category === oldName ? { ...product, category: nextName } : product,
      )
      writeDb(db)
      sendJson(response, 200, { name: nextName })
      return
    }

    if (method === 'DELETE') {
      db.categories = db.categories.filter((item) => item !== oldName)
      db.products = db.products.map((product) =>
        product.category === oldName ? { ...product, hidden: true } : product,
      )
      writeDb(db)
      sendJson(response, 200, { ok: true })
      return
    }
  }

  if (url.pathname === '/api/coupons') {
    sendJson(response, 200, db.coupons)
    return
  }

  if (url.pathname === '/api/orders' && method === 'GET') {
    sendJson(response, 200, db.orders)
    return
  }

  if (url.pathname === '/api/orders' && method === 'POST') {
    const body = await readBody(request)

    for (const item of body.items ?? []) {
      const product = db.products.find((entry) => entry.id === item.product.id)
      if (product) product.stock = Math.max(0, product.stock - item.quantity)
    }

    const order = {
      id: `FU-${Date.now().toString().slice(-5)}`,
      status: orderStatuses[0],
      eta: '30 Jun 2026',
      items: body.items ?? [],
      total: body.total ?? 0,
      paymentMethod: body.paymentMethod ?? 'COD',
      createdAt: new Date().toISOString(),
    }
    db.orders.push(order)
    writeDb(db)
    sendJson(response, 201, order)
    return
  }

  if (url.pathname.startsWith('/api/orders/') && method === 'PATCH') {
    const id = url.pathname.split('/').pop()
    const order = db.orders.find((item) => item.id === id)

    if (!order) {
      sendJson(response, 404, { message: 'Order not found' })
      return
    }

    const body = await readBody(request)
    if (body.status && !orderStatuses.includes(body.status)) {
      sendJson(response, 400, { message: 'Invalid status' })
      return
    }

    Object.assign(order, body)
    writeDb(db)
    sendJson(response, 200, order)
    return
  }

  if (url.pathname === '/api/payments/create' && method === 'POST') {
    const body = await readBody(request)
    const payment = {
      id: `PAY-${Date.now().toString().slice(-6)}`,
      method: body.method ?? 'COD',
      amount: body.amount ?? 0,
      orderId: body.orderId ?? null,
      status: body.method === 'COD' ? 'pending_cod' : 'waiting_redirect',
      redirectUrl: body.method === 'VNPay' || body.method === 'Momo' ? `/payment-result?paymentId=` : null,
      createdAt: new Date().toISOString(),
    }
    if (payment.redirectUrl) payment.redirectUrl += payment.id
    db.payments.push(payment)
    writeDb(db)
    sendJson(response, 201, payment)
    return
  }

  if (url.pathname === '/api/payments/callback' && method === 'POST') {
    const body = await readBody(request)
    const payment = db.payments.find((item) => item.id === body.paymentId)

    if (!payment) {
      sendJson(response, 404, { message: 'Payment not found' })
      return
    }

    payment.status = body.success ? 'paid' : 'failed'
    writeDb(db)
    sendJson(response, 200, payment)
    return
  }

  sendJson(response, 404, { message: 'Route not found' })
}).listen(4000, () => {
  ensureDb()
  console.log('Fuzzy backend running at http://127.0.0.1:4000')
})
