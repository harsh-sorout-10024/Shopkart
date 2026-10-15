# 🛍️ ShopKart — Full-Stack MERN E-Commerce Platform

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment_Gateway-0C2340?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com/)

A modern, full-featured **MERN stack** e-commerce web application featuring JWT cookie authentication, reactive search & category filtering, interactive wishlist and cart management, authentic **Razorpay Payment Gateway** integration with HMAC SHA256 signature verification, and complete order lifecycle tracking.

---

## 🌟 Key Features

### 🔐 Authentication & Profile
- **Secure Authentication**: Customer registration and login with **Bcrypt** password hashing.
- **Session Security**: Stateless authorization using **JWT (JSON Web Tokens)** stored in HTTP-Only cookies with CSRF/SameSite protection.
- **Protected Routing**: Navigation guards ensuring secure access to Cart, Wishlist, Checkout, and Order history.
- **Account Hub**: Dedicated dashboard showcasing customer profile details, quick shortcuts, and online status.

### 🔍 Product Discovery & Catalog
- **Live Search**: Debounced real-time product search by keyword with an instant reset button.
- **Department Filtering**: Interactive category pills (Electronics, Fashion, Books, Home & Living) with direct deep linking.
- **Dynamic Sorting**: Sort by Featured, Price: Low-to-High, and Price: High-to-Low.
- **Inventory Awareness**: Live stock availability badges (pulsing green indicator for in-stock items, out-of-stock disable states).
- **Perceived Performance**: Animated skeleton shimmer placeholders (`skeleton-shimmer`) while loading products.

### 💖 Wishlist & Product Details
- **Wishlist Engine**: One-click wishlist toggling with animated heart micro-interactions and live badge counters in the navigation bar.
- **Product Showcase**: High-resolution image zoom, discount calculations (original price strike-through + % savings tag), and customer review ratings.
- **Quantity Selection**: Pre-cart quantity selector stepper ensuring stock limitations are respected.
- **Tabbed Specifications**: Tab switching between Product Description, Technical Specifications, and Shipping & Returns Policies.

### 🛒 Shopping Cart & Checkout
- **Reactive Cart Management**: Persistent cart state via React Context API, with real-time stock-capped quantity increment/decrement controls.
- **Order Breakdown**: Instant item subtotal calculation, free shipping eligibility, and order total.
- **Checkout Wizard**: 3-step visual breadcrumb tracker (`1. Cart → 2. Delivery Address → 3. Razorpay Payment`).
- **Autofill Profile Address**: 1-click shipping autofill button from logged-in customer data for seamless testing.
- **Delivery Options**: Radio selector for Standard Express Delivery vs Next-Day Priority Dispatch.

### 💳 Razorpay Payment Gateway & Orders
- **End-to-End Payment Flow**: Backend generates authentic Razorpay order tokens in paise via the official Razorpay SDK.
- **Client-Side Checkout**: Secure Razorpay modal checkout supporting Test UPI, NetBanking, and Credit/Debit Cards.
- **Server Verification**: Cryptographic payment verification via HMAC-SHA256 signature matching before order status updates.
- **Order Lifecycle**: Orders transition through statuses (`PENDING_PAYMENT`, `PLACED`, `CONFIRMED`, `SHIPPED`, `DELIVERED`).
- **Celebration Effects**: Confetti fireworks triggered via `canvas-confetti` upon successful order placement.
- **Order History & Invoices**: Order list with filter tabs, 1-click Order ID clipboard copy, order timeline tracker, and a printable invoice layout (`window.print()`).

---

## 🏗️ Architecture & Tech Stack

