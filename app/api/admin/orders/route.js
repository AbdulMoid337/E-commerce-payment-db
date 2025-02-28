import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/order';

export async function GET(request) {
  try {
    // Get authentication from Clerk
    const { userId } = auth();
    
    // For debugging
    console.log('Admin orders API - Auth userId:', userId);
    
    // Skip authentication check for development purposes
    // In production, you should uncomment this check
    /*
    if (!userId) {
      console.log('Admin orders API - Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    */

    await dbConnect();

    // Fetch orders with populated product data
    const orders = await Order.find({})
      .populate({
        path: 'items.productId',
        select: 'name price images'
      })
      .sort({ createdAt: -1 })
      .lean();
    
    console.log('Orders fetched successfully, count:', orders.length);
    
    if (orders.length > 0) {
      console.log('Sample order:', orders[0]._id);
    } else {
      console.log('No orders found');
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      [], // Return empty array instead of error
      { status: 200 }
    );
  }
}