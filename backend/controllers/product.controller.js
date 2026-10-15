import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, stock } = req.body;

        if (!name || !description || price === undefined || !category || !image || stock === undefined) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (price <= 0) {
            return res.status(400).json({ success: false, message: "Invalid price, must be greater than 0" });
        }

        if (stock < 0) {
            return res.status(400).json({ success: false, message: "Invalid stock, cannot be negative" });
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            category,
            image,
            stock
        });

        return res.status(201).json({
            success: true,
            product: newProduct
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const { search, category, sort } = req.query;
        let query = {};

        // 1. Search Query
        if (search) {
            query.name = { $regex: search, $options: "i" }; // Case-insensitive
        }

        // 2. Category Filter
        if (category) {
            // "All Categories" is usually handled by not sending a category query, 
            // but just in case, we can ignore "All Categories"
            if (category !== "All Categories") {
                query.category = category;
            }
        }

        // 3. Sorting Bonus
        let sortConfig = {};
        if (sort === "price_asc") {
            sortConfig.price = 1;
        } else if (sort === "price_desc") {
            sortConfig.price = -1;
        } else {
            sortConfig.createdAt = -1; // Default to newest first
        }

        const products = await Product.find(query).sort(sortConfig);

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if ID is a valid MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: "Invalid product ID format" });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};
