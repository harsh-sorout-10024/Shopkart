import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { 
  ShoppingBag, 
  Heart, 
  PackageCheck, 
  Home as HomeIcon, 
  Compass, 
  LogOut, 
  Menu, 
  X, 
  User
} from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const { cartCount } = useCart();

  const fetchWishlistCount = async () => {
    try {
      const response = await api.get('/wishlist');
      if (response.data.success) {
        setWishlistCount(response.data.count || (response.data.wishlist ? response.data.wishlist.length : 0));
      }
    } catch (error) {
      console.log('Failed to fetch wishlist count', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/customers/me');
      const data = response.data?.customer || response.data;
      if (data?.fullName) {
        setCustomerName(data.fullName);
      }
    } catch {
      // Ignore if unauthenticated
    }
  };

  useEffect(() => {
    fetchWishlistCount();
    fetchUserProfile();

    const handleWishlistUpdated = () => {
      fetchWishlistCount();
    };

    window.addEventListener('wishlist-updated', handleWishlistUpdated);

    return () => {
      window.removeEventListener('wishlist-updated', handleWishlistUpdated);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.post('/customers/logout');
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      navigate('/login');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/home', icon: HomeIcon },
    { name: 'Products', path: '/products', icon: Compass },
    { 
      name: 'Wishlist', 
      path: '/wishlist', 
      icon: Heart, 
      badge: wishlistCount > 0 ? wishlistCount : null 
    },
    { 
      name: 'Cart', 
      path: '/cart', 
      icon: ShoppingBag, 
      badge: cartCount > 0 ? cartCount : null 
    },
    { name: 'My Orders', path: '/orders', icon: PackageCheck },
  ];

  const isActive = (path) => {
    if (path === '/products' && location.pathname.startsWith('/products')) return true;
    if (path === '/orders' && location.pathname.startsWith('/orders')) return true;
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/home" className="flex items-center gap-2.5 group">
              <div className="h-10 w-10 rounded-xl gradient-brand flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Shop<span className="text-indigo-600">Kart</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 -mt-1 hidden sm:block">
                  Premium Store
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1.5" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      active
                        ? 'bg-indigo-50 text-indigo-700 shadow-xs shadow-indigo-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span>{link.name}</span>
                    {link.badge !== null && (
                      <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full ${
                        active 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions: User info & Logout */}
          <div className="flex items-center gap-3">
            {customerName && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {customerName.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate">{customerName}</span>
              </div>
            )}

            <button
              onClick={handleLogout}
              title="Logout of your account"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-rose-600 bg-slate-100/80 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg px-4 pt-3 pb-5 space-y-1.5 shadow-lg">
          {customerName && (
            <div className="px-3 py-2 mb-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-sm text-slate-700">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Signed in as <strong className="font-semibold text-slate-900">{customerName}</strong></span>
            </div>
          )}
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </div>
                {link.badge !== null && (
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    active ? 'bg-white text-indigo-600' : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

export default Navbar;
