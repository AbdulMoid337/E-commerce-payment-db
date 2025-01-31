import React from 'react';
import Link from 'next/link';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin 
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 md:px-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-2xl font-bold mb-4">E-Commerce Store</h3>
          <p className="text-gray-400">
            Your one-stop shop for quality products and exceptional customer experience.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-blue-500 transition">Home</Link></li>
            <li><Link href="/products" className="hover:text-blue-500 transition">Products</Link></li>
            <li><Link href="/about" className="hover:text-blue-500 transition">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-blue-500 transition">Contact</Link></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Customer Support</h4>
          <ul className="space-y-2">
            <li><Link href="/faq" className="hover:text-blue-500 transition">FAQ</Link></li>
            <li><Link href="/shipping" className="hover:text-blue-500 transition">Shipping</Link></li>
            <li><Link href="/returns" className="hover:text-blue-500 transition">Returns</Link></li>
            <li><Link href="/privacy" className="hover:text-blue-500 transition">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Newsletter & Social */}
        <div>
          <h4 className="text-xl font-semibold mb-4">Stay Connected</h4>
          <div className="mb-4">
            <p className="text-gray-400 mb-2">Subscribe to our newsletter</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-800 text-white px-3 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition"
              >
                Subscribe
              </button>
            </div>
          </div>
          
          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            <Link href="#" className="text-2xl hover:text-blue-500 transition">
              <FaFacebook />
            </Link>
            <Link href="#" className="text-2xl hover:text-blue-500 transition">
              <FaTwitter />
            </Link>
            <Link href="#" className="text-2xl hover:text-blue-500 transition">
              <FaInstagram />
            </Link>
            <Link href="#" className="text-2xl hover:text-blue-500 transition">
              <FaLinkedin />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 mt-8 pt-6 text-center">
        <p className="text-gray-400">
          {new Date().getFullYear()} E-Commerce Store. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;