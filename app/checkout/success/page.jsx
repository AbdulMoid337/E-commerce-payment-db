"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/cartcontext';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCleared, setCartCleared] = useState(false); // Add state to track if cart was cleared

  useEffect(() => {
    // Only clear cart once
    if (!cartCleared) {
      clearCart();
      setCartCleared(true); // Mark cart as cleared
    }
    
    // Fetch order details if needed
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          setOrderDetails(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching order:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [orderId, clearCart, cartCleared]); // Add cartCleared to dependencies

  return (
    <div className="container mx-auto px-4 pt-32 pb-16 text-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Order Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        
        {orderId && (
          <p className="text-sm text-gray-500 mb-6">
            Order ID: {orderId}
          </p>
        )}
        
        {loading ? (
          <p>Loading order details...</p>
        ) : orderDetails ? (
          <div className="text-left mb-6">
            <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
            <p>Total: ${orderDetails.totalAmount?.toFixed(2) || '0.00'}</p>
            <p>Status: {orderDetails.status || 'Processing'}</p>
          </div>
        ) : (
          <p className="text-gray-500 mb-6">Order details not available</p>
        )}
        
        <div className="space-y-4">
          <Link href="/account/orders">
            <Button className="w-full">View My Orders</Button>
          </Link>
          
          <Link href="/products">
            <Button variant="outline" className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}