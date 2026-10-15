import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.model.js";

dotenv.config();

const products = [
  {
    name: "Noise Cancelling Headphones",
    description: "Premium over-ear headphones with active noise cancellation and 30-hour battery life.",
    price: 4999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
    stock: 12
  },
  {
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard with tactile blue switches for typing and gaming.",
    price: 2999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop",
    stock: 10
  },
  {
    name: "Minimalist Watch",
    description: "Elegant quartz watch with a leather strap and clean, minimalist dial design.",
    price: 1999,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=600&auto=format&fit=crop",
    stock: 5
  },
  {
    name: "Atomic Habits",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear.",
    price: 499,
    category: "Books",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop",
    stock: 25
  },
  {
    name: "Ceramic Coffee Mug",
    description: "Handcrafted 12oz ceramic coffee mug, perfect for your morning brew.",
    price: 399,
    category: "Home",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600&auto=format&fit=crop",
    stock: 18
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with adjustable DPI and long-lasting battery.",
    price: 799,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=600&auto=format&fit=crop",
    stock: 30
  }
];

mongoose.connect(process.env.dbURL, {
  tlsAllowInvalidCertificates: true
}).then(async () => {
  console.log("DB Connected for seeding.");
  try {
    await Product.deleteMany({});
    console.log("Cleared existing products.");
    
    await Product.insertMany(products);
    console.log("Successfully seeded", products.length, "products!");
  } catch (error) {
    console.error("Error seeding products:", error);
  } finally {
    mongoose.connection.close();
  }
}).catch((err) => {
  console.log("Failed to connect to DB:", err.message);
  console.log("\n⚠️ IMPORTANT: You must whitelist your IP address in MongoDB Atlas before you can connect to the database.");
  process.exit(1);
});
