import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ShoppingBag, Eye, EyeOff, Lock, Mail, Phone, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState('');
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (err) setErr('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoader(true);

    if (!form.fullName || !form.email || !form.password || !form.phone) {
      setErr('All fields are required.');
      setLoader(false);
      return;
    }

    if (form.password.length < 6) {
      setErr('Password must be at least 6 characters long.');
      setLoader(false);
      return;
    }

    try {
      await api.post('/customers/register', form);
      addToast('Account created successfully! Please log in.', 'success');
      navigate('/login');
    } catch (error) {
      console.log(error);
      setErr(error.response?.data?.message || 'Registration failed. Email might already exist.');
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-3">
            <div className="h-12 w-12 rounded-2xl gradient-brand flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-black tracking-tight text-white">
              Shop<span className="text-indigo-400">Kart</span>
            </span>
          </Link>
          <p className="text-xs uppercase tracking-widest font-bold text-indigo-400">
            Join ShopKart Today
          </p>
          <h2 className="mt-3 text-2xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Enjoy customized wishlists, rapid Razorpay checkout, and live order tracking.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 py-8 px-6 sm:px-10 rounded-3xl shadow-2xl">
          {err && (
            <div className="mb-6 bg-rose-950/80 text-rose-300 border border-rose-800 p-3.5 rounded-xl text-xs font-semibold">
              {err}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/70 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/70 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/70 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Password (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-700 bg-slate-900/70 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loader}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-white gradient-brand shadow-lg shadow-indigo-600/30 hover:opacity-95 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loader ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
                    <span>Creating account...</span>
                  </span>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </div>

        {/* Security badge */}
        <div className="mt-8 text-center flex items-center justify-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Bcrypt Password Hashing & Strict HTTP-Only Security</span>
        </div>
      </div>
    </div>
  );
}

export default Register;
