"use client"

import React from 'react';
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { checkRole } from '@/utils/roles'
import { Input } from "@/components/ui/input";
import Loader from '@/components/Loader';
import { toast } from 'sonner'; // Add toast import
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  CreditCard, 
  Activity,
  PlusCircle,
  Settings,
  Bell,
  Server,
  FileText,
  Cpu,
  Database
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import products from '@/data/products';
import Link from "next/link";

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAdminRole = async () => {
      try {
        const adminStatus = await checkRole('admin');
        setIsAdmin(adminStatus);
        
        if (!adminStatus) {
          router.push('/404');
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdminRole();
  }, [router]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAdmin) {
    return null;
  }

  return <AdminDashboardClient />;
}

function AdminDashboardClient() {
  const { user } = useUser();
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', title: 'Products', icon: Package },
    { id: 'orders', title: 'Orders', icon: ShoppingCart },
    { id: 'users', title: 'Users', icon: Users },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'products':
        return <ProductsSection />;
      case 'orders':
        return <OrdersSection />;
      case 'users':
        return <UsersSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
            <LayoutDashboard className="mr-3 text-blue-500" />
            Admin Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Welcome, {user?.firstName || 'Admin'}
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-2">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection(section.id)}
              >
                <section.icon className="mr-2 h-5 w-5" />
                {section.title}
              </Button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewSection() {
  const { user } = useUser();
  const [salesData, setSalesData] = useState([
    { month: 'Jan', sales: 0 },
    { month: 'Feb', sales: 0 },
    { month: 'Mar', sales: 0 },
    { month: 'Apr', sales: 0 },
    { month: 'May', sales: 0 },
    { month: 'Jun', sales: 0 },
  ]);

  const [totalSales, setTotalSales] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [productDistribution, setProductDistribution] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch products count and distribution
        const productsResponse = await fetch('/api/products');
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setTotalProducts(productsData.length);
          
          // Calculate product distribution by category
          const distribution = productsData.reduce((acc, product) => {
            const existingCategory = acc.find(cat => cat.name === product.category);
            if (existingCategory) {
              existingCategory.value += 1;
            } else if (product.category) {
              acc.push({ name: product.category, value: 1 });
            }
            return acc;
          }, []);
          
          setProductDistribution(distribution);
        }
        
        // Fetch orders data for sales statistics
        const ordersResponse = await fetch('/api/admin/orders/stats');
        if (ordersResponse.ok) {
          const { monthlySales, totalRevenue, recentOrders } = await ordersResponse.json();
          setSalesData(monthlySales);
          setTotalSales(totalRevenue);
          setRecentOrders(recentOrders);
        }
        
        // Fetch users directly from the users API instead of the stats API
        const usersResponse = await fetch('/api/admin/users');
        if (usersResponse.ok) {
          const users = await usersResponse.json();
          setTotalUsers(users.length || 0);
          // Count active users
          const activeCount = users.filter(user => user.isActive).length;
          setActiveUsers(activeCount || 0);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const quickActions = [
    { 
      title: 'Add New Product', 
      icon: PlusCircle, 
      color: 'text-green-500',
      href: '/admin/products/new'
    },
    { 
      title: 'View Orders', 
      icon: ShoppingCart, 
      color: 'text-blue-500',
      href: '/admin/orders'
    },
    { 
      title: 'Manage Users', 
      icon: Users, 
      color: 'text-yellow-500',
      href: '/admin/users'
    }
  ];

  const recentActivity = recentOrders.map(order => ({
    id: order._id,
    type: 'Order',
    description: `Order #${order._id.slice(-6)} - ₹${order.totalAmount.toFixed(2)}`,
    time: formatDistance(new Date(order.createdAt), new Date(), { addSuffix: true }),
    icon: ShoppingCart
  }));

  if (isLoading) {
    return <div className="flex justify-center items-center py-12">
      <Loader />
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Sales" 
          value={`₹${totalSales.toLocaleString()}`} 
          icon={TrendingUp}
          trend="up"
          percentage={12.5}
        />
        <StatCard 
          title="Total Users" 
          value={totalUsers.toLocaleString()} 
          icon={Users}
          trend="up"
          percentage={8.2}
        />
        <StatCard 
          title="Total Products" 
          value={totalProducts.toLocaleString()} 
          icon={Package}
          trend="neutral"
          percentage={0}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Sales']} />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Product Distribution</h3>
          {productDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {productDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value} products`, props.payload.name]} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No product data available
            </div>
          )}
        </div>
      </div>

     
    </div>
  );
}

function ProductsSection() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from the database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          toast.error('Failed to load products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Error loading products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditProduct = (productId) => {
    router.push(`/admin/products/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Remove the product from the local state
          setProducts(products.filter(product => product._id !== productId));
          toast.success('Product deleted successfully');
        } else {
          const error = await response.json();
          toast.error(error.message || 'Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('An error occurred while deleting the product');
      }
    }
  };


  if (isLoading) {
    return <div className="flex justify-center items-center py-12">
      <Loader />
    </div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Products</h2>
        <Button 
          onClick={() => router.push('/admin/products/new')}
          className="flex items-center"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-2 text-left">Image</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Stock</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b dark:border-gray-700">
                    <td className="p-2">
                      <div className="w-12 h-12 relative">
                        <img 
                          src={product.images?.[0] || product.imageUrl || '/placeholder-image.jpg'} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                    </td>
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">{product.category}</td>
                    <td className="p-2">₹{product.price?.toFixed(2)}</td>
                    <td className="p-2">{product.stock}</td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditProduct(product._id)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-4 text-center">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function OrdersSection() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching orders...');
        const response = await fetch('/api/admin/orders');
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Orders data received:', data.length);
          setOrders(data);
        } else {
          console.error('Failed to load orders, status:', response.status);
          toast.error('Failed to load orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Error loading orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => 
    order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center py-12">
      <Loader />
    </div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Orders Management</h2>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search orders by ID or user ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2 text-left">User ID</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Items</th>
              <th className="p-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr 
                    className="border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => toggleOrderDetails(order._id)}
                  >
                    <td className="p-2">#{order._id?.slice(-6)}</td>
                    <td className="p-2">{order.userId || 'Guest'}</td>
                    <td className="p-2">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {order.status || 'Processing'}
                      </span>
                    </td>
                    <td className="p-2">
                      {order.items?.length || 0} items
                    </td>
                    <td className="p-2 font-semibold">₹{order.totalAmount?.toFixed(2) || '0.00'}</td>
                  </tr>
                  {expandedOrderId === order._id && (
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <td colSpan="6" className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Order Items</h4>
                            <div className="space-y-2">
                              {order.items?.map((item, index) => (
                                <div key={index} className="flex items-center p-2 border rounded">
                                  {item.productId?.images && item.productId.images[0] && (
                                    <img 
                                      src={item.productId.images[0]} 
                                      alt={item.productId?.name || 'Product'} 
                                      className="w-12 h-12 object-cover rounded mr-3"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder-image.jpg';
                                      }}
                                    />
                                  )}
                                  <div>
                                    <p className="font-medium">{item.productId?.name || 'Product'}</p>
                                    <p className="text-sm text-gray-500">
                                      ₹{item.price?.toFixed(2) || '0.00'} × {item.quantity} = 
                                      ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Shipping Address</h4>
                            {order.address ? (
                              <div className="p-3 border rounded">
                                <p>{order.address.name}</p>
                                <p>{order.address.street}</p>
                                <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
                                <p>{order.address.country}</p>
                                <p className="mt-2">Phone: {order.address.phone}</p>
                              </div>
                            ) : (
                              <p className="text-gray-500">No address information</p>
                            )}
                            
                            <h4 className="font-semibold mt-4 mb-2">Order Summary</h4>
                            <div className="p-3 border rounded">
                              <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>₹{order.totalAmount?.toFixed(2) || '0.00'}</span>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span>Shipping:</span>
                                <span>₹0.00</span>
                              </div>
                              <div className="flex justify-between mt-1 font-bold">
                                <span>Total:</span>
                                <span>₹{order.totalAmount?.toFixed(2) || '0.00'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersSection() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          toast.error('Failed to load users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error loading users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex justify-center items-center py-12">
      <Loader />
    </div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Users Management</h2>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Orders</th>
              <th className="p-2 text-left">Joined Date</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="border-b dark:border-gray-700">
                  <td className="p-2">
                    <div className="flex items-center">
                      {user.image ? (
                        <img 
                          src={user.image}
                          alt={user.name}
                          className="w-8 h-8 rounded-full mr-2"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-avatar.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
                          {user.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                      )}
                      {user.name}
                    </div>
                  </td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="p-2">{user.orderCount || 0}</td>
                  <td className="p-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, percentage }) {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm text-gray-500 mb-2">{title}</h4>
          <p className="text-2xl font-bold">{value}</p>
          {percentage !== undefined && (
            <div className="flex items-center text-sm mt-1">
              <span className={`mr-1 ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '•'}
              </span>
              <span className={trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'}>
                {percentage}%
              </span>
            </div>
          )}
        </div>
        <Icon className="h-8 w-8 text-blue-500 opacity-75" />
      </div>
    </div>
  );
}