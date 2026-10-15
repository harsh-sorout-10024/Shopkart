import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ArrowUpDown, 
  ShoppingBag, 
  Sparkles,
  Layers
} from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Electronics',
  'Fashion',
  'Books',
  'Home'
];

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All Categories';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [wishlistSet, setWishlistSet] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('');

  // Synchronize category if changed in URL
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && cat !== category) {
      setCategory(cat);
    }
  }, [searchParams]);

  const fetchProductsAndWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search.trim() !== '') params.search = search.trim();
      if (category !== 'All Categories') params.category = category;
      if (sort !== '') params.sort = sort;

      const [productsRes, wishlistRes] = await Promise.allSettled([
        api.get('/products', { params }),
        api.get('/wishlist')
      ]);

      if (productsRes.status === 'fulfilled') {
        setProducts(productsRes.value.data?.products || []);
      } else {
        setError('Something went wrong while loading products.');
      }

      if (wishlistRes.status === 'fulfilled' && wishlistRes.value.data?.success) {
        const ids = wishlistRes.value.data.wishlist.map((w) => w._id || w);
        setWishlistSet(new Set(ids));
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong while loading products.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOnlyWishlist = async () => {
    try {
      const wishlistRes = await api.get('/wishlist');
      if (wishlistRes.data?.success) {
        const ids = wishlistRes.data.wishlist.map((w) => w._id || w);
        setWishlistSet(new Set(ids));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProductsAndWishlist();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, sort]);

  useEffect(() => {
    const handleWishlistUpdated = () => {
      fetchOnlyWishlist();
    };

    window.addEventListener('wishlist-updated', handleWishlistUpdated);

    return () => {
      window.removeEventListener('wishlist-updated', handleWishlistUpdated);
    };
  }, []);

  const handleClearFilters = () => {
    setSearch('');
    setCategory('All Categories');
    setSort('');
    setSearchParams({});
  };

  const hasActiveFilters = search.trim() !== '' || category !== 'All Categories' || sort !== '';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ShopKart Marketplace</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Discover All Products
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Browse our premium selection of tech, fashion, books, and lifestyle items.
              </p>
            </div>

            {/* Search Input Bar */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 shadow-xs"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills & Sort Select */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      if (cat === 'All Categories') {
                        searchParams.delete('category');
                      } else {
                        searchParams.set('category', cat);
                      }
                      setSearchParams(searchParams);
                    }}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'gradient-brand text-white shadow-md shadow-indigo-500/20 scale-[1.02]'
                        : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Sort & Filter Controls */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-slate-500" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-xs"
                >
                  <option value="">Sort: Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline px-2 py-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog View */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Results Bar */}
        <div className="mb-6 flex items-center justify-between text-xs sm:text-sm text-slate-500">
          <p>
            Showing <strong className="text-slate-900 font-bold">{products.length}</strong> {products.length === 1 ? 'product' : 'products'}
            {category !== 'All Categories' && <span> in <strong className="text-indigo-600 font-semibold">{category}</strong></span>}
            {search && <span> matching "<strong className="text-slate-800">{search}</strong>"</span>}
          </p>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-4 space-y-4">
                <div className="h-48 w-full rounded-xl skeleton-shimmer"></div>
                <div className="h-4 w-3/4 rounded-md skeleton-shimmer"></div>
                <div className="h-6 w-1/3 rounded-md skeleton-shimmer"></div>
                <div className="h-10 w-full rounded-xl skeleton-shimmer"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error message */}
        {!loading && error && (
          <div className="bg-rose-50 text-rose-700 p-6 rounded-2xl text-center border border-rose-200 max-w-md mx-auto my-12">
            <p className="font-semibold">{error}</p>
            <button
              onClick={fetchProductsAndWishlist}
              className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-xl mx-auto px-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No matching products found</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              We couldn't find any products matching your current filters. Try adjusting your search query or department.
            </p>
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white gradient-brand shadow-sm hover:opacity-95 transition"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                initialWishlistState={wishlistSet.has(product._id)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Products;
