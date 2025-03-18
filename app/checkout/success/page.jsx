"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/cartcontext';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCleared, setCartCleared] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const retryDelay = 3000; // 3 seconds delay between retries

  useEffect(() => {
    // Only clear cart once
    if (!cartCleared) {
      clearCart();
      setCartCleared(true);
    }
    
    const fetchOrderDetails = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }
      
      try {
        console.log(`Fetching order with session ID: ${sessionId} (Attempt ${retryCount + 1}/${maxRetries + 1})`);
        
        // First try to get the real order
        const response = await fetch(`/api/orders/session/${sessionId}`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Order details received:", data);
          
          // Format the order data for display
          setOrderDetails({
            _id: data._id,
            totalAmount: data.totalAmount || 0,
            status: data.status || 'processing',
            items: data.items || [],
            shippingAddress: data.shippingAddress || {},
            createdAt: data.createdAt
          });
          setError(null); // Clear any previous errors
          setLoading(false); // Always set loading to false on success
        } else {
          // If we can't get the real order, check if we should retry
          let errorMessage = 'Failed to fetch order details';
          
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            console.error('Error parsing error response:', e);
          }
          
          console.error(`Error fetching order (Attempt ${retryCount + 1}/${maxRetries + 1}):`, errorMessage);
          setError(errorMessage);
          
          // If we haven't reached max retries, schedule another attempt with delay
          if (retryCount < maxRetries) {
            console.log(`Scheduling retry in ${retryDelay}ms...`);
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, retryDelay);
          } else {
            // If we've exhausted retries, use fallback data
            console.log("Using fallback order data after exhausting retries");
            setOrderDetails({
              _id: sessionId.substring(0, 10),
              totalAmount: 0,
              status: "processing",
              message: "Your payment was successful! Your order is being processed."
            });
            setLoading(false); // Set loading to false after exhausting retries
          }
        }
      } catch (err) {
        console.error(`Error fetching order (Attempt ${retryCount + 1}/${maxRetries + 1}):`, err);
        setError(err.message || 'An error occurred');
        
        // If we haven't reached max retries, schedule another attempt with delay
        if (retryCount < maxRetries) {
          console.log(`Scheduling retry in ${retryDelay}ms...`);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, retryDelay);
        } else {
          // Still provide a fallback order after exhausting retries
          setOrderDetails({
            _id: sessionId.substring(0, 10),
            totalAmount: 0,
            status: "processing",
            message: "Your payment was successful! Your order is being processed."
          });
          setLoading(false); // Set loading to false after exhausting retries
        }
      }
    };
    
    fetchOrderDetails();
  }, [sessionId, clearCart, cartCleared, retryCount]);

  return (
    <div className="container mx-auto px-4 pt-32 pb-16 text-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Order Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        
        {orderDetails && orderDetails._id && (
          <p className="text-sm text-gray-500 mb-6">
            Order ID: {orderDetails._id}
          </p>
        )}
        
        {loading ? (
          <p>Loading order details...</p>
        ) : orderDetails ? (
          <div className="text-left mb-6">
            <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
            <p>Total: ${orderDetails.totalAmount?.toFixed(2) || '0.00'}</p>
            <p>Status: {orderDetails.status || 'Processing'}</p>
            
            {orderDetails.message && (
              <p className="text-sm text-gray-600 mt-2">{orderDetails.message}</p>
            )}
            
            {orderDetails.items && orderDetails.items.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Items</h3>
                <ul className="space-y-2">
                  {orderDetails.items.map((item, index) => {
                    const product = item.productId || {};
                    return (
                      <li key={index} className="flex justify-between">
                        <span>{product.name || item.name || 'Product'} × {item.quantity || 1}</span>
                        <span>${((product.price || item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 mb-6">
            {error ? 
              "We couldn't retrieve your order details, but your order has been confirmed." : 
              "Order details not available"}
          </p>
        )}
        
        <div className="space-y-4">
          <Link href="/orders">
            <Button className="w-full">View My Orders</Button>
          </Link>
          
          <Link href="/shop">
            <Button variant="outline" className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}