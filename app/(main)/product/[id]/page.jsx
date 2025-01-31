"use client";

import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cartcontext";
import products from "@/data/products";

export default function ProductDetailPage({ params }) {
  const { addToCart } = useCart();
  const paramsData = React.use(params); // Unwrap the promise with React.use()
  const productId = parseInt(paramsData.id, 10);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto pt-36 px-4 py-8">
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

          <Button
            onClick={() => addToCart(product)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}