```
ShopKart (MERN)
├── Frontend (React 19 + Vite + Tailwind CSS 4)
│   ├── Context API (CartContext, ToastContext)
│   ├── React Router v7 (Client-side routing & deep linking)
│   ├── Lucide React (SVG iconography)
│   ├── Axios (REST API communication with credentials)
│   └── Canvas Confetti (Celebratory order animation)
│
└── Backend (Node.js + Express 5)
    ├── REST API Architecture (Controllers, Routes, Middlewares)
    ├── MongoDB Atlas (Mongoose ODM models for Customer, Product, Order)
    ├── Razorpay Node SDK (Order creation & signature verification)
    └── Authentication (JWT + Bcrypt + Cookie-Parser)
```

### Technology Breakdown

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, Tailwind CSS 4, React Router DOM 7, Lucide React, Axios, Canvas Confetti |
| **Backend** | Node.js, Express.js 5, Mongoose 9, MongoDB Atlas, Razorpay SDK, JsonWebToken, Bcrypt |
| **Styling & Fonts** | Google Fonts (*Plus Jakarta Sans*), Custom Scrollbars, Glassmorphism, Responsive Flex/Grid |
| **Security** | Bcrypt (10 rounds), HTTP-Only Strict Cookies, Razorpay Webhook/HMAC Verification |

---

## 📁 Project Directory Structure

```text
MERN-1/
├── backend/
│   ├── config/
│   │   └── razorpay.js            # Razorpay instance initialization
│   ├── controllers/
│   │   ├── cart.controller.js     # Cart items & quantity logic
│   │   ├── customer.controller.js # Auth, registration, login, profile
│   │   ├── order.controller.js    # Razorpay order creation & payment verification
│   │   ├── product.controller.js  # Product listing, search, filtering
│   │   └── wishlist.controller.js # Customer wishlist toggle logic
│   ├── middlewares/
│   │   └── auth.middleware.js     # JWT cookie authentication check
│   ├── models/
│   │   ├── customer.model.js      # Customer schema (cart, wishlist, profile)
│   │   ├── order.model.js         # Order schema (items, shipping, payment status)
│   │   └── product.model.js       # Product schema (name, price, stock, category)
│   ├── routes/
│   │   ├── cart.routes.js
│   │   ├── customer.routes.js
│   │   ├── order.routes.js
│   │   ├── product.routes.js
│   │   └── wishlist.routes.js
│   ├── utils/
│   │   └── generateToken.js       # JWT generation utility
│   ├── .env                       # Environment variables (DB URL, Razorpay keys)
│   ├── index.js                   # Express server entry point (Port 8082)
│   ├── package.json
│   └── seed.js                    # Database seed script with sample products
│
└── frontend/
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    ├── src/
    │   ├── components/
    │   │   ├── Footer.jsx         # Modern multi-column footer with project badges
    │   │   ├── Navbar.jsx         # Sticky glassmorphism nav with live counters
    │   │   └── ProductCard.jsx    # Responsive card with hover zoom & discount tag
    │   ├── context/
    │   │   ├── CartContext.jsx    # Cart state & operations
    │   │   └── ToastContext.jsx   # Floating animated notification system
    │   ├── pages/
    │   │   ├── Cart.jsx           # Cart page with item stepper & order summary
    │   │   ├── Checkout.jsx       # Shipping form & Razorpay trigger
    │   │   ├── Home.jsx           # Flagship e-commerce landing page
    │   │   ├── Login.jsx          # Glassmorphism login page with password toggle
    │   │   ├── OrderDetails.jsx   # Confetti celebration, tracker, and invoice
    │   │   ├── Orders.jsx         # Order history with filters & ID copy
    │   │   ├── ProductDetails.jsx # Showcase gallery, specs tabs, quantity picker
    │   │   ├── Products.jsx       # Catalog with search, pills, and sort
    │   │   ├── Register.jsx       # Customer signup with validation
    │   │   └── Wishlist.jsx       # Wishlist grid with quick cart transfer
    │   ├── services/
    │   │   └── api.js             # Axios instance with credentials enabled
    │   ├── App.jsx                # Route definitions & navigation
    │   ├── index.css              # Design tokens, typography & animations
    │   └── main.jsx               # React DOM root with context providers
    ├── index.html                 # SEO meta tags & Google Fonts
    ├── package.json
    └── vite.config.js             # Vite + Tailwind CSS configuration
```

