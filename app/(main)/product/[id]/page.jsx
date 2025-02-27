"use client";

import React, { useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingCart, Check, X, Star, MessageCircle, MessageSquareMore } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/cartcontext";
import products from "@/data/products";

export default function ProductDetailPage({ params }) {
  const { addToCart, cart } = useCart();
  const [activeProducts, setActiveProducts] = useState(new Set());
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [reviews, setReviews] = useState([]);
  const paramsData = React.use(params);
  const productId = parseInt(paramsData.id, 10);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  const handleAddToCart = (product) => {
    addToCart(product);
    setActiveProducts(prev => new Set(prev).add(product.id));
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

  const handleRatingChange = (rating) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const submitReview = () => {
    if (newReview.rating === 0 || !newReview.comment.trim()) {
      toast.error("Please provide a rating and comment");
      return;
    }

    const submittedReview = {
      id: reviews.length + 1,
      name: "Anonymous",
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews([...reviews, submittedReview]);
    setNewReview({ rating: 0, comment: "" });
    toast.success("Review submitted successfully!");
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return "0.0";
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  return (
    <div className="container mx-auto pb-20 pt-40 px-4">
      {/* Product Details Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex justify-center items-center">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={400}
            height={400}
            className="object-contain max-h-[400px]"
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

          <motion.button
            onClick={() => handleAddToCart(product)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              w-auto px-4 h-10 flex items-center justify-center 
              font-semibold rounded-xl text-sm transition-all duration-300
              ${activeProducts.has(product.id)
                ? 'bg-green-500 text-white' 
                : 'bg-black text-white hover:bg-gray-800'}
            `}
            disabled={activeProducts.has(product.id)}
          >
            {activeProducts.has(product.id) ? (
              <div className="flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Added</span>
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
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-500 w-4 h-4" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="font-semibold">{review.name}</p>
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