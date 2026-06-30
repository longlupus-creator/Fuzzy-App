# Fuzzy Mobile Shopping App - Requirement Checklist

## User Management

- Register/Login UI: `src/Pages/AuthPages.tsx`
- Show/hide password: `src/Pages/AuthPages.tsx`
- Email/password validation: `src/Pages/AuthPages.tsx`
- Token storage and expiry guard: `src/backend/auth.ts`, `src/frontend/FuzzyApp.tsx`
- Profile view/edit: `src/Pages/ProfilePage.tsx`, `src/Pages/SettingPage.tsx`
- Address CRUD/default address: `src/Pages/OptionPages.tsx`
- Backend auth API: `backend/server.mjs`
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/oauth/:provider`
- Backend user API:
  - `GET /api/user/profile`
  - `PUT /api/user/profile`
  - `GET /api/user/addresses`
  - `POST /api/user/addresses`
  - `PUT /api/user/addresses/:id`
  - `DELETE /api/user/addresses/:id`
  - `GET /api/users`
  - `GET /api/users/:id`
  - `PUT /api/users/:id`
  - `DELETE /api/users/:id`

## Product Management

- Home categories: `src/Pages/LandingPage.tsx`
- Product grid/list: `src/Pages/ShopPage.tsx`
- Infinite scroll: `src/Pages/ShopPage.tsx`
- Bottom sheet filter/sort: `src/Pages/ShopPage.tsx`
- Product detail carousel: `src/Pages/ProductDetailsPage.tsx`
- Size/color selection: `src/Pages/ProductDetailsPage.tsx`
- Sticky add-to-cart: `src/Pages/ProductDetailsPage.tsx`
- Admin product CRUD UI: `src/Pages/AdminPage.tsx`
- Backend product API:
  - `GET /api/products`
  - `POST /api/products`
  - `GET /api/products/:id`
  - `PUT /api/products/:id`
  - `PATCH /api/products/:id`
  - `DELETE /api/products/:id`
- Category management:
  - `GET /api/categories`
  - `POST /api/categories`
  - `PUT /api/categories/:name`
  - `DELETE /api/categories/:name`

## Order Management

- Cart list and quantity update: `src/Pages/CartPage.tsx`
- Swipe to delete: `src/Pages/CartPage.tsx`
- Cart LocalStorage sync: `src/frontend/FuzzyApp.tsx`
- Checkout address/payment flow: `src/Pages/CheckoutPage.tsx`, `src/Pages/OptionPages.tsx`
- Payment methods COD/Bank Transfer/VNPay/Momo: `src/Pages/OptionPages.tsx`
- Order success/tracking timeline: `src/Pages/OrderPages.tsx`
- Order history from backend: `src/Pages/OrderPages.tsx`
- Admin order status update: `src/Pages/AdminPage.tsx`
- Backend order/payment API:
  - `GET /api/orders`
  - `POST /api/orders`
  - `PATCH /api/orders/:id`
  - `POST /api/payments/create`
  - `POST /api/payments/callback`

## PWA

- Manifest: `public/fuzzy/manifest.json`
- Service worker: `public/sw.js`
- Offline page: `public/offline.html`
- Service worker registration: `src/main.tsx`
- Offline banner and install prompt: `src/frontend/FuzzyApp.tsx`

## Database

- JSON database persistence: `backend/db.json`
- Backend persistence logic: `backend/server.mjs`

## Notes

- The project uses React Vite for the mobile app and a Node API server in `backend/server.mjs`.
- OAuth2 and VNPay/Momo are implemented as mock integration endpoints because real provider credentials are required for production integration.
- API route names match the required `/api/...` contract and can be migrated to Next.js route handlers if the course requires a physical Next.js API project.
