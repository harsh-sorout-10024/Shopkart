import Order from "../models/order.model.js";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";

export const createPaymentOrder = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { shippingAddress } = req.body;

        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
            return res.status(400).json({ success: false, message: "Invalid shipping data" });
        }

        const customer = await Customer.findById(customerId).populate('cart.product');

        if (!customer.cart || customer.cart.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of customer.cart) {
            const product = await Product.findById(item.product._id);

            if (!product) {
                return res.status(400).json({ success: false, message: "Product not found" });
            }

            if (item.quantity > product.stock) {
                return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}.` });
            }

            totalAmount += product.price * item.quantity;
            
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.image
            });
        }

        const shopKartOrder = new Order({
            user: customerId,
            items: orderItems,
            shippingAddress,
            totalAmount,
            paymentStatus: "PENDING",
            status: "PENDING_PAYMENT"
        });

        await shopKartOrder.save();

        const amountInPaise = Math.round(totalAmount * 100);

        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: shopKartOrder._id.toString()
        });

        shopKartOrder.razorpayOrderId = razorpayOrder.id;
        await shopKartOrder.save();

        res.status(200).json({
            success: true,
            shopKartOrderId: shopKartOrder._id,
            razorpayOrderId: razorpayOrder.id,
            amount: amountInPaise,
            currency: "INR",
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const customerId = req.user._id;

        const order = await Order.findById(shopKartOrderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        
        const body = order.razorpayOrderId + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        order.paymentStatus = "PAID";
        order.status = "PLACED";
        order.razorpayPaymentId = razorpay_payment_id;
        await order.save();

        const customer = await Customer.findById(customerId);
        customer.cart = [];
        await customer.save();

        res.status(200).json({ success: true, message: "Payment successful", order });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const customerId = req.user._id;
        const orders = await Order.find({ user: customerId }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const customerId = req.user._id;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.user.toString() !== customerId.toString()) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        res.status(200).json({ success: true, order });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["PENDING_PAYMENT", "PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ success: true, message: "Status updated successfully", order });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
