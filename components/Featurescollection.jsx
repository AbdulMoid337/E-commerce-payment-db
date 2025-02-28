"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/cartcontext";
import { toast } from "sonner";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import Loader from "@/components/Loader";

const FeaturesCollection = () => {
  const { addToCart } = useCart();
  const [activeProducts, setActiveProducts] = useState(new Set());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        // Limit the products to the first 8
        setProducts(data.slice(0, 8));
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product, event) => {
    event.preventDefault();
    addToCart(product);
    setActiveProducts(prev => new Set(prev).add(product._id));

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

  if (loading) return <Loader />;

  return (
    <>
    <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>
    <HoverEffect 
      items={products.map(product => ({
        id: product._id || product.id,
        title: product.name,
        description: product.description,
        imageUrl: product.images?.[0] || product.imageUrl,
        price: product.price,
        isAdded: activeProducts.has(product._id || product.id),
        onAddToCart: (e) => {
          handleAddToCart(product, e);
        }
      }))}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pl-20 pr-20"
    />
    </>
  );
};

export default FeaturesCollection;