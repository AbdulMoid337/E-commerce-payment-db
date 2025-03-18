import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/order';

export async function GET(request, context) {
  try {
    // Get the session ID from the URL params
    const { sessionId } = context.params;
    
    console.log("Fetching order with session ID:", sessionId);
    
    // Connect to the database
    await dbConnect();
    
    // Find the order by session ID with improved query and population
    const order = await Order.findOne({ 
      $or: [
        { stripeSessionId: sessionId },
        { 'payment.sessionId': sessionId }
      ]
    }).populate({
      path: 'items.productId',
      select: 'name price images description'
    }).populate('user', 'name email');
    
    if (!order) {
      console.log("Order not found for session:", sessionId);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log("Order found:", order._id);
    
    // Transform the order to ensure all data is properly structured
    const transformedOrder = {
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
    
    // Return the order details
    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching the order' },
      { status: 500 }
    );
  }
}