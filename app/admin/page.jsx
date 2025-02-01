"use client"

import { useUser, SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  CreditCard, 
  Activity 
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
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    if (isLoaded) {
      if (!user || user.emailAddresses[0]?.emailAddress !== ADMIN_EMAIL) {
        router.push("/404");
      }
    }
  }, [user, isLoaded, router]);

  if (!isLoaded) {
    return <Loader />;
  }

  return (
    <>
      <SignedIn>
        {user?.emailAddresses[0]?.emailAddress === ADMIN_EMAIL ? (
          <AdminDashboardClient />
        ) : (
          <div className="text-center text-red-500 font-bold p-8">Access Denied</div>
        )}
      </SignedIn>
      <SignedOut>
        <SignIn routing="hash" />
      </SignedOut>
    </>
  );
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
  const salesData = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4500 },
    { month: 'May', sales: 6000 },
  ];

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

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Products" 
          value={products.length} 
          icon={Package} 
          trend="up" 
          percentage={12} 
        />
        <StatCard 
          title="Total Orders" 
          value="120" 
          icon={ShoppingCart} 
          trend="up" 
          percentage={8} 
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${products.reduce((acc, p) => acc + p.price, 0).toFixed(2)}`} 
          icon={CreditCard} 
          trend="up" 
          percentage={15} 
        />
        <StatCard 
          title="Active Users" 
          value="250" 
          icon={Users} 
          trend="down" 
          percentage={5} 
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2 text-blue-500" /> Monthly Sales
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Activity className="mr-2 text-green-500" /> Product Distribution
          </h3>
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
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
    </div>
  );
}

function ProductsSection() {
  const router = useRouter();

  const handleEditProduct = (productId) => {
    router.push(`/admin/products/${productId}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Package className="mr-2 text-blue-500" /> Manage Products
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
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
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleEditProduct(product.id)}
                className="bg-white hover:bg-gray-100 text-gray-700"
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersSection() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <ShoppingCart className="mr-2 text-green-500" /> Order Management
      </h2>
      <p className="text-gray-600 dark:text-gray-300">Order management functionality coming soon...</p>
    </div>
  );
}

function UsersSection() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Users className="mr-2 text-purple-500" /> User Management
      </h2>
      <p className="text-gray-600 dark:text-gray-300">User management functionality coming soon...</p>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, percentage }) {
  return (
    <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm text-gray-500 dark:text-gray-300 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
        <div className={`p-2 rounded-full ${
          trend === 'up' 
            ? 'bg-green-100 text-green-600' 
            : 'bg-red-100 text-red-600'
        }`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-2 text-sm flex items-center">
        <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
          {trend === 'up' ? '↑' : '↓'} {percentage}%
        </span>
        <span className="ml-2 text-gray-500 dark:text-gray-400">since last month</span>
      </div>
    </div>
  );
}