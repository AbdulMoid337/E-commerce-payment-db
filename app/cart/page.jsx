"use client"

import { useCart } from '@/context/cartcontext';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, X, CheckCircle2 } from 'lucide-react';
import { toast } from "sonner";
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CartPage() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    calculateTotal,
    clearCart 
  } = useCart();
  
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleRemoveFromCart = (item) => {
    // Extract the product ID correctly, handling all possible formats
    const productId = item.productId?._id || item.productId || item._id || item.id;
    
    console.log("Removing item with ID:", productId, "Item data:", JSON.stringify(item));
    
    if (!productId) {
      console.error("Cannot remove item: Unable to determine product ID", item);
      toast.error("Unable to remove item from cart");
      return;
    }
    
    // Remove from local storage (via context)
    removeFromCart(productId);
    
    // Show toast notification
    toast.custom((t) => (
      <div className="bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-4">
        <Trash2 className="w-6 h-6" />
        <div>
          <p className="font-semibold">{item.name} removed from cart</p>
          <p className="text-sm opacity-80">Item has been deleted</p>
        </div>
        <button 
          onClick={() => toast.dismiss(t.id)}
          className="ml-auto hover:bg-red-600 p-2 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ), { 
      duration: 3000,
      position: 'top-right'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      
      // Validate cart
      if (!cart || cart.length === 0) {
        toast.error("Your cart is empty");
        setIsCheckingOut(false);
        return;
      }
      
      // Prepare items for checkout
      const items = cart.map(item => ({
        id: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.imageUrl || item.images?.[0] || ""
      }));
      
      // Call checkout API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          shippingInfo
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Checkout failed');
      }
      
      const data = await response.json();
      
      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to process checkout');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {cart.length > 0 ? (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item._id || item.id} className="flex flex-col sm:flex-row border-b pb-4">
                  <div className="flex-shrink-0 w-full sm:w-24 h-24 mb-4 sm:mb-0 relative">
                    {item.imageUrl || item.images?.[0] ? (
                      <img
                        src={item.imageUrl || item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow px-4">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description || "No description available"}
                    </p>
                    <div className="flex items-center mt-2">
                      <button 
                        onClick={() => updateQuantity(item._id || item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="mx-2 w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end justify-between">
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                    <button 
                      onClick={() => handleRemoveFromCart(item)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Link href="/shop">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your order before checkout</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                
                {cart.length > 0 && (
                  <>
                    <div className="border-t pt-4 mt-4">
                      <h3 className="font-medium mb-2">Shipping Information</h3>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={shippingInfo.name} 
                            onChange={handleInputChange} 
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={shippingInfo.email} 
                            onChange={handleInputChange} 
                            placeholder="john@example.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Input 
                            id="address" 
                            name="address" 
                            value={shippingInfo.address} 
                            onChange={handleInputChange} 
                            placeholder="123 Main St"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input 
                              id="city" 
                              name="city" 
                              value={shippingInfo.city} 
                              onChange={handleInputChange} 
                              placeholder="New York"
                            />
                          </div>
                          <div>
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input 
                              id="postalCode" 
                              name="postalCode" 
                              value={shippingInfo.postalCode} 
                              onChange={handleInputChange} 
                              placeholder="10001"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input 
                            id="country" 
                            name="country" 
                            value={shippingInfo.country} 
                            onChange={handleInputChange} 
                            placeholder="United States"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={handleCheckout}
                      disabled={isCheckingOut || cart.length === 0}
                    >
                      {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
