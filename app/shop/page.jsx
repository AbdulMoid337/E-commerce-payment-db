'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import products from '@/data/products';
import { useCart } from '@/context/cartcontext';
import { toast } from 'sonner';
import { CheckCircle2, ShoppingCart, Check, X } from 'lucide-react';
import { HoverEffect, Card, CardTitle, CardDescription } from '@/components/ui/card-hover-effect';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart, cart } = useCart();
  const [activeProducts, setActiveProducts] = useState(new Set());
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const categories = ['All', 'Electronics', 'Fashion', 'Sports', 'Home'];

  const filteredProducts = selectedCategory.toLowerCase() === 'all' 
    ? products 
    : products.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );

  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -50 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

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
    <motion.div 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-gray-100 pt-36 pb-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-900">
          Our Products
        </h1>

        {/* Category Filter */}
        <div className="bg-black rounded-full p-2 flex justify-center items-center space-x-2 mb-12 relative overflow-hidden w-full sm:w-[600px] mx-auto">
          {categories.map((category) => (
            <motion.div 
              key={category}
              className="relative z-10 flex-1 text-center"
              onClick={() => setSelectedCategory(category)}
            >
              <motion.button
                layout
                whileTap={{ scale: 0.95 }}
                className={`
                  px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors z-20 relative w-full
                  ${selectedCategory === category 
                    ? 'text-white' 
                    : 'text-gray-300 hover:text-white'}
                `}
              >
                {category}
                <AnimatePresence>
                  {selectedCategory === category && (
                    <motion.div
                      layoutId="category-background"
                      className="absolute inset-0 bg-blue-500 rounded-full -z-10"
                      initial={{ 
                        opacity: 0,
                        scale: 0.8
                      }}
                      animate={{ 
                        opacity: 1,
                        scale: 1
                      }}
                      exit={{ 
                        opacity: 0,
                        scale: 0.8
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 20
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Product Grid */}
        <HoverEffect 
          items={filteredProducts.map(product => ({
            id: product.id,
            title: product.name,
            description: product.description,
            imageUrl: product.imageUrl,
            price: product.price,
            isAdded: activeProducts.has(product.id),
            onAddToCart: (e) => {
              handleAddToCart(product, e);
            }
          }))}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        />
      </div>
    </motion.div>
  );
}