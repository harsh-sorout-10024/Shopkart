import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await api.get('/cart');
            setCartItems(response.data.cart || []);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch cart');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async (productId) => {
        try {
            const response = await api.post(`/cart/${productId}`);
            setCartItems(response.data.cart || []);
            return { success: true };
        } catch (err) {
            console.error(err);
            return { success: false, message: err.response?.data?.message || 'Failed to add to cart' };
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const response = await api.patch(`/cart/${productId}`, { quantity });
            setCartItems(response.data.cart || []);
            return { success: true };
        } catch (err) {
            console.error(err);
            return { success: false, message: err.response?.data?.message || 'Failed to update quantity' };
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const response = await api.delete(`/cart/${productId}`);
            setCartItems(response.data.cart || []);
            return { success: true };
        } catch (err) {
            console.error(err);
            return { success: false, message: err.response?.data?.message || 'Failed to remove from cart' };
        }
    };

    const clearCartState = () => {
        setCartItems([]);
    };

    // Derived State
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cartItems.reduce((total, item) => total + ((item.product?.price || 0) * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            loading,
            error,
            fetchCart,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCartState,
            cartCount,
            subtotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
