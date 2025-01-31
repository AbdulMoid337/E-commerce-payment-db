"use client";

import { useState } from "react";
import { motion , useScroll } from "framer-motion";
import { ShoppingCart, Menu, X } from "lucide-react";
import Link from "next/link";
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
  const scrollYProgress = useScroll().scrollYProgress;
  const { cart, calculateTotal, getTotalItems, isInCart } = useCart();

  return (
    <>
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
          <nav className="hidden md:flex space-x-6 text-gray-800 font-semibold">
            {["Home", "Shop", "About", "Contact"].map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.1, color: "#3b82f6" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link href={item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`} className="hover:text-blue-500">
                  {item}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <motion.div whileHover={{ scale: 1.2 }}>
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-800 hover:text-blue-500" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                   { cart.length }
                  </span>
              </Link>
            </motion.div>

            {/* Clerk Authentication Buttons */}
            <SignedIn>
              {/* Display the user button for signed-in users */}
              <UserButton />
            </SignedIn>
            <SignedOut>
              {/* Display SignIn Button for signed-out users */}
              <SignInButton>
                <Button>Sign In</Button>
              </SignInButton>
            </SignedOut>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
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
            {["Home", "Shop", "About", "Contact"].map((item, index) => (
              <Link 
                key={index} 
                href={item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`} 
                className="text-gray-800 text-lg font-semibold hover:text-blue-500"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
          </motion.div>
        )}
      </motion.header>
      <motion.div style={{ scaleX: scrollYProgress }} className="fixed origin-left bg-black h-3 w-full top-16 z-50 "></motion.div>
    </>
  );
}
