import { useEffect, useMemo, useState } from 'react'
import { fuzzyApi } from '../backend/api'
import { readSession, type SessionUser } from '../backend/auth'
import { coupons, products, type Product } from '../backend/data'
import {
  CartPage,
  AdminPage,
  CategoriesPage,
  CheckoutPage,
  CouponPage,
  CreateAccountPage,
  EmptyCartPage,
  EmptyNotificationPage,
  EmptyOrderHistoryPage,
  EmptySearchPage,
  EmptyWishlistPage,
  ForgotPasswordPage,
  HelpPage,
  IndexPage,
  LandingPage,
  LanguagePage,
  LoginPage,
  ManageAddressPage,
  ManagePaymentPage,
  NewAddressPage,
  NewCardPage,
  NotificationPage,
  OrderDetailsPage,
  OrderHistoryPage,
  OrderTrackingPage,
  OtpPage,
  PageListingPage,
  PaymentPage,
  Product2DetailsPage,
  ProductDetailsPage,
  ProfilePage,
  ProfileSettingPage,
  ResetPasswordPage,
  SettingPage,
  ShippingAddressPage,
  ShippingPage,
  ShopPage,
  TabBar,
  TermsConditionsPage,
  WishlistPage,
  type CartItem,
  type Coupon,
  type Page,
} from '../Pages'
import './fuzzy.css'

const pageMap: Record<string, Page> = {
  '': 'onboarding',
  onboarding: 'onboarding',
  index: 'onboarding',
  login: 'login',
  'create-account': 'signup',
  signup: 'signup',
  'forgot-password': 'forgot',
  forgot: 'forgot',
  otp: 'otp',
  'reset-password': 'reset',
  reset: 'reset',
  landing: 'home',
  home: 'home',
  shop: 'shop',
  categories: 'categories',
  search: 'search',
  'product-details': 'product',
  'product2-details': 'product',
  product: 'product',
  cart: 'cart',
  checkout: 'checkout',
  shipping: 'shipping',
  'manage-address': 'address',
  'new-address': 'address',
  'shipping-address': 'address',
  address: 'address',
  payment: 'payment',
  'manage-payment': 'payment',
  'new-card': 'payment',
  coupon: 'coupon',
  'order-tracking': 'tracking',
  tracking: 'tracking',
  'order-history': 'orders',
  'order-details': 'orders',
  orders: 'orders',
  wishlist: 'wishlist',
  profile: 'profile',
  'profile-setting': 'settings',
  setting: 'settings',
  settings: 'settings',
  language: 'language',
  help: 'help',
  'terms-conditions': 'terms',
  terms: 'terms',
  notification: 'notifications',
  notifications: 'notifications',
  'page-listing': 'pages',
  pages: 'pages',
  admin: 'admin',
  'empty-cart': 'cart',
  'empty-notification': 'notifications',
  'empty-order-history': 'orders',
  'empty-search': 'search',
  'empty-wishlist': 'wishlist',
}

const CART_KEY = 'fuzzy_cart'
const THEME_KEY = 'fuzzy_dark_theme'
const drawerPages: Array<{ label: string; page: Page; icon?: string; fallback?: string }> = [
  { label: 'Home', page: 'home', icon: 'home.svg' },
  { label: 'Categories', page: 'categories', icon: 'categories.svg' },
  { label: 'Shop', page: 'shop', icon: 'sofa.svg' },
  { label: 'Cart', page: 'cart', icon: 'bag.svg' },
  { label: 'Checkout', page: 'checkout', icon: 'card.svg' },
  { label: 'Wishlist', page: 'wishlist', icon: 'heart.svg' },
  { label: 'Profile', page: 'profile', icon: 'profile.svg' },
  { label: 'Settings', page: 'settings', fallback: 'S' },
  { label: 'Orders', page: 'orders', icon: 'bag.svg' },
  { label: 'Admin', page: 'admin', fallback: 'A' },
]

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)

    if (!raw) return []

    return JSON.parse(raw) as CartItem[]
  } catch {
    return []
  }
}

