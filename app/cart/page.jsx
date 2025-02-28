"use client"

import { useCart } from '@/context/cartcontext';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, X, CheckCircle2 } from 'lucide-react';
import { toast } from "sonner";

export default function CartPage() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    calculateTotal, 
    clearCart 
  } = useCart();

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
          {cart.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center border-b pb-4 space-x-4"
            >
              <Image
                src={item.imageUrl}
                alt={`Product image of ${item.name}`}
                width={100}
                height={100}
                className="object-contain"
              />
              
              <div className="flex-grow">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
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
          ))}
        </div>
        
        {/* Order Summary */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            
            <div className="border-t pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => alert('Checkout functionality coming soon!')}
            >
              Proceed to Checkout
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={clearCart}
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