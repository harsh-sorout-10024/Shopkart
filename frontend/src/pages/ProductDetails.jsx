import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Heart, 
  Star, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  Check, 
  Plus, 
  Minus,
  CheckCircle2,
  Share2
} from 'lucide-react';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSavingWishlist, setIsSavingWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const { cartItems, addToCart, updateQuantity } = useCart();
  const { addToast } = useToast();

  const cartItem = product ? cartItems.find((item) => item.product?._id === product._id) : null;
  const inCart = !!cartItem;
  const inCartQuantity = cartItem?.quantity || 0;

  useEffect(() => {
    const fetchProductAndWishlist = async () => {
      try {
        setLoading(true);
        const [productRes, wishlistRes] = await Promise.allSettled([
          api.get(`/products/${id}`),
          api.get('/wishlist')
        ]);

        if (productRes.status === 'fulfilled' && productRes.value.data?.product) {
          setProduct(productRes.value.data.product);
        } else {
          setError('Product not found or something went wrong.');
        }

        if (wishlistRes.status === 'fulfilled' && wishlistRes.value.data?.success) {
          const ids = wishlistRes.value.data.wishlist.map((w) => w._id || w);
          setIsWishlisted(ids.includes(id));
        }
      } catch (err) {
        console.error(err);
        setError('Product not found or something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndWishlist();
  }, [id]);

  const handleWishlistToggle = async () => {
    if (!product || isSavingWishlist) return;

    setIsSavingWishlist(true);
    try {
      const response = await api.patch(`/wishlist/${product._id}/toggle`);
      if (response.data.success) {
        const added = response.data.action === 'added';
        setIsWishlisted(added);
        addToast(
          added ? `Added "${product.name}" to your wishlist!` : `Removed from wishlist`,
          'success'
        );
        window.dispatchEvent(new Event('wishlist-updated'));
      }
    } catch {
      addToast('Could not update wishlist.', 'error');
    } finally {
      setIsSavingWishlist(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product || isAdding || product.stock < 1) return;

    setIsAdding(true);
    try {
      // If already in cart, update quantity
      if (inCart) {
        const newQty = inCartQuantity + quantity;
        if (newQty > product.stock) {
          addToast(`Maximum stock limit reached (${product.stock} available)`, 'error');
          setIsAdding(false);
          return;
        }
        await updateQuantity(product._id, newQty);
      } else {
        await addToCart(product._id);
        // If user selected > 1, update quantity to matched selected quantity
        if (quantity > 1) {
          await updateQuantity(product._id, quantity);
        }
      }
      setJustAdded(true);
      addToast(`Added ${quantity} × "${product.name}" to your cart!`, 'success');
      setTimeout(() => setJustAdded(false), 2000);
    } catch {
      addToast('Failed to add product to cart.', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const originalPrice = product ? Math.round(product.price * 1.25) : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <Link to="/home" className="hover:text-indigo-600 transition">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-indigo-600 transition">Products</Link>
          {product && (
            <>
              <span>/</span>
              <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-indigo-600 transition">
                {product.category}
              </Link>
              <span>/</span>
              <span className="text-slate-900 font-medium truncate max-w-[200px]">{product.name}</span>
            </>
          )}
        </div>

        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {loading && (
          <div className="py-24 flex flex-col items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mb-4"></div>
            <p className="text-slate-600 font-semibold text-sm">Loading product details...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-rose-50 text-rose-700 p-8 rounded-3xl text-center border border-rose-200 max-w-lg mx-auto my-12">
            <p className="text-base font-semibold">{error}</p>
            <Link
              to="/products"
              className="mt-4 inline-block px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition"
            >
              Return to Products
            </Link>
          </div>
        )}

        {!loading && !error && product && (
          <div className="space-y-12">
            {/* Main Product Showcase Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-12">
              {/* Product Gallery Showcase */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center bg-slate-50/70 rounded-2xl p-6 sm:p-10 border border-slate-100 relative group">
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <span className="px-3 py-1 bg-white/95 backdrop-blur-md rounded-xl text-xs font-bold text-slate-800 shadow-xs border border-slate-200/60">
                    {product.category}
                  </span>
                  <span className="px-3 py-1 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs">
                    20% OFF
                  </span>
                </div>

                <div className="w-full max-h-[460px] flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-[420px] w-auto max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop';
                    }}
                  />
                </div>
              </div>

              {/* Product Info & Actions */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  {/* Rating & Stock */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg text-amber-700 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>4.8 Rating</span>
                      </div>
                      <span className="text-xs text-slate-400">• 142 Reviews</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                      <span className={`text-xs font-bold ${product.stock > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of stock'}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                    {product.name}
                  </h1>

                  {/* Price Block */}
                  <div className="flex items-baseline gap-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-base text-slate-400 line-through">
                      ₹{originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                      Inclusive of all taxes
                    </span>
                  </div>

                  {/* Description preview */}
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
                    {product.description}
                  </p>

                  {/* Quantity Stepper & Stock */}
                  {product.stock > 0 && (
                    <div className="mb-6 flex items-center gap-4">
                      <span className="text-sm font-semibold text-slate-700">Quantity:</span>
                      <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-xs">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          disabled={quantity <= 1}
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-40 rounded-l-xl transition"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 text-sm font-bold text-slate-900 min-w-[44px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                          disabled={quantity >= product.stock}
                          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-40 rounded-r-xl transition"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {inCart && (
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                          {inCartQuantity} currently in cart
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={isAdding || product.stock < 1}
                      className={`w-full sm:flex-grow py-4 px-6 rounded-2xl text-base font-bold transition-all duration-200 flex items-center justify-center gap-2.5 shadow-md ${
                        product.stock < 1
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : justAdded
                          ? 'bg-emerald-600 text-white'
                          : 'gradient-brand text-white hover:opacity-95 active:scale-[0.98] shadow-indigo-500/25'
                      }`}
                    >
                      {isAdding ? (
                        <span className="inline-block w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
                      ) : justAdded ? (
                        <>
                          <Check className="w-5 h-5" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5" />
                          <span>{inCart ? 'Add More to Cart' : 'Add to Cart'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleWishlistToggle}
                      disabled={isSavingWishlist}
                      className={`w-full sm:w-auto p-4 rounded-2xl border font-semibold transition-all flex items-center justify-center gap-2 ${
                        isWishlisted
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                      title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span className="sm:hidden">{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
                    </button>
                  </div>
                </div>

                {/* Trust Badges Bar */}
                <div className="grid grid-cols-3 gap-3 pt-8 mt-8 border-t border-slate-100 text-center">
                  <div className="flex flex-col items-center">
                    <Truck className="w-5 h-5 text-indigo-600 mb-1" />
                    <span className="text-xs font-bold text-slate-900">Free Express</span>
                    <span className="text-[10px] text-slate-400">Pan-India Delivery</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
                    <span className="text-xs font-bold text-slate-900">100% Genuine</span>
                    <span className="text-[10px] text-slate-400">Verified Brand</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <RefreshCw className="w-5 h-5 text-purple-600 mb-1" />
                    <span className="text-xs font-bold text-slate-900">7 Days Return</span>
                    <span className="text-[10px] text-slate-400">Hassle-Free Policy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Tabs */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="border-b border-slate-200 flex space-x-6 px-6 sm:px-10">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-4 text-sm font-bold transition border-b-2 ${
                    activeTab === 'description'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Product Details
                </button>
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`py-4 text-sm font-bold transition border-b-2 ${
                    activeTab === 'specs'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`py-4 text-sm font-bold transition border-b-2 ${
                    activeTab === 'shipping'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Shipping & Return Policy
                </button>
              </div>

              <div className="p-6 sm:p-10 text-slate-600 text-sm leading-relaxed">
                {activeTab === 'description' && (
                  <div className="space-y-4 max-w-3xl">
                    <h3 className="text-base font-bold text-slate-900">About this item</h3>
                    <p>{product.description}</p>
                    <ul className="space-y-2 pt-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Curated for peak performance and everyday lifestyle versatility.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Rigorous quality check before packaging and dispatch.</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Official manufacturer warranty covered under ShopKart guarantee.</span>
                      </li>
                    </ul>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="max-w-xl">
                    <dl className="divide-y divide-slate-100">
                      <div className="py-2.5 flex justify-between">
                        <dt className="font-medium text-slate-500">Category</dt>
                        <dd className="font-semibold text-slate-900">{product.category}</dd>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <dt className="font-medium text-slate-500">Stock Availability</dt>
                        <dd className="font-semibold text-slate-900">{product.stock} units</dd>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <dt className="font-medium text-slate-500">Item Model</dt>
                        <dd className="font-semibold text-slate-900">SK-{product._id.substring(18).toUpperCase()}</dd>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <dt className="font-medium text-slate-500">Standard Delivery</dt>
                        <dd className="font-semibold text-slate-900">2-3 Business Days</dd>
                      </div>
                    </dl>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-3 max-w-2xl">
                    <h3 className="text-base font-bold text-slate-900">Delivery & Returns</h3>
                    <p>
                      Orders placed with ShopKart are processed within 24 hours. We offer free insured shipping on all orders paid via Razorpay (UPI, Credit/Debit Cards, NetBanking).
                    </p>
                    <p>
                      If you receive a defective or mismatched product, you may request a hassle-free return or replacement within 7 calendar days of receipt.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetails;
