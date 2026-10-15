import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  Plus, 
  Minus, 
  ShieldCheck, 
  ArrowLeft,
  Truck
} from 'lucide-react';

function Cart() {
  const { cartItems, loading, error, updateQuantity, removeFromCart, cartCount, subtotal } = useCart();
  const { addToast } = useToast();

  const handleQuantityChange = async (productId, currentQuantity, stock, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) return;
    if (newQuantity > stock) {
      addToast(`Only ${stock} items available in stock`, 'error');
      return;
    }

    const res = await updateQuantity(productId, newQuantity);
    if (!res.success) {
      addToast(res.message || 'Could not update quantity', 'error');
    }
  };

  const handleRemove = async (productId, productName) => {
    const res = await removeFromCart(productId);
    if (res.success) {
      addToast(`Removed "${productName}" from your cart`, 'info');
    } else {
      addToast(res.message || 'Failed to remove item', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Title & Item Count Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review your selected items before proceeding to checkout.
            </p>
          </div>
          {cartCount > 0 && (
            <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 self-start sm:self-auto">
              {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
            </span>
          )}
        </div>

        {loading && (
          <div className="py-24 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-slate-600 font-semibold text-sm">Loading your cart items...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-rose-50 text-rose-700 p-6 rounded-2xl text-center mb-8 border border-rose-200 max-w-md mx-auto">
            <p className="font-semibold text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-xs font-bold underline text-rose-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty Cart State */}
        {!loading && !error && cartItems.length === 0 && (
          <div className="text-center py-20 px-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-xl mx-auto">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 mb-6 shadow-sm">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
              Looks like you haven't added any products to your cart yet. Explore our curated catalog!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white gradient-brand shadow-md shadow-indigo-500/20 hover:opacity-95 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Products</span>
            </Link>
          </div>
        )}

        {/* Active Cart Layout */}
        {!loading && !error && cartItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => {
                const product = item.product;
                const isOutOfStock = product?.stock <= 0;
                return (
                  <div
                    key={item._id}
                    className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5 hover:border-slate-300 transition-all duration-200"
                  >
                    {/* Item Thumbnail */}
                    <Link
                      to={`/products/${product?._id}`}
                      className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 flex items-center justify-center p-2"
                    >
                      <img
                        src={product?.image}
                        alt={product?.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop';
                        }}
                      />
                    </Link>

                    {/* Item Info & Stepper */}
                    <div className="flex-grow flex flex-col justify-between w-full h-full">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div>
                          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                            {product?.category}
                          </span>
                          <Link
                            to={`/products/${product?._id}`}
                            className="block font-bold text-slate-900 text-base sm:text-lg hover:text-indigo-600 transition"
                          >
                            {product?.name}
                          </Link>
                          <p className="text-slate-500 text-xs mt-0.5">
                            Unit Price: <span className="font-semibold text-slate-700">₹{product?.price?.toLocaleString('en-IN')}</span>
                          </p>
                        </div>

                        {/* Item Total */}
                        <div className="text-left sm:text-right mt-1 sm:mt-0">
                          <p className="text-xs text-slate-400">Total</p>
                          <p className="text-lg sm:text-xl font-extrabold text-slate-900">
                            ₹{((product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {/* Controls Row: Stepper and Remove */}
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 shadow-xs">
                            <button
                              onClick={() =>
                                handleQuantityChange(product?._id, item.quantity, product?.stock, -1)
                              }
                              disabled={item.quantity <= 1}
                              className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-l-xl disabled:opacity-40 transition"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            <span className="px-3.5 text-xs sm:text-sm font-bold text-slate-900 min-w-[36px] text-center">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                handleQuantityChange(product?._id, item.quantity, product?.stock, 1)
                              }
                              disabled={item.quantity >= product?.stock}
                              className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-r-xl disabled:opacity-40 transition"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {product?.stock <= 5 && (
                            <span className="text-[11px] font-semibold text-amber-600">
                              Only {product.stock} left
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleRemove(product?._id, product?.name)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-600 transition p-1.5 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-4 sticky top-24 space-y-4">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
                <h2 className="text-xl font-extrabold text-slate-900 mb-6">
                  Order Summary
                </h2>

                {/* Subtotals breakdown */}
                <div className="space-y-3.5 text-sm text-slate-600 pb-6 border-b border-slate-100">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'}):</span>
                    <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <span>Shipping:</span>
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    </span>
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs">
                      FREE EXPRESS
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Tax:</span>
                    <span className="text-slate-500">Included in price</span>
                  </div>
                </div>

                {/* Final Total */}
                <div className="py-6 flex justify-between items-baseline">
                  <div>
                    <span className="text-base font-extrabold text-slate-900 block">Total Amount:</span>
                    <span className="text-xs text-slate-400">Secure Razorpay Checkout</span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-indigo-600">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Checkout CTA */}
                <Link
                  to="/checkout"
                  className="w-full py-4 rounded-2xl font-bold text-white gradient-brand shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:opacity-95 active:scale-[0.98] transition flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Trust and Payment Badges */}
                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Razorpay Official 256-Bit SSL Protection</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Cart;
