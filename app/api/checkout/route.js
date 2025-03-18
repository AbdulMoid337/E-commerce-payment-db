import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import Order from '@/models/order';
import Product from '@/models/productSchema';
import User from '@/models/usermodel';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import { getAuth } from '@clerk/nextjs/server';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    // Get auth session from Clerk using the request object
    const { userId } = auth();
    const authRequest = getAuth(request);
    const userIdFromRequest = authRequest.userId;
    
    console.log("Auth userId from auth():", userId);
    console.log("Auth userId from request:", userIdFromRequest);
    
    // Use either userId source, or proceed with guest checkout
    const effectiveUserId = userId || userIdFromRequest;
    
    // For testing purposes, allow guest checkout if auth fails
    const { items, shippingInfo } = await request.json();
    
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Create a guest user if no authenticated user
    let userRef;
    if (effectiveUserId) {
      // Try to find existing user
      userRef = await User.findOne({ clerkId: effectiveUserId });
      console.log("Found user:", userRef ? userRef._id : "Not found");
    }
    
    // If no user found or no userId, create a guest user
    if (!userRef) {
      // Create a temporary user for this order
      userRef = new User({
        clerkId: effectiveUserId || `guest-${Date.now()}`,
        email: shippingInfo.email,
        name: shippingInfo.name,
        address: {
          street: shippingInfo.street,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zip: shippingInfo.zip,
          country: shippingInfo.country,
        },
        phone: shippingInfo.phone,
        role: "user",
        orders: []
      });
      
      await userRef.save();
      console.log("Created new user:", userRef._id);
    }

    // Fetch product details from database to ensure correct pricing
    // Inside the POST function, update the product fetching logic:
    // Around line 70-75
    const productIds = items.map(item => item.id).filter(id => id); // Filter out undefined IDs
    console.log("Product IDs:", productIds);
    
    // Add more detailed logging to debug the issue
    console.log("Cart items received:", JSON.stringify(items, null, 2));
    
    // Modify the product fetching to be more robust
    let dbProducts = [];
    if (productIds.length > 0) {
      try {
        dbProducts = await Product.find({ 
          _id: { $in: productIds } 
        });
        console.log("Products found in DB:", dbProducts.length);
      } catch (err) {
        console.error("Error finding products:", err);
      }
    }

    // If no products found in DB, use the provided items directly
    // This is a fallback for development/testing
    if (dbProducts.length === 0 && items.length > 0) {
      console.log("Using provided items directly as no DB products found");
      dbProducts = items.map(item => ({
        _id: item.id,
        name: item.name,
        price: item.price,
        images: item.images || [item.imageUrl]
      }));
    }

    // Continue with the rest of your checkout logic
    if (productIds.length === 0) {
      return NextResponse.json(
        { error: 'No valid product IDs in cart' },
        { status: 400 }
      );
    }
    
    const products = await Product.find({ _id: { $in: productIds } });
    console.log("Found products:", products.length);

    // Create line items for Stripe with verified prices from database
    const lineItems = [];
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      // Skip items with undefined IDs
      if (!item.id) {
        console.log("Skipping item with undefined ID:", item);
        continue;
      }
      
      const product = products.find(p => p._id.toString() === item.id);
      
      if (!product) {
        console.log(`Product with ID ${item.id} not found in database`);
        return NextResponse.json(
          { error: `Product with ID ${item.id} not found` },
          { status: 400 }
        );
      }

      // Verify product is in stock
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Not enough stock for ${product.name}` },
          { status: 400 }
        );
      }

      const lineItem = {
        price_data: {
          currency: 'inr',
          product_data: {
            name: product.name,
            images: product.images || [],
            description: product.description ? product.description.substring(0, 255) : '', // Handle missing description
          },
          unit_amount: Math.round(product.price * 100), // Stripe uses cents
        },
        quantity: item.quantity || 1,
      };

      lineItems.push(lineItem);
      
      // Add to order items
      orderItems.push({
        productId: product._id,
        quantity: item.quantity || 1,
        price: product.price,
      });

      totalAmount += product.price * (item.quantity || 1);
    }

    // Create the order in the database immediately
    const order = new Order({
      user: userRef._id,
      items: orderItems,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'stripe',
      address: {
        street: shippingInfo.street,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zip: shippingInfo.zip,
        country: shippingInfo.country,
      },
    });
    
    await order.save();
    console.log("Created order:", order._id);
    
    // Add order to user's orders if orders array exists
    if (userRef.orders) {
      userRef.orders.push(order._id);
      await userRef.save();
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${order._id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel?orderId=${order._id}`,
      customer_email: shippingInfo.email,
      client_reference_id: userRef._id.toString(),
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'IN'], // Added India
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0, // Free shipping (in cents)
              currency: 'inr', // Changed to match the line items currency
            },
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            },
          },
        },
      ],
      metadata: {
        orderId: order._id.toString(),
        userId: userRef._id.toString(),
      },
    });

    console.log("Created Stripe session:", session.id);
    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during checkout' },
      { status: 500 }
    );
  }
}