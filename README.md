# BeliMudah

REST API backend for an e-commerce platform built with Express.js and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js (ESM)
- **Framework**: Express.js v5
- **Database**: PostgreSQL (`pg`)
- **Auth**: JWT (`jsonwebtoken`) + Argon2 password hashing
- **File Upload**: Multer
- **API Docs**: Swagger UI (`swagger-ui-express`)
- **Logging**: Morgan

## Getting Started

```bash
# Install dependencies
npm install

# Create .env file (see Environment Variables section)
cp .env.example .env

# Run in development mode (with watch)
npm run dev
```

Server runs on port `2222` by default.

## Environment Variables

| Variable      | Description                  |
|---------------|------------------------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET`  | Secret key for JWT signing   |
| `CLIENT_URL`  | Allowed CORS origin          |

## API Endpoints

### Auth

| Method | Path             | Auth | Description          |
|--------|------------------|------|----------------------|
| POST   | `/auth/register` | No   | Register a new user  |
| POST   | `/auth/login`    | No   | Login, returns JWT   |

### Products

| Method | Path            | Auth  | Description              |
|--------|-----------------|-------|--------------------------|
| GET    | `/products`     | No    | Get all products         |
| GET    | `/products/:id` | No    | Get product by ID        |
| POST   | `/products`     | Admin | Create a new product     |
| DELETE | `/products/:id` | Admin | Delete a product         |

### Brands

| Method | Path          | Auth | Description        |
|--------|---------------|------|--------------------|
| GET    | `/brands`     | No   | Get all brands     |
| GET    | `/brands/:id` | No   | Get brand by ID    |
| POST   | `/brands`     | No   | Create a new brand |
| PATCH  | `/brands/:id` | No   | Update a brand     |
| DELETE | `/brands/:id` | No   | Delete a brand     |

### Categories

| Method | Path               | Auth | Description           |
|--------|--------------------|------|-----------------------|
| GET    | `/categories`      | No   | Get all categories    |
| GET    | `/categories/:id`  | No   | Get category by ID    |
| POST   | `/categories`      | No   | Create a new category |
| PATCH  | `/categories/:id`  | No   | Update a category     |
| DELETE | `/categories/:id`  | No   | Delete a category     |

### Users

| Method | Path                  | Auth | Description                  |
|--------|-----------------------|------|------------------------------|
| GET    | `/users/profile`      | Yes  | Get current user profile     |
| PATCH  | `/users/profile`      | Yes  | Update profile picture       |
| GET    | `/users/info`         | Yes  | Get user account information |
| GET    | `/users/cart`         | Yes  | Get all cart items           |
| POST   | `/users/cart`         | Yes  | Add product to cart          |
| PATCH  | `/users/cart/:id`     | Yes  | Update cart item quantity    |
| DELETE | `/users/cart/:id`     | Yes  | Remove item from cart        |
| GET    | `/users/orders`       | Yes  | Get all orders               |
| GET    | `/users/orders/:id`   | Yes  | Get order detail by ID       |
| POST   | `/users/orders`       | Yes  | Create a new order           |
| GET    | `/users/address`      | Yes  | Get all addresses            |
| GET    | `/users/address/:id`  | Yes  | Get address by ID            |
| POST   | `/users/address`      | Yes  | Add a new address            |
| GET    | `/users/wishlist`     | Yes  | Get wishlist                 |
| POST   | `/users/wishlist`     | Yes  | Add product to wishlist      |

### Payments

| Method | Path        | Auth | Description       |
|--------|-------------|------|-------------------|
| GET    | `/payments` | Yes  | Get all payments  |

### Misc

| Method | Path     | Auth | Description        |
|--------|----------|------|--------------------|
| GET    | `/ping`  | No   | Liveness check     |
| GET    | `/docs`  | No   | Swagger UI         |
| GET    | `/images/:file` | No | Serve static images |

## A

| Value | Meaning                                      |
|-------|----------------------------------------------|
| No    | Public endpoint, no token required           |
| Yes   | Requires `Authorization: Bearer <token>`     |
| Admin | Requires valid token with admin role         |

## Project Structure

```
src/
├── index.js               # App entry point
├── config/
│   ├── postgres.js        # DB connection pool
│   └── swagger.js         # Swagger spec config
├── routes/
│   ├── index.js           # Route aggregator
│   ├── auth.router.js
│   ├── brands.router.js
│   ├── categories.router.js
│   ├── products.router.js
│   ├── users.router.js
│   └── payment.router.js
├── controllers/
│   ├── auth.controller.js
│   ├── brands.controller.js
│   ├── categories.controller.js
│   ├── products.controller.js
│   ├── payment.controller.js
│   └── users/
│       ├── profiles.controller.js
│       ├── cart.controller.js
│       ├── orders.controller.js
│       ├── address.controller.js
│       ├── users.controller.js
│       └── wishlists.controller.js
└── middleware/
    ├── auth.middleware.js
    ├── isAdmin.middleware.js
    ├── cors.middleware.js
    └── upload.middleware.js
```
