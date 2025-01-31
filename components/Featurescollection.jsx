"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/contexts/cartcontext";
import products from "@/data/products";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const FeaturesCollection = () => {
  const { scrollY } = useScroll();
  const { addToCart } = useCart();

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
            <AnimatePresence key={product.id}>
              <motion.div
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
                  {/* Product Image with Scroll Animation */}
                  <motion.div
                    className="relative w-full h-64 overflow-hidden rounded-2xl group"
                    style={{ scale: useTransform(scrollY, [0, 1000], [1, 0.99]) }}
                  >
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={600}
                      height={600}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                      style={{ transform: `translateY(${scrollY * -0.2}px)` }}
                    />
                  </motion.div>

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
                    <motion.button 
                    onClick={() => addToCart(product)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 rounded-2xl text-lg transition-all"
                    >
                      Add to Cart
                    </motion.button>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesCollection;