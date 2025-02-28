"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckoutCancelPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="container mx-auto px-4 pt-32 pb-16 text-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Checkout Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your order has been cancelled. No charges were made to your payment method.
        </p>
        
        {orderId && (
          <p className="text-sm text-gray-500 mb-6">
            Reference: {orderId}
          </p>
        )}
        
        <div className="space-y-4">
          <Link href="/cart">
            <Button className="w-full">Return to Cart</Button>
          </Link>
          
          <Link href="/products">
            <Button variant="outline" className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}