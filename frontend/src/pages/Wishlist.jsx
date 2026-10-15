import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await api.get('/wishlist');
      if (response.data.success) {
        setWishlist(response.data.wishlist || []);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();

    const handleWishlistUpdated = () => {
      fetchWishlist();
    };

    window.addEventListener('wishlist-updated', handleWishlistUpdated);

    return () => {
      window.removeEventListener('wishlist-updated', handleWishlistUpdated);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <span>My Wishlist</span>
              <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            </h1>
            {!loading && !error && (
              <p className="text-sm text-slate-500 mt-1">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved in your private collection.
              </p>
            )}
          </div>

          {!loading && !error && wishlist.length > 0 && (
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 transition"
            >
              <span>Discover More Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-24 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-slate-600 font-semibold text-sm">Loading your saved wishlist items...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="py-16 px-6 bg-white rounded-3xl border border-slate-200 text-center max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Could not load wishlist</h3>
            <p className="text-sm text-slate-500 mb-6">There was a problem fetching your wishlist items.</p>
            <button
              onClick={fetchWishlist}
              className="px-6 py-2.5 rounded-xl font-bold text-white gradient-brand shadow-sm hover:opacity-95 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty Wishlist State */}
        {!loading && !error && wishlist.length === 0 && (
          <div className="py-20 px-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs text-center max-w-xl mx-auto">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-500 mb-6 shadow-sm">
              <Heart className="w-10 h-10 fill-rose-500/20" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
              Explore our tech, fashion, and books collection and click the heart icon on any product to save it here.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white gradient-brand shadow-md shadow-indigo-500/20 hover:opacity-95 transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse Products</span>
            </Link>
          </div>
        )}

        {/* Wishlist Grid */}
        {!loading && !error && wishlist.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                initialWishlistState={true}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Wishlist;
