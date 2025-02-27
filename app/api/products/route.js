import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/productSchema';
import { auth } from '@clerk/nextjs/server';

// GET all products
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST create a new product
export async function POST(request) {
  try {
    const { userId } = auth();
    
    // For debugging - log the userId
    console.log("Current user ID:", userId);
    
    // Temporarily bypass auth check for development
    // Remove this bypass in production!
    // if (!userId) {
    //   return NextResponse.json(
    //     { message: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    
    await dbConnect();
    const data = await request.json();
    // In the POST function, add this before creating the product:
    
    // Ensure images array is properly formatted
    if (data.imageUrl && (!data.images || !data.images.length)) {
      data.images = [data.imageUrl];
    }
    
    // Handle URL encoding if needed
    if (data.images && data.images.length > 0) {
      // Make sure URLs are properly stored
      data.images = data.images.map(url => decodeURIComponent(url));
    }
    
    console.log("Creating product with data:", data);
    const product = await Product.create(data);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: 'Failed to create product' },
      { status: 500 }
    );
  }
}