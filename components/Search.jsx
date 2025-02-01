"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X } from "lucide-react";
import products from "@/data/products";
import { useRouter } from "next/navigation";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  // Debounce search to improve performance
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setFilteredProducts([]);
        return;
      }

      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions

      setFilteredProducts(filtered);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (productId) => {
    router.push(`/product/${productId}`);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredProducts([]);
  };

  return (
    <div ref={searchRef} className="relative w-full pt-28 max-w-2xl mx-auto px-4">
      <div className="relative w-full"> 
        <div className="flex items-center w-full">
          <input
            className="w-full p-3 pl-10 border border-gray-300 text-gray-900 rounded-lg bg-transparent shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          <SearchIcon 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
          {searchQuery && (
            <button 
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {showSuggestions && filteredProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg"
            >
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => handleSuggestionClick(product.id)}
                  className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                >
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-12 h-12 object-cover mr-4 rounded"
                  />
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Search;
