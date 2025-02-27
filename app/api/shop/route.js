import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/productSchema';

// GET all products for the shop page
export async function GET(request) {
  try {
    await dbConnect();
    
    // Get URL parameters for filtering and pagination
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sort = searchParams.get('sort') || 'createdAt';
    
    // Build query
    const query = {};
    if (category) {
      query.category = category;
    }
    
    // Count total products for pagination
    const total = await Product.countDocuments(query);
    
    // Fetch products with pagination
    const products = await Product.find(query)
      .sort({ [sort]: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}