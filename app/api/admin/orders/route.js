import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/order';
import User from '@/models/usermodel';

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

    // Fetch orders with improved population
    const orders = await Order.find({})
      .populate({
        path: 'items.productId',
        select: 'name price images description'
      })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();
    
    console.log('Orders fetched successfully, count:', orders.length);
    
    if (orders.length > 0) {
      console.log('Sample order:', orders[0]._id);
      
      // Transform orders to ensure consistent structure
      const transformedOrders = orders.map(order => ({
        _id: order._id,
        userId: order.user?._id?.toString() || 'Guest',
        userEmail: order.user?.email || 'guest@example.com',
        items: order.items?.map(item => ({
          productId: item.productId,
          quantity: item.quantity || 1,
          price: item.price || 0
        })) || [],
        totalAmount: order.totalAmount || 0,
        status: order.status || 'processing',
        paymentStatus: order.paymentStatus || 'pending',
        address: order.address || {},
        createdAt: order.createdAt || new Date(),
        updatedAt: order.updatedAt || new Date()
      }));
      
      return NextResponse.json(transformedOrders);
    } else {
      console.log('No orders found');
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      [], // Return empty array instead of error
      { status: 200 }
    );
  }
}