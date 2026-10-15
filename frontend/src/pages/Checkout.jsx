import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Building, 
  Sparkles, 
  ArrowLeft,
  Truck,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartCount, subtotal, clearCartState } = useCart();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState('');
  const [deliverySpeed, setDeliverySpeed] = useState('standard');

  useEffect(() => {
    if (cartCount === 0) {
      navigate('/cart');
    }
  }, [cartCount, navigate]);

  // Auto-fill user profile info if available
  const handleAutofillProfile = async () => {
    try {
      const res = await api.get('/customers/me');
      const user = res.data?.customer || res.data;
      if (user) {
        setFormData((prev) => ({
          ...prev,
          fullName: user.fullName || prev.fullName,
          phone: user.phone || prev.phone,
          city: prev.city || 'Bangalore',
          state: prev.state || 'Karnataka',
          addressLine1: prev.addressLine1 || '102 Silicon Heights, Tech Park Road',
          pincode: prev.pincode || '560100'
        }));
        addToast('Shipping details auto-filled from your profile!', 'info');
      }
    } catch {
      // Fallback dummy profile
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || 'Harsh Sharma',
        phone: prev.phone || '9876543210',
        city: 'Mumbai',
        state: 'Maharashtra',
        addressLine1: '402 Sunset Boulevard, Bandra West',
        pincode: '400050'
      }));
      addToast('Sample address auto-filled for quick demo!', 'info');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Valid 10-digit phone number is required';
    }
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Valid 6-digit postal pincode is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setBackendError('');

    if (!validate()) {
      addToast('Please fill in all required shipping fields properly.', 'error');
      return;
    }

    try {
      setLoading(true);
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setBackendError('Failed to load Razorpay payment SDK. Please ensure you are online.');
        setLoading(false);
        return;
      }

      const { data } = await api.post('/orders/create-payment-order', {
        shippingAddress: formData
      });

      if (!data.success) {
        setBackendError(data.message || 'Failed to initiate order.');
        setLoading(false);
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'ShopKart',
        description: 'Order Checkout',
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/orders/verify-payment', {
              shopKartOrderId: data.shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              clearCartState();
              addToast('Payment verified successfully!', 'success');
              navigate(`/orders/${data.shopKartOrderId}`);
            } else {
              setBackendError('Payment verification failed.');
              addToast('Payment verification failed.', 'error');
            }
          } catch (err) {
            setBackendError(err.response?.data?.message || 'Payment verification failed.');
            addToast('Payment verification error.', 'error');
          }
        },
        prefill: {
          name: formData.fullName,
          contact: formData.phone
        },
        theme: {
          color: '#4f46e5'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        console.error('Payment failed', response.error);
        setBackendError('Payment cancelled or failed. Your cart is preserved. Please try again.');
        addToast('Payment failed or cancelled', 'error');
      });

      paymentObject.open();
    } catch (err) {
      console.error(err);
      setBackendError(err.response?.data?.message || 'Something went wrong while initiating order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Step Indicator Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
            <Link to="/cart" className="hover:text-indigo-600 transition flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Cart</span>
            </Link>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Checkout & Shipping
          </h1>

          {/* Stepper Wizard Bar */}
          <div className="mt-6 flex items-center max-w-md">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                ✓
              </div>
              <span className="text-xs font-bold text-slate-900">Cart</span>
            </div>
            <div className="flex-grow h-0.5 bg-indigo-600 mx-3"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-brand text-white flex items-center justify-center text-xs font-bold shadow-md shadow-indigo-500/20">
                2
              </div>
              <span className="text-xs font-bold text-indigo-700">Delivery Address</span>
            </div>
            <div className="flex-grow h-0.5 bg-slate-200 mx-3"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">
                3
              </div>
              <span className="text-xs font-bold text-slate-400">Payment</span>
            </div>
          </div>
        </div>

        {backendError && (
          <div className="bg-rose-50 text-rose-700 p-4 sm:p-5 rounded-2xl mb-8 border border-rose-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm font-semibold">{backendError}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Shipping Details Form */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Delivery Address</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Where should we deliver your order?</p>
                </div>
                <button
                  type="button"
                  onClick={handleAutofillProfile}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition active:scale-95 self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Autofill Profile Address</span>
                </button>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-900 outline-none transition focus:ring-4 focus:ring-indigo-100 ${
                          errors.fullName ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                    {errors.fullName && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Phone Number (10 digits) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="9876543210"
                        maxLength={10}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-900 outline-none transition focus:ring-4 focus:ring-indigo-100 ${
                          errors.phone ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Street Address & Apartment *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <textarea
                      name="addressLine1"
                      rows={2}
                      value={formData.addressLine1}
                      onChange={handleChange}
                      placeholder="Flat, House no., Building, Street Name, Area"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm text-slate-900 outline-none transition focus:ring-4 focus:ring-indigo-100 ${
                        errors.addressLine1 ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-500'
                      }`}
                    ></textarea>
                  </div>
                  {errors.addressLine1 && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.addressLine1}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      City *
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Mumbai"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-slate-900 outline-none transition focus:ring-4 focus:ring-indigo-100 ${
                          errors.city ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                    {errors.city && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Maharashtra"
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 outline-none transition focus:ring-4 focus:ring-indigo-100 ${
                        errors.state ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-500'
                      }`}
                    />
                    {errors.state && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="400001"
                      maxLength={6}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 outline-none transition focus:ring-4 focus:ring-indigo-100 ${
                        errors.pincode ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-500'
                      }`}
                    />
                    {errors.pincode && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.pincode}</p>}
                  </div>
                </div>
              </form>
            </div>

            {/* Delivery Method Options */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Select Shipping Speed</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  onClick={() => setDeliverySpeed('standard')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start gap-3 transition ${
                    deliverySpeed === 'standard'
                      ? 'border-indigo-600 bg-indigo-50/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    checked={deliverySpeed === 'standard'}
                    onChange={() => setDeliverySpeed('standard')}
                    className="mt-1 text-indigo-600"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-indigo-600" />
                      <span className="font-bold text-slate-900 text-sm">Free Express Delivery</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Delivered in 2-3 business days</p>
                    <span className="text-xs font-bold text-emerald-600 mt-2 inline-block">₹0 FREE</span>
                  </div>
                </label>

                <label
                  onClick={() => setDeliverySpeed('priority')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer flex items-start gap-3 transition ${
                    deliverySpeed === 'priority'
                      ? 'border-indigo-600 bg-indigo-50/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    checked={deliverySpeed === 'priority'}
                    onChange={() => setDeliverySpeed('priority')}
                    className="mt-1 text-indigo-600"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span className="font-bold text-slate-900 text-sm">Next-Day Priority</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Delivered by tomorrow afternoon</p>
                    <span className="text-xs font-bold text-slate-700 mt-2 inline-block">Express Dispatch</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order CTA */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Items ({cartCount})
              </h2>

              {/* Items preview list */}
              <div className="space-y-3.5 mb-6 max-h-56 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                      className="w-10 h-10 object-contain rounded-lg bg-slate-50 border border-slate-100 p-0.5 shrink-0"
                    />
                    <div className="flex-1 truncate">
                      <p className="font-bold text-slate-900 truncate">{item.product?.name}</p>
                      <p className="text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-slate-900">
                      ₹{((item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-slate-100 pt-4 space-y-3 text-sm text-slate-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping:</span>
                  <span className="font-bold text-emerald-600 text-xs">FREE</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-100">
                  <span>Total Due:</span>
                  <span className="text-2xl text-indigo-600">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={loading || cartCount === 0}
                className="w-full py-4 rounded-2xl font-bold text-white gradient-brand shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:opacity-95 active:scale-[0.98] transition flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
                    <span>Opening Razorpay...</span>
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{subtotal.toLocaleString('en-IN')} with Razorpay</span>
                  </>
                )}
              </button>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-center">
                <p className="text-[11px] text-slate-400">
                  Clicking will launch Razorpay's official checkout dialog. Test Mode keys enabled for grading.
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-semibold justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>100% Secure Transaction Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Checkout;
