import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, CreditCard, Heart, ExternalLink } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      {/* Trust Highlights Row */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Free Express Shipping</h4>
                <p className="text-xs text-slate-400">On all prepaid orders</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Razorpay Secured</h4>
                <p className="text-xs text-slate-400">256-bit encrypted checkout</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Easy Returns</h4>
                <p className="text-xs text-slate-400">7-day hassle-free policy</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Multiple Payment Options</h4>
                <p className="text-xs text-slate-400">UPI, Cards, NetBanking</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/home" className="inline-flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-xl gradient-brand flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">Shop<span className="text-indigo-400">Kart</span></span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Curated everyday electronics, fashion, books, and lifestyle goods delivered right to your doorstep.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Operational
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/home" className="text-slate-400 hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-slate-400 hover:text-white transition">Browse All Products</Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-slate-400 hover:text-white transition">My Wishlist</Link>
              </li>
              <li>
                <Link to="/cart" className="text-slate-400 hover:text-white transition">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/orders" className="text-slate-400 hover:text-white transition">Track Orders</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Top Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products" className="text-slate-400 hover:text-white transition">Electronics & Gadgets</Link>
              </li>
              <li>
                <Link to="/products" className="text-slate-400 hover:text-white transition">Fashion & Apparel</Link>
              </li>
              <li>
                <Link to="/products" className="text-slate-400 hover:text-white transition">Bestseller Books</Link>
              </li>
              <li>
                <Link to="/products" className="text-slate-400 hover:text-white transition">Home & Living</Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack / Project Details */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Project Highlights</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span><strong className="text-slate-300">Architecture:</strong> MERN (MongoDB, Express, React, Node.js)</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span><strong className="text-slate-300">Payment:</strong> Razorpay Gateway Integration</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span><strong className="text-slate-300">Styling:</strong> Tailwind CSS & Modern UI Tokens</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span><strong className="text-slate-300">State:</strong> React Context API & REST APIs</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ShopKart E-Commerce. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Final Project Submission
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
