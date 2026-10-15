import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.user._id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const customer = await Customer.findById(customerId);
        if (customer.wishlist.includes(productId)) {
            return res.status(409).json({ success: false, message: "Product already in wishlist" });
        }

        customer.wishlist.push(productId);
        await customer.save();

        res.status(200).json({ success: true, message: "Product added to wishlist" });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const customerId = req.user._id;

        const customer = await Customer.findById(customerId).populate({
            path: "wishlist",
            select: "name price category image stock"
        });

        res.status(200).json({
            success: true,
            count: customer.wishlist.length,
            wishlist: customer.wishlist
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.user._id;

        const customer = await Customer.findById(customerId);

        if (!customer.wishlist.includes(productId)) {
            return res.status(404).json({ success: false, message: "Product not in wishlist" });
        }

        customer.wishlist = customer.wishlist.filter(id => id.toString() !== productId);
        await customer.save();

        res.status(200).json({ success: true, message: "Product removed from wishlist" });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const toggleWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const customerId = req.user._id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const customer = await Customer.findById(customerId);

        if (customer.wishlist.includes(productId)) {
            customer.wishlist = customer.wishlist.filter(id => id.toString() !== productId);
            await customer.save();
            return res.status(200).json({ success: true, message: "Product removed from wishlist", action: "removed" });
        } else {
            customer.wishlist.push(productId);
            await customer.save();
            return res.status(200).json({ success: true, message: "Product added to wishlist", action: "added" });
        }
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};
