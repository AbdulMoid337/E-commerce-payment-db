"use client"

import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { checkRole } from '@/utils/roles'
import { Input } from "@/components/ui/input";

import Loader from '@/components/Loader';
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
  ]);

  const [totalSales, setTotalSales] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    // Simulate fetching real data
    const fetchDashboardData = async () => {
      try {
        // Simulate dynamic sales data
        const monthlySales = [
          { month: 'Jan', sales: 4200 },
          { month: 'Feb', sales: 5600 },
          { month: 'Mar', sales: 4800 },
          { month: 'Apr', sales: 6300 },
          { month: 'May', sales: 5900 },
        ];
        setSalesData(monthlySales);

        // Calculate total sales
        const total = monthlySales.reduce((sum, month) => sum + month.sales, 0);
        setTotalSales(total);

        // Total products from products array
        setTotalProducts(products.length);

        // Get total active users from Clerk
        if (user) {
          const response = await fetch(`/api/users/count`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (response.ok) {
            const { count } = await response.json();
            setActiveUsers(2); // Hardcoded active users
            setTotalUsers(count);
          } else {
            // Fallback to hardcoded values
            setActiveUsers(2);
            setTotalUsers(2);
          }
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to hardcoded values
        setActiveUsers(2);
        setTotalUsers(2);
      }
    };

    fetchDashboardData();
  }, [user]);

  const productDistribution = products.reduce((acc, product) => {
    const existingCategory = acc.find(cat => cat.name === product.category);
    if (existingCategory) {
      existingCategory.value += 1;
    } else {
      acc.push({ name: product.category, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const quickActions = [
    { 
      title: 'Add New Product', 
      icon: PlusCircle, 
      color: 'text-green-500',
      action: () => {/* Implement add product logic */}
    },
    { 
      title: 'Manage Settings', 
      icon: Settings, 
      color: 'text-blue-500',
      action: () => {/* Implement settings management */}
    },
    { 
      title: 'View Notifications', 
      icon: Bell, 
      color: 'text-yellow-500',
      action: () => {/* Implement notifications */}
    }
  ];

  const recentActivity = [
    { 
      id: 1, 
      type: 'Product', 
      description: 'New product "Wireless Headphones" added', 
      time: '2 hours ago',
      icon: Package
    },
    { 
      id: 2, 
      type: 'Order', 
      description: 'Order #1234 processed', 
      time: '4 hours ago',
      icon: ShoppingCart
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Sales" 
          value={`$${totalSales.toLocaleString()}`} 
          icon={TrendingUp}
          trend="up"
          percentage={12.5}
        />
        <StatCard 
          title="Active Users" 
          value={`${activeUsers} / ${totalUsers}`} 
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
              <Tooltip />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Product Distribution</h3>
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
              >
                {productDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="w-full justify-start"
                onClick={action.action}
              >
                <action.icon className={`mr-2 h-5 w-5 ${action.color}`} />
                {action.title}
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <activity.icon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsSection() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditProduct = (productId) => {
    router.push(`/admin/products/${productId}`);
  };

  const handleDeleteProduct = (productId) => {
    // In a real application, this would be an API call
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
      products.splice(index, 1);
      // Optionally, trigger a re-render or state update
    }
  };

  const handleAddProduct = () => {
    router.push('/admin/products/new');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Products Management</h2>
        <Button 
          onClick={handleAddProduct} 
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
          className="w-full"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg shadow-sm relative group"
          >
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-48 object-cover rounded-md mb-4" 
            />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{product.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-blue-600">${product.price}</span>
              <span className="text-yellow-500">★ {product.rating}</span>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleEditProduct(product.id)}
                className="bg-white hover:bg-gray-100 text-gray-700"
              >
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleDeleteProduct(product.id)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No products found
        </div>
      )}
    </div>
  );
}

function OrdersSection() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Orders Management</h2>
      {/* Add orders management UI */}
    </div>
  );
}

function UsersSection() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Users Management</h2>
      {/* Add users management UI */}
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
          <div className="flex items-center text-sm mt-1">
            <span className={`mr-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {trend === 'up' ? '▲' : '▼'}
            </span>
            <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
              {percentage}%
            </span>
          </div>
        </div>
        <Icon className="h-8 w-8 text-blue-500 opacity-75" />
      </div>
    </div>
  );
}