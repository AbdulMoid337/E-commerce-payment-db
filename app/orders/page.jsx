"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs'; // Changed from useAuth to useUser
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OrdersPage() {
  const { isLoaded, isSignedIn, user } = useUser(); // Use useUser instead of useAuth
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("Fetching orders...");
        const response = await fetch('/api/orders');
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          throw new Error(errorData.error || 'Failed to fetch orders');
        }
        
        const data = await response.json();
        console.log("Orders fetched:", data);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && isSignedIn) {
      fetchOrders();
    } else if (isLoaded && !isSignedIn) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return <Loader color="primary" size="md" />;
  }

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
        <p className="text-gray-600 mb-8">You need to be signed in to view your orders.</p>
        <Link href="/sign-in">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-16 text-center">
        <h1 className="text-3xl font-bold mb-4">No Orders Found</h1>
        <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
        <Link href="/products">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Order #{order._id}</CardTitle>
                  <CardDescription>
                    {order.createdAt ? 
                      `Placed ${formatDistance(new Date(order.createdAt), new Date(), { addSuffix: true })}` : 
                      'Recently placed'}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Total: ₹{order.totalAmount?.toFixed(2) || '0.00'}</p>
                  <p className="text-sm text-gray-500">Status: {order.status || 'Processing'}</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={item._id || index} className="flex items-center space-x-4">
                    {item.productId && (
                      <>
                        <Image
                          src={item.productId.images?.[0] || '/placeholder.jpg'}
                          alt={item.productId.name || 'Product'}
                          width={80}
                          height={80}
                          className="object-cover rounded"
                        />
                        <div className="flex-grow">
                          <h3 className="font-semibold">{item.productId.name || 'Product'}</h3>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity || 1} × ₹{item.price?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              
              {order.address && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-2">Shipping Address</h4>
                  <p className="text-sm text-gray-600">
                    {order.address.street || ''}<br />
                    {order.address.city || ''}, {order.address.state || ''} {order.address.zip || ''}<br />
                    {order.address.country || ''}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
