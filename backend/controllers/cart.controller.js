import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

// Add to Cart
export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID", success: false });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        const customer = await Customer.findById(customerId);
        
        const existingCartItem = customer.cart.find(item => item.product.toString() === productId);
        
        if (existingCartItem) {
            if (existingCartItem.quantity + 1 > product.stock) {
                return res.status(400).json({ message: "Not enough stock", success: false });
            }
            existingCartItem.quantity += 1;
        } else {
            if (product.stock < 1) {
                return res.status(400).json({ message: "Product out of stock", success: false });
            }
            customer.cart.push({ product: productId, quantity: 1 });
        }

        await customer.save();

        const updatedCustomer = await Customer.findById(customerId).populate('cart.product');

        res.status(200).json({ success: true, message: "Cart updated", cart: updatedCustomer.cart });

    } catch (error) {
        res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
};

// Get Cart
export const getCart = async (req, res) => {
    try {
        const customerId = req.user._id;
        const customer = await Customer.findById(customerId).populate('cart.product');
        
        if (!customer) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        res.status(200).json({ success: true, cart: customer.cart });

    } catch (error) {
        res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
};

// Update Quantity
export const updateQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const customerId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID", success: false });
        }

        if (typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({ message: "Invalid quantity", success: false });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        if (quantity > product.stock) {
            return res.status(400).json({ message: "Not enough stock", success: false });
        }

        const customer = await Customer.findById(customerId);
        
        const existingCartItem = customer.cart.find(item => item.product.toString() === productId);
        
        if (!existingCartItem) {
            return res.status(404).json({ message: "Product not in cart", success: false });
        }

        existingCartItem.quantity = quantity;
        await customer.save();

        const updatedCustomer = await Customer.findById(customerId).populate('cart.product');

        res.status(200).json({ success: true, message: "Cart updated", cart: updatedCustomer.cart });

    } catch (error) {
        res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
};

// Remove from Cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID", success: false });
        }

        const customer = await Customer.findById(customerId);
        
        customer.cart = customer.cart.filter(item => item.product.toString() !== productId);
        
        await customer.save();

        const updatedCustomer = await Customer.findById(customerId).populate('cart.product');

        res.status(200).json({ success: true, message: "Product removed from cart", cart: updatedCustomer.cart });

    } catch (error) {
        res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
};
