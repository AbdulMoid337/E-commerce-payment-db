import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import { ShoppingCart, Check, CheckCircle2, X } from "lucide-react"
import { toast } from "sonner"
import { useCart } from "@/context/cartcontext"

export const HoverEffect = ({ items, className }) => {
  const { addToCart } = useCart()
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [activeProducts, setActiveProducts] = useState(new Set())

  const handleAddToCart = (item, event) => {
    // Prevent link navigation
    event.preventDefault();
    
    // Add to cart
    addToCart(item);

    // Add product to active products
    setActiveProducts(prev => new Set(prev).add(item.id));

    // Show toast notification
    toast.custom((t) => (
      <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-4">
        <CheckCircle2 className="w-6 h-6" />
        <div>
          <p className="font-semibold">{item.title} added to cart</p>
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
  }

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-10", className)}>
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="relative group block h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="wait">
            {hoveredIndex === idx && (
              <motion.div
                className="absolute -inset-2 bg-blue-950/20 rounded-3xl z-0"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.2 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Link 
            href={`/product/${item.id}`} 
            className="block relative w-full h-full"
            prefetch={false}
          >
            <div className="bg-white shadow-lg rounded-2xl p-6 transform transition-all h-full flex flex-col relative z-10">
              {/* Product Image */}
              <div className="relative w-full h-48 overflow-hidden rounded-2xl group mb-4">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Product Info */}
              <div className="flex-grow flex flex-col">
                <h3 className="text-2xl font-bold text-black mb-2 text-center">{item.title}</h3>
                <p className="text-gray-600 text-base mb-4 line-clamp-2 text-center flex-grow">{item.description}</p>

                {/* Pricing */}
                <div className="flex justify-center items-center mb-4">
                  <span className="text-black font-bold text-xl">
                    ₹{item.price.toFixed(2)}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <div className="flex justify-center mt-auto">
                  <motion.button 
                    onClick={(e) => handleAddToCart(item, e)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      w-auto px-4 h-9 flex items-center justify-center 
                      font-semibold rounded-xl text-xs transition-all duration-300
                      ${activeProducts.has(item.id)
                        ? 'bg-green-500 text-white' 
                        : 'bg-black text-white hover:bg-gray-800'}
                    `}
                    disabled={activeProducts.has(item.id)}
                  >
                    {activeProducts.has(item.id) ? (
                      <div className="flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Added</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <ShoppingCart className="w-3 h-3" />
                        <span>Add to Cart</span>
                      </div>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
