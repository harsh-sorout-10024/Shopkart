import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';

function ProductCard({ product, initialWishlistState = false }) {
  const { _id, name, price, category, image, stock, description } = product;

  const [isWishlisted, setIsWishlisted] = useState(initialWishlistState);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const { cartItems, addToCart } = useCart();
  const { addToast } = useToast();

  const cartItem = cartItems.find((item) => item.product?._id === _id);
  const inCart = !!cartItem;
  const cartQuantity = cartItem?.quantity || 0;

  // Calculate simulated MRP for discount badge (price + 25%)
  const originalPrice = Math.round(price * 1.25);
  const discountPercent = 20;

  useEffect(() => {
    setIsWishlisted(initialWishlistState);
  }, [initialWishlistState]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaving) return;

    setIsSaving(true);
    try {
      const response = await api.patch(`/wishlist/${_id}/toggle`);
      if (response.data.success) {
        const added = response.data.action === 'added';
        setIsWishlisted(added);
        addToast(
          added ? `Added "${name}" to your wishlist!` : `Removed from wishlist`,
          'success'
        );
        window.dispatchEvent(new Event('wishlist-updated'));
      }
    } catch (error) {
      console.error('Wishlist toggle failed:', error);
      addToast('Could not update wishlist. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding || stock < 1 || (inCart && cartQuantity >= stock)) return;

    setIsAdding(true);
    const result = await addToCart(_id);
    if (result.success) {
      setJustAdded(true);
      addToast(`Added "${name}" to your cart!`, 'success');
      setTimeout(() => setJustAdded(false), 1800);
    } else {
      addToast(result.message || 'Unable to add to cart.', 'error');
    }
    setIsAdding(false);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Product Image & Badges */}
      <Link to={`/products/${_id}`} className="relative block h-52 sm:h-56 w-full bg-slate-100 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=600&auto=format&fit=crop';
          }}
          loading="lazy"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-800 shadow-xs">
          {category}
        </div>

        {/* Discount Badge */}
        <div className="absolute bottom-3 left-3 bg-emerald-600/90 text-white backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-bold shadow-xs">
          {discountPercent}% OFF
        </div>

        {/* Floating Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={isSaving}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-sm transition-all duration-200 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 scale-105'
              : 'bg-white/85 text-slate-500 hover:text-rose-600 hover:bg-white hover:scale-110'
          }`}
          aria-label="Wishlist toggle"
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 ${
              isWishlisted ? 'fill-rose-500 text-rose-500 animate-pulse' : ''
            }`}
          />
        </button>
      </Link>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Rating and Stock */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>4.8</span>
            <span className="text-slate-400 font-normal">(48)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            ></span>
            <span
              className={`text-xs font-medium ${
                stock > 0 ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {stock > 0 ? `${stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>

        {/* Product Title */}
        <Link to={`/products/${_id}`} className="block">
          <h3
            className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors"
            title={name}
          >
            {name}
          </h3>
        </Link>

        {/* Short description preview */}
        {description && (
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {description}
          </p>
        )}

        {/* Price & MRP */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            ₹{price.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-400 line-through">
            ₹{originalPrice.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <Link
            to={`/products/${_id}`}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition flex items-center justify-center shrink-0"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || stock < 1 || (inCart && cartQuantity >= stock)}
            className={`flex-grow py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs ${
              stock < 1
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : inCart && cartQuantity >= stock
                ? 'bg-amber-100 text-amber-800 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white'
                : inCart
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                : 'gradient-brand text-white hover:opacity-95 active:scale-[0.98]'
            }`}
          >
            {isAdding ? (
              <span className="inline-block w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
            ) : justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added!</span>
              </>
            ) : stock < 1 ? (
              <span>Out of Stock</span>
            ) : inCart ? (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>In Cart ({cartQuantity}) +</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
