"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]); 
  const searchRef = useRef(null);
  const router = useRouter();

  const placeholders = [
    "Search for products...",
    "Find electronics...",
    "What are you looking for?",
    "Explore our collection...",
    "Search by product name..."
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(true);

    // Filter products based on search query
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (filteredProducts.length > 0) {
      // Navigate to the first matching product or search results page
      router.push(`/products/${filteredProducts[0]._id || filteredProducts[0].id}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");       
    setShowSuggestions(false);
    setFilteredProducts([]);
  };

  // Debounce search to improve performance
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Additional search logic if needed
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="relative w-full pt-28 max-w-2xl mx-auto px-4">
      <div className="relative w-full"> 
        <PlaceholdersAndVanishInput 
          placeholders={placeholders} 
          onChange={handleChange} 
          onSubmit={onSubmit} 
          className="w-full"
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && searchQuery && (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.slice(0, 5).map((product) => (
                  <div 
                    key={product._id || product.id}
                    onClick={() => router.push(`/products/${product._id || product.id}`)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  >
                    <img 
                      src={product.images?.[0] || product.imageUrl} 
                      alt={product.name} 
                      className="w-10 h-10 mr-3 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{product.name}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No products found</div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Search;
