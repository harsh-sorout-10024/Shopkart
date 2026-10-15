import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { 
  Package, 
  ShoppingBag, 
  ChevronRight, 
  Copy, 
  Check, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Truck
} from 'lucide-react';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const { addToast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    addToast('Order ID copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(''), 2000);
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'PLACED') return order.status === 'PLACED';
    if (filterStatus === 'PENDING') return order.status === 'PENDING_PAYMENT';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              My Orders
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track, view receipts, and manage your recent purchases.
            </p>
          </div>

          {/* Status Filter Tabs */}
          {orders.length > 0 && (
            <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl shadow-xs self-start sm:self-auto">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                  filterStatus === 'ALL'
                    ? 'gradient-brand text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({orders.length})
              </button>
              <button
                onClick={() => setFilterStatus('PLACED')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                  filterStatus === 'PLACED'
                    ? 'gradient-brand text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setFilterStatus('PENDING')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                  filterStatus === 'PENDING'
                    ? 'gradient-brand text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div className="py-24 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-slate-600 font-semibold text-sm">Loading your orders...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-rose-50 text-rose-700 p-6 rounded-2xl text-center mb-8 border border-rose-200 max-w-md mx-auto">
            <p className="font-semibold text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-xs font-bold underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty Orders State */}
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-20 px-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-xl mx-auto">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 mb-6 shadow-sm">
              <Package className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">No orders placed yet</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">
              When you purchase items via our Razorpay checkout, you'll see your order tracking and invoices right here.
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

        {/* Orders List */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const isPlaced = order.status === 'PLACED';
              const isPending = order.status === 'PENDING_PAYMENT';
              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden hover:border-slate-300 transition-all duration-200"
                >
                  {/* Order Top Bar */}
                  <div className="bg-slate-50/80 border-b border-slate-200/80 p-5 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</span>
                          <button
                            onClick={() => handleCopyId(order._id)}
                            className="text-slate-400 hover:text-slate-700 transition"
                            title="Copy Order ID"
                          >
                            {copiedId === order._id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="font-mono text-xs font-semibold text-slate-900">{order._id}</p>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date Placed</span>
                        <p className="text-xs sm:text-sm font-semibold text-slate-900">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Grand Total</span>
                        <p className="text-lg font-black text-indigo-600">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          isPlaced
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isPending
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isPlaced ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {isPlaced ? 'Payment Verified' : order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items list in order */}
                  <div className="p-5 sm:p-8 space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-4 py-2 border-b border-slate-100 last:border-b-0">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 p-1 flex-shrink-0 flex items-center justify-center">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                            ) : (
                              <Package className="w-6 h-6 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm sm:text-base">{item.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Qty: <strong className="text-slate-700">{item.quantity}</strong> × ₹{item.price.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        <div className="text-right font-extrabold text-slate-900 text-sm sm:text-base">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer & Link to Details */}
                  <div className="bg-slate-50/60 p-4 sm:px-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <span>Insured Express Shipping via ShopKart Logistics</span>
                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition"
                    >
                      <span>View Full Order Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Orders;
