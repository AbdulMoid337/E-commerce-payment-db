import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/productSchema';
import mongoose from 'mongoose';

export async function POST(request, context) {
  try {
    // Get the authenticated user's ID from Clerk
    const { userId } = auth();
    
    // For development, use a valid ObjectId placeholder if no user is authenticated
    const placeholderObjectId = '507f1f77bcf86cd799439011';
    const reviewerId = userId || placeholderObjectId;

    await dbConnect();
    
    // Get the id from params correctly
    const { id } = context.params;
    const { rating, comment } = await request.json();
    
    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Find the product
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // Add the review with a valid ObjectId
    product.reviews.push({
      user: new mongoose.Types.ObjectId(reviewerId),
      rating,
      comment,
      createdAt: new Date()
    });

    // Save the updated product
    await product.save();

    return NextResponse.json({ 
      message: 'Review added successfully',
      reviews: product.reviews
    });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json(
      { message: 'Failed to add review' },
      { status: 500 }
    );
  }
}