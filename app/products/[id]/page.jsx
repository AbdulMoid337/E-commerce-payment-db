"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingCart, Check, X, Star, MessageCircle, MessageSquareMore, ArrowLeft, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/cartcontext";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/nextjs";

// In your product detail page, update the review functionality


// Update the component to include these functions
export default function ProductDetailPage() {
  const { isSignedIn, user } = useUser();
  const params = useParams();
  const router = useRouter();
  // Update the destructuring to include getQuantityInCart
  const { addToCart, isInCart, getQuantityInCart } = useCart();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  // Fetch product and reviews
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        setProduct(data);
        
        // Set reviews from the product data
        if (data.reviews && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    // Call the fetchProduct function
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);
  const handleAddToCart = async () => {
    if (product) {
      try {
        const productIdToUse = product._id || product.id;
        
        console.log("Adding to cart - Product:", {
          id: productIdToUse,
          quantity: quantity,
          name: product.name
        });
        
        // If user is signed in, sync with database
        if (isSignedIn) {
          const response = await fetch('/api/users/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              productId: productIdToUse,
              quantity: quantity
            }),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            console.warn('Failed to sync cart with database:', errorData.error);
            // Continue with local cart update even if server sync fails
          }
        }
        
        // Update local cart (and localStorage via context)
        addToCart({ ...product, quantity });
        
        // Show success toast
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
        
        setQuantity(1);
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error(error.message || 'Failed to add item to cart');
      }
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 100)) {
      setQuantity(value);
    }
  };
  
  const incrementQuantity = () => {
    if (quantity < (product?.stock || 100)) {
      setQuantity(prev => prev + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleGoBack = () => {
    router.back();
  };
  // Handle rating change
  const handleRatingChange = (rating) => {
    setNewReview(prev => ({ ...prev, rating }));
  };
  // Submit review
  const submitReview = async () => {
    if (newReview.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      const response = await fetch(`/api/products/${params.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: newReview.rating,
          comment: newReview.comment
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const data = await response.json();
      
      // Update reviews with the new data from server
      if (data.reviews && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      } else {
        // Fallback to local update if server doesn't return reviews
        const submittedReview = {
          id: reviews.length + 1,
          name: "Anonymous",
          rating: newReview.rating,
          comment: newReview.comment,
          date: new Date().toISOString().split('T')[0]
        };
        setReviews([...reviews, submittedReview]);
      }
      
      // Reset the form
      setNewReview({ rating: 0, comment: "" });
      toast.success("Review submitted successfully!");
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error("Failed to submit review");
    }
  };
  // Calculate average rating
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return "0.0";
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };
  if (isLoading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <button 
          onClick={handleGoBack}
          className="flex items-center mx-auto bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </button>
      </div>
    );
  }

  const imageUrl = product.images?.[0] || product.imageUrl || '/placeholder-image.jpg';

  return (
    <div className="container mx-auto pb-20 pt-40 px-4">
      <button 
        onClick={handleGoBack}
        className="flex items-center mb-6 bg-transparent hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
      </button>
      
      {/* Product Details Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex justify-center items-center">
          <img
            src={imageUrl}
            alt={product.name}
            className="object-contain max-h-[400px] w-auto"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="mb-4">
            <span className="text-xl font-semibold text-green-600">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="mb-4">
            <span className="font-medium">Category:</span>{" "}
            {product.category}
          </div>

          <div className="mb-4">
            <span className="font-medium">Rating:</span>{" "}
            {product.rating} / 5
          </div>

          <div className="mb-4">
            <span className="font-medium">Availability:</span>{" "}
            <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
              {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
            </span>
          </div>

       
          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              w-auto px-4 h-10 flex items-center justify-center 
              font-semibold rounded-xl text-sm transition-all duration-300
              ${product && isInCart(product._id || product.id)
                ? 'bg-green-500 text-white' 
                : 'bg-black text-white hover:bg-gray-800'}
            `}
            disabled={!product || product.stock <= 0}
          >
            {product && isInCart(product._id || product.id) ? (
              <div className="flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Added to cart</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </div>
            )}
          </motion.button>
        </div>
      </div>

      {/* User Feedback Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <MessageCircle className="mr-3" /> Customer Reviews
        </h2>

        {/* Overall Rating */}
        <div className="bg-gray-100 p-6 rounded-lg mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Star className="text-yellow-500 w-8 h-8 mr-3" />
            <div>
              <p className="text-3xl font-bold">{calculateAverageRating()}</p>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
          <div className="text-gray-600">
            {reviews.length} total reviews
          </div>
        </div>

        {/* Existing Reviews or No Reviews Placeholder */}
        {reviews.length > 0 ? (
          <div className="space-y-4 mb-8">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-500 w-4 h-4" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <p className="font-semibold">User</p>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <MessageSquareMore className="mx-auto mb-4 w-16 h-16 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No Reviews Yet</h3>
            <p className="text-gray-600 mb-4">Be the first to share your experience with this product!</p>
          </div>
        )}

        {/* Add Review Form */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
          <div className="flex items-center mb-4">
            <span className="mr-4">Your Rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`w-6 h-6 cursor-pointer ${
                    newReview.rating >= star 
                      ? 'text-yellow-500' 
                      : 'text-gray-300'
                  }`}
                  onClick={() => handleRatingChange(star)}
                />
              ))}
            </div>
          </div>
          <textarea
            className="w-full p-3 border bg-white text-black border-gray-300 rounded-lg mb-4"
            rows="4"
            placeholder="Write your review here..."
            value={newReview.comment}
            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
          />
          <motion.button
            onClick={submitReview}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Submit Review
          </motion.button>
        </div>
      </div>
    </div>
  );
}