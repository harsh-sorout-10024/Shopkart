import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Headphones, 
  ShoppingBag, 
  Heart, 
  Package, 
  User, 
  Laptop, 
  Shirt, 
  BookOpen, 
  Home as HomeCategoryIcon,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

function Home() {
  const [user, setUser] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [wishlistSet, setWishlistSet] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, productsRes, wishlistRes] = await Promise.allSettled([
          api.get('/customers/me'),
          api.get('/products'),
          api.get('/wishlist')
        ]);

        if (userRes.status === 'fulfilled') {
          setUser(userRes.value.data);
        } else {
          // If unauthenticated, redirect to login
          navigate('/login');
          return;
        }

        if (productsRes.status === 'fulfilled') {
          const prods = productsRes.value.data?.products || [];
          // Pick top 4 products for featured showcase
          setFeaturedProducts(prods.slice(0, 4));
        }

        if (wishlistRes.status === 'fulfilled' && wishlistRes.value.data?.success) {
          const ids = wishlistRes.value.data.wishlist.map((w) => w._id || w);
          setWishlistSet(new Set(ids));
        }
      } catch (error) {
        console.error('Home data fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mb-4"></div>
          <p className="text-slate-600 font-semibold text-sm">Preparing your shopping experience...</p>
        </div>
      </div>
    );
  }

  const customer = user?.customer || user;
  const firstName = customer?.fullName?.split(' ')[0] || 'Friend';

  const categories = [
    {
      name: 'Electronics',
      tagline: 'Audio, Peripherals & Smart Tech',
      icon: Laptop,
      color: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50/70 text-blue-700 border-blue-200'
    },
    {
      name: 'Fashion',
      tagline: 'Timeless Watches & Essentials',
      icon: Shirt,
      color: 'from-purple-500 to-pink-600',
      bgLight: 'bg-purple-50/70 text-purple-700 border-purple-200'
    },
    {
      name: 'Books',
      tagline: 'Self-help, Tech & Bestsellers',
      icon: BookOpen,
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-amber-50/70 text-amber-700 border-amber-200'
    },
    {
      name: 'Home',
      tagline: 'Ceramics, Decor & Daily Comfort',
      icon: HomeCategoryIcon,
      color: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50/70 text-emerald-700 border-emerald-200'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 left-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-semibold backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Next-Gen MERN E-Commerce Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
                Discover Curated Tech &{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  Modern Essentials.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Welcome back, <span className="text-indigo-400 font-bold">{firstName}</span>! Experience lightning-fast shopping with Razorpay-powered secure checkout, instant order tracking, and door-to-door delivery.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white gradient-brand shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/orders"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Package className="w-4 h-4 text-indigo-400" />
                  <span>Track My Orders</span>
                </Link>
              </div>

              {/* Key Trust Checkmarks */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-800 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Razorpay Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>48-Hour Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Genuine Items</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Account / Spotlight Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-6 border-b border-slate-700/80">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                      {firstName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Active Member</p>
                      <h3 className="text-lg font-bold text-white">{customer?.fullName || 'Customer Profile'}</h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                    Online
                  </span>
                </div>

                {/* Account Details Snapshot */}
                <div className="py-5 space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between items-center text-slate-300 py-1.5 border-b border-slate-700/50">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-medium text-white truncate max-w-[200px]">{customer?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300 py-1.5 border-b border-slate-700/50">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-medium text-white">{customer?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300 py-1.5">
                    <span className="text-slate-400">Security:</span>
                    <span className="font-medium text-emerald-400">JWT Authenticated</span>
                  </div>
                </div>

                {/* Quick Action Grid */}
                <div className="grid grid-cols-2 gap-3 pt-3">
                  <Link
                    to="/wishlist"
                    className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-700/70 transition flex items-center gap-2.5 text-xs font-semibold text-slate-200"
                  >
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span>My Wishlist</span>
                  </Link>
                  <Link
                    to="/cart"
                    className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-700/70 transition flex items-center gap-2.5 text-xs font-semibold text-slate-200"
                  >
                    <ShoppingBag className="w-4 h-4 text-indigo-400" />
                    <span>My Cart</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props Row */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Express Delivery</h4>
                <p className="text-xs text-slate-500 mt-0.5">Reliable dispatch in 48h</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Razorpay Payments</h4>
                <p className="text-xs text-slate-500 mt-0.5">Encrypted UPI & Cards</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Easy Returns</h4>
                <p className="text-xs text-slate-500 mt-0.5">7-Day return policy</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Priority Support</h4>
                <p className="text-xs text-slate-500 mt-0.5">Dedicated customer care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Browse by Category</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Shop by Department</h2>
            </div>
            <Link
              to="/products"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition"
            >
              <span>View All Departments</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="group bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 relative overflow-hidden"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {cat.tagline}
                  </p>
                  <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600 gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Shop now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      {featuredProducts.length > 0 && (
        <section className="py-12 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curated Picks</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Featured & Trending Products</h2>
              </div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  initialWishlistState={wishlistSet.has(product._id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Special Promotional Banner */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden gradient-brand p-8 sm:p-12 text-white shadow-xl">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wide uppercase">
                Limited Time Promotion
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Discover Everyday Tech & Lifestyle Essentials.
              </h2>
              <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
                Experience fast dispatch, genuine products, and seamless Razorpay checkout on every purchase.
              </p>
              <div className="pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition shadow-md active:scale-95"
                >
                  <span>Start Shopping Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;