---

## 🔌 API Endpoints Reference

### 👤 Customer & Authentication
- `POST /customers/register` — Register a new customer
- `POST /customers/login` — Authenticate and issue HTTP-only JWT cookie
- `GET /customers/me` — Fetch authenticated customer profile (`Protected`)
- `POST /customers/logout` — Clear session cookie (`Protected`)
- `PATCH /customers/change-password` — Change password (`Protected`)

### 📦 Products
- `GET /products` — Query products (supports `?search=...`, `?category=...`, `?sort=price_asc|price_desc`)
- `GET /products/:id` — Retrieve single product details by MongoDB ObjectId
- `POST /products` — Create a new product (Admin)

### 💖 Wishlist
- `GET /wishlist` — Fetch current user's saved wishlist (`Protected`)
- `PATCH /wishlist/:productId/toggle` — Toggle product addition/removal (`Protected`)

### 🛒 Cart
- `GET /cart` — Fetch user's cart with populated product data (`Protected`)
- `POST /cart/:productId` — Add product to cart (`Protected`)
- `PATCH /cart/:productId` — Update item quantity (`Protected`)
- `DELETE /cart/:productId` — Remove product from cart (`Protected`)

### 💳 Orders & Razorpay
- `POST /orders/create-payment-order` — Verify stock, create DB order, and generate Razorpay Order ID (`Protected`)
- `POST /orders/verify-payment` — Cryptographic HMAC-SHA256 signature verification & mark paid (`Protected`)
- `GET /orders` — Fetch customer's order history (`Protected`)
- `GET /orders/:id` — Fetch complete order receipt and status (`Protected`)

---

## ⚙️ Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster connection string)
- [Razorpay Account](https://dashboard.razorpay.com/) (Test mode Key ID & Key Secret)

---

### Step 1: Clone Repository
```bash
git clone https://github.com/harsh-sorout-10024/Shopkart.git
cd Shopkart
```

---

### Step 2: Configure Backend Environment
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create or verify your `.env` file in `backend/`:
   ```env
   PORT=8082
   dbURL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/shopkart
   jwt_secret=your_super_secret_jwt_key
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```
3. Install backend dependencies:
   ```bash
   npm install
   ```
4. Seed sample products into your MongoDB database:
   ```bash
   node seed.js
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *Backend will run on `http://localhost:8082`.*

---

### Step 3: Configure & Start Frontend
1. Open a new terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Frontend will launch at `http://localhost:5173/`.*

---

## 🧪 Testing the Payment Flow (Razorpay Test Mode)

1. Open your browser and navigate to `http://localhost:5173/register` to create a free account.
2. Log in with your new credentials to enter the **ShopKart** store.
3. Browse products from **Electronics**, **Fashion**, **Books**, or **Home**.
4. Add items to your cart or wishlist.
5. Head to the **Cart** (`/cart`) and click **Proceed to Checkout**.
6. On the **Checkout** page, click **Autofill Profile Address** to instantly populate shipping fields.
7. Click **Pay with Razorpay** to launch the test payment modal.
8. Use Razorpay's simulated payment methods:
   - **UPI**: Enter any mock VPA (e.g., `success@razorpay`).
   - **Cards**: Use Razorpay test card numbers with any future expiry date and 3-digit CVV.
9. Upon authorization, the app automatically verifies payment signatures, clears your cart, triggers **confetti celebration**, and presents your complete itemized receipt!

---

## 👤 Author
- **Harsh Sorout**
- GitHub: [@harsh-sorout-10024](https://github.com/harsh-sorout-10024)
- Repository: [Shopkart](https://github.com/harsh-sorout-10024/Shopkart)

---

## 📄 License
This project is licensed under the [ISC License](LICENSE).
