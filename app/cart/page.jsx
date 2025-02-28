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
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRemoveFromCart = (item) => {
    removeFromCart(item.id);
    
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

  const handleCheckout = async () => {
    // Validate form
    const requiredFields = ['name', 'email', 'phone', 'street', 'city', 'state', 'zip', 'country'];
    const missingFields = requiredFields.filter(field => !shippingInfo[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setIsLoading(true);
      
      // Filter out items with invalid IDs
      const validItems = cart.filter(item => item.id);
      
      if (validItems.length === 0) {
        toast.error("No valid items in cart");
        return;
      }
      
      // Create order in your database and get checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: validItems.map(item => ({
            id: item.id,
            quantity: item.quantity || 1,
            price: item.price,
            name: item.name,
            image: item.images?.[0] || item.imageUrl
          })),
          shippingInfo
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto pt-48 px-4 pb-32 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Link href="/" className="text-blue-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        {/* Cart Items */}
        <div className="space-y-4">
          {!isCheckingOut ? (
            cart.map((item) => (
              <div 
                key={item._id || item.id} 
                className="flex items-center border-b pb-4 space-x-4"
              >
                <Image
                  src={item.images?.[0] || item.imageUrl || '/placeholder.jpg'}
                  alt={`Product image of ${item.name}`}
                  width={100}
                  height={100}
                  className="object-contain"
                />
                
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600">₹{item.price.toFixed(2)}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <span className="px-2">{item.quantity || 1}</span>
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button 
                  variant="destructive" 
                  size="icon"
                  onClick={() => handleRemoveFromCart(item)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>Enter your shipping details to complete your order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={shippingInfo.name} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={shippingInfo.email} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={shippingInfo.phone} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input 
                    id="street" 
                    name="street" 
                    value={shippingInfo.street} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      value={shippingInfo.city} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input 
                      id="state" 
                      name="state" 
                      value={shippingInfo.state} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zip">Postal/ZIP Code</Label>
                    <Input 
                      id="zip" 
                      name="zip" 
                      value={shippingInfo.zip} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country" 
                      name="country" 
                      value={shippingInfo.country} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          
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
          </div>
          
          <div className="mt-6 space-y-4">
            {!isCheckingOut ? (
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => setIsCheckingOut(true)}
              >
                Proceed to Checkout
              </Button>
            ) : (
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Pay with Stripe'}
              </Button>
            )}
            
            {isCheckingOut && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsCheckingOut(false)}
                disabled={isLoading}
              >
                Back to Cart
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={clearCart}
              disabled={isLoading}
            >
              Clear Cart
            </Button>
            
            <Link href="/products" className="block text-center text-blue-600 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}