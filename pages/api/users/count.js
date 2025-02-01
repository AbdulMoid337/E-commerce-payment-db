import { clerkClient } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Hardcoded user count and details
    return res.status(200).json({ 
      count: 2, // Hardcoded total users
      users: [
        {
          id: 'user_1',
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          createdAt: new Date().toISOString()
        },
        {
          id: 'user_2',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          createdAt: new Date().toISOString()
        }
      ]
    });
  } catch (error) {
    console.error('Error in user count API:', error);
    return res.status(500).json({ 
      message: 'Unable to fetch user list', 
      error: error.message 
    });
  }
}
