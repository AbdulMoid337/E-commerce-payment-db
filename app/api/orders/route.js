import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/order';
import User from '@/models/usermodel';

export async function GET(request) {
  try {
    // Get auth from request
    const { userId } = getAuth(request);
    console.log("API - Auth userId from request:", userId);
    
    if (!userId) {
      console.log("API - No userId found in request");
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find user by Clerk ID
    const user = await User.findOne({ clerkId: userId });
    console.log("API - Found user:", user ? user._id : "Not found");
    
    if (!user) {
      console.log("API - User not found in database");
      // Return empty orders array instead of all orders for security
      return NextResponse.json([]);
    }

    // Find all orders for the user with improved population
    const orders = await Order.find({ user: user._id })
      .populate({
        path: 'items.productId',
        select: 'name price images description'
      })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    console.log("API - User orders count:", orders.length);
    
    // Transform orders to ensure all necessary data is included
    const transformedOrders = orders.map(order => {
      return {
        _id: order._id,
        user: order.user,
        items: order.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: order.totalAmount,
        status: order.status || 'pending',
        paymentStatus: order.paymentStatus || 'pending',
        paymentMethod: order.paymentMethod,
        address: order.address,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        stripeSessionId: order.stripeSessionId
      };
    });
    
    return NextResponse.json(transformedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching orders' },
      { status: 500 }
    );
  }
}