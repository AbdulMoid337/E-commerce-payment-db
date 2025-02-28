import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/order';

export async function GET(request) {
  try {
    // Use auth() instead of currentUser
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get total revenue
    const totalRevenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    // Get monthly sales for the current year
    const currentYear = new Date().getFullYear();
    const monthlyData = await Order.aggregate([
      { 
        $match: { 
          createdAt: { 
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          },
          status: { $ne: 'cancelled' }
        } 
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          sales: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format monthly data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlySales = months.map((month, index) => {
      const monthData = monthlyData.find(item => item._id === index + 1);
      return {
        month,
        sales: monthData ? monthData.sales : 0
      };
    });

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    console.log('Stats fetched successfully');

    return NextResponse.json({
      totalRevenue,
      monthlySales,
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    return NextResponse.json({
      totalRevenue: 0,
      monthlySales: months.map(month => ({ month, sales: 0 })),
      recentOrders: []
    }, { status: 200 });
  }
}