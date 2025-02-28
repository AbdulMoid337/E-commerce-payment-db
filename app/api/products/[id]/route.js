import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/productSchema';
import { auth } from '@clerk/nextjs/server';

// GET a single product by ID
export async function GET(request, context) {
  try {
    await dbConnect();
    
    // Access the id directly from context.params
    const { id } = context.params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT update a product
export async function PUT(request, context) {
  try {
    // Temporarily bypass auth check for development
    // const { userId } = auth();
    // if (!userId) {
    //   return NextResponse.json(
    //     { message: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    
    await dbConnect();
    const { id } = context.params;
    const data = await request.json();
    
    // Ensure images array is properly formatted
    if (data.imageUrl && (!data.images || !data.images.length)) {
      data.images = [data.imageUrl];
    }
    
    console.log("Updating product with data:", data);
    
    const product = await Product.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE a product
export async function DELETE(request, context) {
  try {
    // Temporarily bypass auth check for development
    // const { userId } = auth();
    
    // if (!userId) {
    //   return NextResponse.json(
    //     { message: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    
    await dbConnect();
    const { id } = context.params;
    
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: 'Failed to delete product' },
      { status: 500 }
    );
  }
}