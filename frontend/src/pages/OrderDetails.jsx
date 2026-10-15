import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Printer, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  MapPin, 
  Copy, 
  Check, 
  PackageCheck,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        if (data.success) {
          setOrder(data.order);

          // Fire celebratory confetti for successful orders
          if (data.order?.status === 'PLACED') {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const handleCopyId = (orderId) => {
    navigator.clipboard.writeText(orderId);
    setCopiedId(orderId);
    addToast('Order ID copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(''), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-20">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mb-4"></div>
            <p className="text-slate-600 font-semibold text-sm">Loading order receipt...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-xs border border-slate-200 text-center max-w-md w-full">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
              <PackageCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Order Not Found</h2>
            <p className="text-slate-500 text-sm mb-6">{error || 'Could not find the requested order.'}</p>
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white gradient-brand shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Orders</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isPlaced = order.status === 'PLACED';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Navigation & Print Actions */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Orders</span>
          </Link>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Invoice</span>
          </button>
        </div>

        {/* Main Order Receipt Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-black tracking-tight">Order Placed Successfully!</h1>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
                    Thank you! Your payment was verified and your items are being prepared.
                  </p>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30 text-right self-end sm:self-auto">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-100 block">Status</span>
                <span className="font-extrabold text-sm">{order.status}</span>
              </div>
            </div>
          </div>

          {/* Delivery Stepper Tracker */}
          <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
              Delivery Progress
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-500/20 mb-2">
                  ✓
                </div>
                <h4 className="text-xs font-bold text-slate-900">Order Placed</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(order.createdAt)}</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-500/20 mb-2">
                  ✓
                </div>
                <h4 className="text-xs font-bold text-slate-900">Payment Confirmed</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Razorpay Instant</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full gradient-brand text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20 mb-2 animate-pulse">
                  3
                </div>
                <h4 className="text-xs font-bold text-indigo-700">Dispatch Processing</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Within 24 Hours</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm mb-2">
                  4
                </div>
                <h4 className="text-xs font-bold text-slate-400">Delivered</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Estimated 48 Hours</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Order & Address Dual Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Metadata Card */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <CreditCard className="w-4 h-4" />
                  <span>Transaction Overview</span>
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Order ID:</span>
                    <div className="flex items-center gap-1.5 font-mono font-semibold text-slate-900">
                      <span>{order._id}</span>
                      <button
                        onClick={() => handleCopyId(order._id)}
                        className="text-slate-400 hover:text-slate-700"
                        title="Copy Order ID"
                      >
                        {copiedId === order._id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Date & Time:</span>
                    <span className="font-semibold text-slate-900">{formatDate(order.createdAt)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Payment Status:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-xs">
                      {order.paymentStatus || 'PAID'}
                    </span>
                  </div>

                  {order.razorpayPaymentId && (
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                      <span className="text-slate-500">Razorpay Txn ID:</span>
                      <span className="font-mono text-xs font-semibold text-indigo-700 truncate max-w-[180px]">
                        {order.razorpayPaymentId}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address Card */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>Delivery Address</span>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 space-y-1">
                  <p className="font-bold text-slate-900 text-sm">{order.shippingAddress?.fullName}</p>
                  <p className="text-slate-600">{order.shippingAddress?.addressLine1}</p>
                  <p className="text-slate-600">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} - <strong className="text-slate-900">{order.shippingAddress?.pincode}</strong>
                  </p>
                  <p className="text-slate-500 pt-1">
                    Phone: <span className="font-semibold text-slate-900">{order.shippingAddress?.phone}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Itemized Order Table */}
            <div>
              <h3 className="text-base font-extrabold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                Purchased Items ({order.items?.length || 0})
              </h3>

              <div className="divide-y divide-slate-100">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 p-1 flex-shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        ) : (
                          <ShoppingBag className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm sm:text-base">{item.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Qty: <strong className="text-slate-800">{item.quantity}</strong> × ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-black text-slate-900 text-base sm:text-lg">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Payment recorded via official Razorpay test gateway with authentic signature verification.</span>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Amount Paid</span>
                <span className="text-2xl sm:text-3xl font-black text-indigo-600">
                  ₹{order.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white gradient-brand shadow-md shadow-indigo-500/20 hover:opacity-95 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default OrderDetails;
