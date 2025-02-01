"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/contexts/cartcontext";
import { CheckCircle2, ShoppingCart, Check, X } from "lucide-react";
import { toast } from "sonner";
import products from "@/data/products";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const FeaturesCollection = () => {
  const { addToCart, cart } = useCart();
  const [activeProducts, setActiveProducts] = useState(new Set());

  const handleAddToCart = (product, event) => {
    // Prevent link navigation
    event.preventDefault();
    
    // Add to cart
    addToCart(product);

    // Add product to active products
    setActiveProducts(prev => new Set(prev).add(product.id));

    // Show toast notification
    toast.custom((t) => (
      <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-4">
        <CheckCircle2 className="w-6 h-6" />
        <div>
          <p className="font-semibold">{product.name} added to cart</p>
          <p className="text-sm opacity-80">Your item is ready for checkout</p>
        </div>
        <button 
          onClick={() => toast.dismiss(t.id)}
          className="ml-auto hover:bg-green-600 p-2 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ), { 
      duration: 3000,
      position: 'top-right'
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-5xl font-extrabold text-center text-black mb-16"
        >
          Featured Collection
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
              whileInView
              viewport={{ once: true }}
              className="relative bg-white shadow-lg rounded-2xl p-8 transform transition-all"
            >
              <Link
                href={`/product/${product.id}`}
                className="block relative w-full h-full"
                prefetch={false}
              >
                {/* Product Image */}
                <div className="relative w-full h-64 overflow-hidden rounded-2xl group">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Product Info */}
                <div className="mt-8 text-center">
                  <h3 className="text-3xl font-bold text-black mb-4">{product.name}</h3>
                  <p className="text-gray-600 text-lg mb-6 line-clamp-2">{product.description}</p>

                  {/* Pricing */}
                  <div className="flex justify-center items-center mb-8">
                    <span className="text-black font-bold text-2xl">
                      ₹{product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="flex justify-center">
                    <motion.button 
                      onClick={(e) => handleAddToCart(product, e)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        w-auto px-4 h-10 flex items-center justify-center 
                        font-semibold rounded-xl text-sm transition-all duration-300
                        ${activeProducts.has(product.id)
                          ? 'bg-green-500 text-white' 
                          : 'bg-black text-white hover:bg-gray-800'}
                      `}
                      disabled={activeProducts.has(product.id)}
                    >
                      {activeProducts.has(product.id) ? (
                        <div className="flex items-center space-x-1">
                          <Check className="w-4 h-4" />
                          <span>Added</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </div>
                      )}
                    </motion.button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesCollection;