"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { ShoppingCart, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';
import { Button } from "./ui/button";
import { useCart } from "@/contexts/cartcontext";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [flyingItem, setFlyingItem] = useState(null);
  const { scrollYProgress } = useScroll();
  const { cart, calculateTotal, getTotalItems, isInCart, addItemToCart } = useCart();
  const pathname = usePathname();
  const cartIconRef = useRef(null);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Cart", path: "/cart" },
    { name: "Orders", path: "/orders" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  const triggerFlyingCartAnimation = (product) => {
    setFlyingItem(product);
    setTimeout(() => {
      setFlyingItem(null);
    }, 1000);
  };

  return (
    <>
      <motion.div 
        style={{ 
          scaleX: scrollYProgress,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '7px',
          backgroundColor: 'transparent',
          transformOrigin: 'left',
          zIndex: 100
        }}
      >
        <div 
          style={{ 
            height: '100%', 
            background: 'linear-gradient(to right, #A97CF8, #F38CB8, #FDCC92)',
            width: '100%',
            transformOrigin: 'left'
          }} 
        />
      </motion.div>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-md z-50"
      >
        <div className="container mx-auto px-6 lg:px-12 py-4 flex justify-between items-center">
        
          {/* Logo */}
          <Link href="/">
            <motion.h1 
              whileHover={{ scale: 1.1 }}
              className="text-2xl font-extrabold text-blue-600 cursor-pointer"
            >
              ShopWave
            </motion.h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2 text-gray-800 font-semibold bg-black rounded-full p-2 relative overflow-hidden">
            {navItems.map((item) => (
              <motion.div 
                key={item.path}
                className="relative z-10"
                onClick={() => {}}
              >
                <Link href={item.path}>
                  <motion.button
                    layout
                    whileTap={{ scale: 0.95 }}
                    className={`
                      px-4 py-2 rounded-full text-xs font-medium transition-colors z-20 relative
                      ${pathname === item.path 
                        ? 'text-white' 
                        : 'text-gray-300 hover:text-white'}
                    `}
                  >
                    {item.name}
                    <AnimatePresence>
                      {pathname === item.path && (
                        <motion.div
                          layoutId="nav-background"
                          className="absolute inset-0 bg-blue-500 rounded-full -z-10"
                          initial={{ 
                            opacity: 0,
                            scale: 0.5
                          }}
                          animate={{ 
                            opacity: 1,
                            scale: 1
                          }}
                          exit={{ 
                            opacity: 0,
                            scale: 0.5
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <motion.div 
              ref={cartIconRef}
              whileHover={{ scale: 1.2 }}
              className="relative"
            >
              <Link href="/cart">
                <ShoppingCart className="w-6 h-6 text-gray-800 hover:text-blue-500" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                   { cart.length }
                </span>
              </Link>
            </motion.div>

            {/* Flying Cart Animation */}
            <AnimatePresence>
              {flyingItem && (
                <motion.div
                  initial={{ 
                    position: 'fixed', 
                    top: '50%', 
                    left: '50%', 
                    scale: 1,
                    opacity: 1 
                  }}
                  animate={{ 
                    top: cartIconRef.current ? 
                      cartIconRef.current.getBoundingClientRect().top : 0,
                    left: cartIconRef.current ? 
                      cartIconRef.current.getBoundingClientRect().left : 0,
                    scale: 0.2,
                    opacity: 0
                  }}
                  transition={{ 
                    duration: 0.8, 
                    type: "spring", 
                    stiffness: 200 
                  }}
                  exit={{ opacity: 0 }}
                  className="fixed z-50 bg-blue-500 text-white p-2 rounded-full"
                >
                  <ShoppingCart className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Clerk Authentication Buttons */}
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button>Sign In</Button>
              </SignInButton>
            </SignedOut>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              onBlur={() => setIsOpen(false)}
              className="md:hidden"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-md absolute top-full left-0 w-full flex flex-col items-center py-4 space-y-4"
          >
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path} 
                className="text-gray-800 text-lg font-semibold hover:text-blue-500"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </motion.header>
    </>
  );
}
