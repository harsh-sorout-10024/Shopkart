# 🛒 ShopKart Frontend Client

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-7.18-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Lucide](https://img.shields.io/badge/Lucide_Icons-Latest-F56565?style=for-the-badge&logo=feather&logoColor=white)](https://lucide.dev/)

The client-side single-page application (SPA) for **ShopKart**, crafted with **React 19**, **Tailwind CSS 4**, and **Vite**. Built with clean component hierarchy, reactive state management via React Context, and integrated with the **Razorpay Client SDK** for seamless e-commerce transactions.

---

## 🎨 UI & UX Design System

- **Typography**: Google Fonts [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (300 to 800 weights) for modern aesthetics.
- **Color Palette**: Dark Slate (`#0f172a`), Indigo-to-Purple brand gradients, Emerald status highlights (`#10b981`), and Rose accents (`#f43f5e`).
- **Glassmorphism**: Backdrop blur utility classes (`.glass-nav`, `.glass-panel`) with subtle borders and shadows.
- **Iconography**: Clean SVG icons from `lucide-react`.
- **Skeleton Shimmers**: Animated shimmer skeleton loaders (`.skeleton-shimmer`) for enhanced perceived performance while fetching products.
- **Delight & Animations**: Celebratory confetti fireworks (`canvas-confetti`) upon order placement.
- **Toast Notifications**: Reusable floating toast feedback system (`ToastContext`) for cart additions, wishlist updates, and API errors.

---

## 📂 Source Code Structure

```text
frontend/
├── public/
│   ├── favicon.svg             # ShopKart brand favicon
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── Footer.jsx          # Multi-column footer with project highlights & trust badges
│   │   ├── Navbar.jsx          # Sticky glassmorphism navigation with live counters
│   │   └── ProductCard.jsx     # Responsive card with image zoom, discount, and stock pill
│   ├── context/
│   │   ├── CartContext.jsx     # Global cart state (items, count, subtotal, quantity updates)
│   │   └── ToastContext.jsx    # Floating animated notification system
│   ├── pages/
│   │   ├── Home.jsx            # Flagship storefront with hero banner, categories, & featured items
│   │   ├── Products.jsx        # Product catalog with debounced search, category pills, & sorting
│   │   ├── ProductDetails.jsx  # Gallery showcase, specs tabs, quantity picker, & stock check
│   │   ├── Wishlist.jsx        # Saved products grid with quick add-to-cart transfer
│   │   ├── Cart.jsx            # Shopping cart with item stepper, subtotal, & checkout CTA
│   │   ├── Checkout.jsx        # Shipping form, address autofill, & Razorpay payment trigger
│   │   ├── Orders.jsx          # Orders list with status filter tabs & Order ID copy button
│   │   ├── OrderDetails.jsx    # Confetti celebration, delivery tracker, & printable invoice
│   │   ├── Login.jsx           # Dark glass login card with password toggle
│   │   └── Register.jsx        # Customer registration with input validation
│   ├── services/
│   │   └── api.js              # Axios instance configured with withCredentials: true
│   ├── App.css
│   ├── App.jsx                 # Route configurations & protected navigation
│   ├── index.css               # Design tokens, Tailwind base, & custom utilities
│   └── main.jsx                # Application root with CartProvider & ToastProvider
├── index.html                  # HTML entry point, SEO meta tags, & Google Fonts
├── package.json
└── vite.config.js              # Vite configuration with React & Tailwind plugins
```

---

## 🛠️ Available Scripts

In the `frontend` directory, you can run:

### `npm run dev`
Runs the app in development mode with Hot Module Replacement (HMR).  
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### `npm run build`
Bundles the application into static files in the `dist/` directory for production deployment with optimal minification and asset chunking.

### `npm run preview`
Locally preview the production build output generated in `dist/`.

### `npm run lint`
Runs ESLint to check for code quality and syntax issues.

---

## ⚡ State Management & Architecture

### 1. `CartContext.jsx`
Provides global cart state across the entire app:
- `cartItems`: Array of cart items populated with product details.
- `cartCount`: Derived total quantity count displayed in the navigation badge.
- `subtotal`: Derived sum of all item prices multiplied by their quantities.
- `addToCart(productId)`: Adds product or increments quantity.
- `updateQuantity(productId, quantity)`: Updates item quantity with inventory limits.
- `removeFromCart(productId)`: Deletes product from cart.
- `clearCartState()`: Flushes local cart state after successful Razorpay payment.

### 2. `ToastContext.jsx`
Lightweight, accessible toast feedback hook:
- `addToast(message, type, duration)`: Spawns an animated floating notification (`success`, `error`, `info`).

### 3. API Communication (`services/api.js`)
Configured Axios instance connecting to the backend on `http://localhost:8082`:
- `withCredentials: true` ensures authentication cookies (`token`) are automatically passed back and forth on every request.

---

## 💳 Razorpay SDK Integration

The frontend dynamically loads the official Razorpay Checkout SDK (`https://checkout.razorpay.com/v1/checkout.js`) at checkout:
1. Requests order creation from the backend (`/orders/create-payment-order`).
2. Opens the Razorpay modal populated with customer details and the Razorpay Order ID.
3. Upon payment completion, captures `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`.
4. Sends the cryptographic signature to `/orders/verify-payment` for HMAC verification.
5. Redirects to `/orders/:id` with celebratory confetti on success.

---

## 📱 Responsive Breakpoints

The UI is built mobile-first using Tailwind's responsive breakpoints:
- **Mobile (< 640px)**: Compact single-column layouts, hamburger slide-down drawer, touch-friendly tap targets.
- **Tablet (640px - 1024px)**: 2-column catalog grids, balanced typography.
- **Desktop (>= 1024px)**: 4-column catalog grids, sticky checkout & order summary sidebars, and full desktop navigation.
