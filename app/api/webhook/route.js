import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/order';
import Product from '@/models/productSchema';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  console.log("Webhook received");
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;
  try {
    // For production, use this:
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    } else {
      // For development, parse the payload directly
      event = JSON.parse(payload);
    }
    console.log("Webhook event type:", event.type);
  } catch (err) {
    console.error(`Webhook error: ${err.message}`);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log("Session completed:", session.id);
    
    try {
      await dbConnect();
      
      // Get the order ID from the metadata
      const orderId = session.metadata.orderId;
      
      if (!orderId) {
        console.error("No order ID found in session metadata");
        return NextResponse.json({ error: 'No order ID found' }, { status: 400 });
      }
      
      // Update the order status
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { 
          status: 'processing',
          paymentStatus: 'paid',
          stripeSessionId: session.id
        },
        { new: true }
      );
      
      if (!updatedOrder) {
        console.error("Order not found:", orderId);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      
      console.log("Updated order status:", updatedOrder._id);
      
      // Update product stock
      for (const item of updatedOrder.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }
        );
      }
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 });
    }
  }
  
  return NextResponse.json({ received: true });
}