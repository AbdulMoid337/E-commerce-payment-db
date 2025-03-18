"use client";

import { useState, useEffect } from "react";
import Search from "../components/Search";
import Link from "next/link";
import Image from "next/image";
import Fcollection from "../components/Fcollection";
import Featurescollection from "../components/Featurescollection";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import { MarqueeDemo as Marquee } from "../components/Marquee";
import { useCart } from "@/context/cartcontext";
import { toast } from "sonner";
import { CheckCircle2, X } from "lucide-react";

export default function Home() {
  const { addToCart } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [products, setProducts] = useState([]); // State to hold products

  // Fetch products from MongoDB
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        // Set only the first 5 products
        setProducts(data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Hide loader after 2 seconds or when data is loaded
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoaderVisible(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  // Automatically cycle through slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Calculate slide width on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSlideWidth(document.querySelector(".carousel-item")?.offsetWidth || 0);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleSwipe = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50 && currentIndex > 0) prevSlide();
    else if (diff < -50 && currentIndex < products.length - 1) nextSlide();
  };

  // Add this function to handle adding products to cart
  const handleAddToCart = (product, event) => {
    event.preventDefault();
    
    // Make sure we have complete product data
    if (product) {
      addToCart({
        ...product,
        quantity: 1
      });
      
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
    }
  };

  return (
    <>
      {/* Loader Component */}
      {loaderVisible && <Loader />}

      <Search />

      {/* Product Carousel */}
      <div className="relative w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8 mt-6 pb-20">
        <div className="relative overflow-hidden rounded-lg shadow-2xl">
          <div
            className="flex transition-transform duration-500 ease-in-out touch-pan-x"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {products.map((product, index) => (
              <div
                key={index}
                className="carousel-item w-full flex-shrink-0 relative"
              >
                <Link
                  href={`/products/${product._id || product.id}`}
                  className="block w-full cursor-pointer"
                >
                  <div className="aspect-[16/9] w-full rounded-lg overflow-hidden">
                    <Image
                      src={product.images?.[0] || product.imageUrl}
                      alt={product.name}
                      width={1920}
                      height={1080}
                      priority
                      className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </Link>

                {/* Product Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                  <h3 className="text-2xl font-bold line-clamp-1">{product.name}</h3>
                  <p className="text-sm mt-2 line-clamp-2">{product.description}</p>
                  
                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="mt-3 bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-90 transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <motion.button
            variants={{
              hidden: { opacity: 0, x: -10 },
              visible: { opacity: 1, x: 0 }
            }}
            initial="hidden"
            whileInView="visible"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/75 text-white p-4 rounded-full hover:bg-black/90 transition pointer-events-auto group"
            onClick={prevSlide}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </motion.button>

          <motion.button
            variants={{
              hidden: { opacity: 0, x: 10 },
              visible: { opacity: 1, x: 0 }
            }}
            initial="hidden"
            whileInView="visible"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/75 text-white p-4 rounded-full hover:bg-black/90 transition pointer-events-auto group"
            onClick={nextSlide}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {products.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index ? "bg-white scale-125" : "bg-gray-500"}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>

      <Featurescollection />
      <Fcollection />
      <Marquee className="mt-10 mb-10 w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8"/>
    </>
  );
}
