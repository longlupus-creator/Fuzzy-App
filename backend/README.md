# Fuzzy Backend

Small Node API for the Fuzzy frontend. Data is persisted in `backend/db.json`.

Run it with:

```bash
npm run backend
```

Endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/oauth/:provider`
- `GET /api/user/profile`
- `PUT /api/user/profile`
- `GET /api/user/addresses`
- `POST /api/user/addresses`
- `PUT /api/user/addresses/:id`
- `DELETE /api/user/addresses/:id`
- `GET /api/products`
- `POST /api/products`
- `GET /api/products/:id`
- `PUT /api/products/:id`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/categories`
- `GET /api/coupons`
- `GET /api/orders`
- `POST /api/orders`
- `PATCH /api/orders/:id`
- `POST /api/payments/create`
- `POST /api/payments/callback`

Protected user endpoints require:

```http
Authorization: Bearer <token>
```

Demo account:

```txt
Email: agasya@example.com
Password: Fuzzy@123
```
