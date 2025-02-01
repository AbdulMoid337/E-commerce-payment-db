'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import products from '@/data/products';
import { useCart } from '@/contexts/cartcontext';
import { toast } from 'sonner';
import { CheckCircle2, ShoppingCart, Check, X } from 'lucide-react';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart, cart } = useCart();
  const [activeProducts, setActiveProducts] = useState(new Set());

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

  const productVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3
      }
    },
    hover: { 
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
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
        <AnimatePresence>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {filteredProducts.map(product => (
              <motion.div
                key={product.id}
                variants={productVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative w-full h-64">
                  <Image 
                    src={product.imageUrl} 
                    alt={product.name} 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <motion.button 
                      onClick={(e) => handleAddToCart(product, e)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        w-auto px-4 h-10 flex items-center justify-center 
                        font-semibold rounded-xl text-sm  transition-all duration-300
                        ${activeProducts.has(product.id)
                          ? 'bg-green-500 text-white' 
                          : 'bg-black text-white hover:bg-green-600'}
                      `}
                      disabled={activeProducts.has(product.id)}
                    >
                      {activeProducts.has(product.id) ? (
                        <div className="flex items-center space-x-1">
                          <Check className="w-4 h-4" />
                          <span>Added</span>
                        </div>
                      ) : (
                        <div className="flex items-center cursor-pointer space-x-1">
                          <ShoppingCart className="w-4  h-4" />
                          <span>Add to Cart</span>
                        </div>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}