import React, { Suspense } from 'react';
import products from '@/data/products';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';

export default async function ProductDetailPage({ params }) {
  // Simulate a delay to show loading state (optional)
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Await the params object to access its properties
  const productParams = await params;
  const productId = parseInt(productParams.id, 10);

  // Find the product by ID
  const product = products.find(p => p.id === productId);

  // Handle cases where the product isn't found
  if (!product) {
    notFound(); // Use Next.js's notFound() for 404 handling
  }

  return (
    <Suspense fallback={<Loader />}>
      <div className="container mx-auto px-4 pt-36 pb-24 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="flex justify-center items-center">
            <Image 
              src={product.imageUrl} 
              alt={product.name} 
              width={400} 
              height={400} 
              className="object-contain max-w-full max-h-[400px]"
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            
            <div className="mb-4">
              <span className="text-xl font-semibold text-green-600">${product.price.toFixed(2)}</span>
            </div>

            <div className="mb-4">
              <span className="font-medium">Category:</span> {product.category}
            </div>

            <div className="mb-4">
              <span className="font-medium">Rating:</span> {product.rating} / 5
            </div>

            <Button 
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
             Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Suspense>
  );
}