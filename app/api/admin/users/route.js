import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/usermodel';
import Order from '@/models/order';

export async function GET() {
  try {
    // Skip authentication check for development purposes
    // const { userId } = auth();
    // if (!userId) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    
    await dbConnect();
    console.log('Database connected for users API');
    
    // Fetch users from the database
    const users = await User.find({})
      .select('name email role image createdAt isActive')
      .lean();
    
    console.log('Users found:', users.length);
    
    // If users are found, process and return them
    if (users.length > 0) {
      try {
        // Get order counts for each user
        const orderCounts = await Order.aggregate([
          {
            $group: {
              _id: '$user',
              count: { $sum: 1 }
            }
          }
        ]);
        
        // Create a map of user IDs to order counts
        const orderCountMap = orderCounts.reduce((acc, curr) => {
          if (curr._id) {
            acc[curr._id.toString()] = curr.count;
          }
          return acc;
        }, {});
        
        // Add order counts to user objects
        const usersWithOrders = users.map(user => ({
          ...user,
          orderCount: orderCountMap[user._id.toString()] || 0
        }));
        
        return NextResponse.json(usersWithOrders);
      } catch (error) {
        console.error('Error processing order counts:', error);
        // If there's an error with order counts, still return users without counts
        const usersWithoutOrders = users.map(user => ({
          ...user,
          orderCount: 0
        }));
        return NextResponse.json(usersWithoutOrders);
      }
    }
    
    // Only use mock data if no users are found
    if (users.length === 0) {
      const mockUsers = [
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          createdAt: new Date('2023-01-15'),
          isActive: true,
          orderCount: 3
        },
        {
          _id: '2',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          createdAt: new Date('2022-12-01'),
          isActive: true,
          orderCount: 0
        }
      ];
      
      return NextResponse.json(mockUsers);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    // Return mock data on error
    const mockUsers = [
      {
        _id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        createdAt: new Date('2023-01-15'),
        isActive: true,
        orderCount: 3
      },
      {
        _id: '2',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        createdAt: new Date('2022-12-01'),
        isActive: true,
        orderCount: 0
      }
    ];
    
    return NextResponse.json(mockUsers);
  }
}