function readHash(): { page: Page; rawRoute: string; id?: number } {
  const [rawRoute = '', query] = window.location.hash.replace(/^#\/?/, '').split('?')
  const params = new URLSearchParams(query)

  return {
    page: pageMap[rawRoute] ?? 'onboarding',
    rawRoute,
    id: Number(params.get('id')) || undefined,
  }
}

function FuzzyApp() {
  const [route, setRoute] = useState(readHash)
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(() => readSession()?.user ?? null)
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const [darkTheme, setDarkTheme] = useState(() => localStorage.getItem(THEME_KEY) === 'true')
  const [activeSlide, setActiveSlide] = useState(0)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [wishlist, setWishlist] = useState<number[]>([1, 11])
  const [cart, setCart] = useState<CartItem[]>([
    ...(readCart().length
      ? readCart()
      : [
          { product: products.find((product) => product.id === 11) ?? products[0], quantity: 1 },
          { product: products.find((product) => product.id === 13) ?? products[1], quantity: 1 },
          { product: products.find((product) => product.id === 7) ?? products[2], quantity: 1 },
        ]),
  ])
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0])
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon>(coupons[0])
  const [orderId, setOrderId] = useState('FU-1024')
  const [orderTotal, setOrderTotal] = useState(0)
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null)
  const [online, setOnline] = useState(navigator.onLine)

  const go = (page: Page, id?: number) => {
    if (page === 'pages') {
      setSideMenuOpen(true)
      return
    }

    setSideMenuOpen(false)
    window.location.hash = id ? `/${page}?id=${id}` : `/${page}`
  }

  useEffect(() => {
    const updateRoute = () => setRoute(readHash())

    window.addEventListener('hashchange', updateRoute)
    return () => window.removeEventListener('hashchange', updateRoute)
  }, [])

  useEffect(() => {
    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event)
    }
    const updateOnline = () => setOnline(navigator.onLine)

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('online', updateOnline)
    window.addEventListener('offline', updateOnline)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('online', updateOnline)
      window.removeEventListener('offline', updateOnline)
    }
  }, [])

  const installApp = async () => {
    const prompt = installPrompt as Event & { prompt?: () => Promise<void> }

    await prompt.prompt?.()
    setInstallPrompt(null)
  }

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem(THEME_KEY, String(darkTheme))
  }, [darkTheme])

  useEffect(() => {
    const session = readSession()
    const publicPages: Page[] = ['onboarding', 'login', 'signup', 'forgot', 'otp', 'reset']

    if (!session && !publicPages.includes(route.page)) {
      go('login')
    }
  }, [route.page])

  useEffect(() => {
    if (route.page === 'product') {
      void fuzzyApi.getProduct(route.id ?? selectedProduct.id).then(setSelectedProduct)
    }
  }, [route, selectedProduct.id])

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart],
  )
  const shipping = cart.length ? 12 : 0
  const discount = Math.min(selectedCoupon.value, subtotal)
  const total = Math.max(subtotal + shipping - discount, 0)
  const filteredProducts = products.filter((product) => {
    const matchesQuery =
      !query ||
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'all' || product.category === category

    return matchesQuery && matchesCategory
  })

  const addToCart = (product: Product) => {
    setCart((items) => {
      const existing = items.find((item) => item.product.id === product.id)

      if (existing) {
        return items.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [...items, { product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart((items) =>
      items.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, Math.min(10, item.quantity + delta)) }
          : item,
      ),
    )
  }

  const removeFromCart = (productId: number) => {
    setCart((items) => items.filter((item) => item.product.id !== productId))
  }

  const toggleWishlist = (productId: number) => {
    setWishlist((items) =>
      items.includes(productId) ? items.filter((id) => id !== productId) : [...items, productId],
    )
  }

  const placeOrder = async () => {
    const paidTotal = total
    const order = await fuzzyApi.createOrder(cart, total)
    const paymentMethod = localStorage.getItem('fuzzy_payment_method') ?? 'COD'
    await fuzzyApi.createPayment(paymentMethod, paidTotal, order.id)
    setOrderId(order.id)
    setOrderTotal(paidTotal)
    setCart([])
    go('tracking')
  }

  const productActions = {
    go,
    addToCart,
    toggleWishlist,
    wishlist,
  }
  const currentUser = sessionUser ?? readSession()?.user ?? null

  const routePage = (() => {
    if (route.rawRoute === 'empty-cart') return <EmptyCartPage go={go} />
    if (route.rawRoute === 'empty-notification') return <EmptyNotificationPage go={go} />
    if (route.rawRoute === 'empty-order-history') return <EmptyOrderHistoryPage go={go} />
    if (route.rawRoute === 'empty-search') return <EmptySearchPage go={go} />
    if (route.rawRoute === 'empty-wishlist') return <EmptyWishlistPage go={go} />

    switch (route.page) {
      case 'onboarding':
        return <IndexPage activeSlide={activeSlide} setActiveSlide={setActiveSlide} go={go} />
      case 'login':
        return <LoginPage go={go} onUserChange={setSessionUser} />
      case 'signup':
        return <CreateAccountPage go={go} onUserChange={setSessionUser} />
      case 'forgot':
        return <ForgotPasswordPage go={go} />
      case 'otp':
        return <OtpPage go={go} />
      case 'reset':
        return <ResetPasswordPage go={go} />
      case 'home':
        return (
          <LandingPage
            go={go}
            query={query}
            setQuery={setQuery}
            products={products}
            actions={productActions}
            user={currentUser}
          />
        )
      case 'shop':
        return (
          <ShopPage
            go={go}
            products={filteredProducts}
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
            actions={productActions}
          />
        )
      case 'search':
        return (
          <ShopPage
            go={go}
            title="Search"
            products={filteredProducts}
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
            actions={productActions}
          />
        )
      case 'categories':
        return <CategoriesPage go={go} category={category} setCategory={setCategory} />
      case 'product':
        return route.rawRoute === 'product2-details' ? (
          <Product2DetailsPage product={selectedProduct} products={products} actions={productActions} />
        ) : (
          <ProductDetailsPage product={selectedProduct} products={products} actions={productActions} />
        )
      case 'cart':
        return (
          <CartPage
            go={go}
            cart={cart}
            subtotal={subtotal}
            total={total}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />
        )
      case 'checkout':
        return (
          <CheckoutPage
            go={go}
            cart={cart}
            subtotal={subtotal}
            shipping={shipping}
            discount={discount}
            total={total}
            selectedCoupon={selectedCoupon}
            placeOrder={placeOrder}
          />
        )
      case 'shipping':
        return <ShippingPage go={go} />
      case 'address':
        if (route.rawRoute === 'new-address') return <NewAddressPage go={go} />
        if (route.rawRoute === 'shipping-address') return <ShippingAddressPage go={go} />
        return <ManageAddressPage go={go} />
      case 'payment':
        if (route.rawRoute === 'new-card') return <NewCardPage go={go} />
        if (route.rawRoute === 'manage-payment') return <ManagePaymentPage go={go} />
        return <PaymentPage go={go} />
      case 'coupon':
        return (
          <CouponPage
            go={go}
            selectedCoupon={selectedCoupon.id}
            setSelectedCoupon={setSelectedCoupon}
          />
        )
      case 'tracking':
        return <OrderTrackingPage go={go} orderId={orderId} total={orderTotal} />
      case 'orders':
        return route.rawRoute === 'order-details' ? (
          <OrderDetailsPage go={go} orderId={orderId} />
        ) : (
          <OrderHistoryPage go={go} orderId={orderId} />
        )
      case 'wishlist':
        return (
          <WishlistPage
            go={go}
            products={products.filter((product) => wishlist.includes(product.id))}
            actions={productActions}
          />
        )
      case 'profile':
        return <ProfilePage go={go} user={currentUser} />
      case 'settings':
        return route.rawRoute === 'profile-setting' ? (
          <ProfileSettingPage go={go} user={currentUser} onUserChange={setSessionUser} />
        ) : (
          <SettingPage go={go} user={currentUser} onUserChange={setSessionUser} />
        )
      case 'language':
        return <LanguagePage go={go} />
      case 'help':
        return <HelpPage go={go} />
      case 'terms':
        return <TermsConditionsPage go={go} />
      case 'notifications':
        return <NotificationPage go={go} />
      case 'pages':
        return <PageListingPage go={go} />
      case 'admin':
        return <AdminPage go={go} />
      default:
        return <IndexPage activeSlide={activeSlide} setActiveSlide={setActiveSlide} go={go} />
    }
  })()

  const hiddenTabPages: Page[] = ['onboarding', 'login', 'signup', 'forgot', 'otp', 'reset', 'checkout', 'cart', 'product', 'tracking']

  return (
    <div className={`app-shell ${darkTheme ? 'theme-dark' : ''}`}>
      {routePage}
      {sideMenuOpen && (
        <section className="side-menu-shell" aria-label="Pages menu">
          <button className="side-menu-backdrop" onClick={() => setSideMenuOpen(false)} aria-label="Close menu" />
          <aside className="side-menu-panel">
            <div className="side-menu-profile">
              <img src={currentUser?.avatar || '/fuzzy/assets/images/icons/profile.png'} alt="" />
              <span>
                <small>Welcome back</small>
                <strong>{currentUser?.name ?? 'Agasya'}</strong>
              </span>
              <button onClick={() => setSideMenuOpen(false)} aria-label="Close menu">
                x
              </button>
            </div>

            <div className="side-menu-switches">
              <label>
                <span>Dark theme</span>
                <input type="checkbox" checked={darkTheme} onChange={(event) => setDarkTheme(event.target.checked)} />
                <i aria-hidden="true" />
              </label>
            </div>

            <nav className="side-menu-pages">
              {drawerPages.map(({ label, page, icon, fallback }) => (
                <button className={route.page === page ? 'active' : ''} key={page} onClick={() => go(page)}>
                  <span>
                    {icon ? <img src={`/fuzzy/assets/images/svg/${icon}`} alt="" /> : fallback ?? label.slice(0, 1)}
                  </span>
                  {label}
                </button>
              ))}
            </nav>
          </aside>
        </section>
      )}
      {!online && <div className="offline-banner">Không có kết nối mạng</div>}
      {installPrompt && (
        <div className="install-card">
          <span>
            <strong>fuzzy app</strong>
            <small>Add to Home Screen</small>
          </span>
          <button onClick={installApp}>Install</button>
          <button onClick={() => setInstallPrompt(null)}>Later</button>
        </div>
      )}
      {!hiddenTabPages.includes(route.page) && <TabBar page={route.page} go={go} cartCount={cart.length} />}
    </div>
  )
}

export default FuzzyApp
