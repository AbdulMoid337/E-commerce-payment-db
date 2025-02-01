import { getAuth } from '@clerk/nextjs/server';
import products from '@/data/products';

// Placeholder mock orders data using actual product data
const mockOrders = [
  {
    id: 'ORD-001',
    userId: 'user_123',
    status: 'Completed',
    total: 179.98,
    createdAt: new Date('2024-01-15').toISOString(),
    items: [
      { 
        name: products.find(p => p.id === 1).name, 
        quantity: 1, 
        price: products.find(p => p.id === 1).price 
      },
      { 
        name: products.find(p => p.id === 7).name, 
        quantity: 1, 
        price: products.find(p => p.id === 7).price 
      }
    ]
  },
  {
    id: 'ORD-002',
    userId: 'user_123',
    status: 'Processing',
    total: 149.99,
    createdAt: new Date('2024-02-01').toISOString(),
    items: [
      { 
        name: products.find(p => p.id === 8).name, 
        quantity: 1, 
        price: products.find(p => p.id === 8).price 
      }
    ]
  }
];

export default async function handler(req, res) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    // In a real application, you would fetch orders from a database
    const userOrders = mockOrders.filter(order => order.userId === userId);
    res.status(200).json(userOrders);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
