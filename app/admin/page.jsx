"use client"

import { useUser, SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Specific email check
  const ADMIN_EMAIL = "abdulmoid7733@gmail.com";

  useEffect(() => {
    // Only check after user info is loaded
    if (isLoaded) {
      // Redirect if no user or email doesn't match
      if (!user || user.emailAddresses[0]?.emailAddress !== ADMIN_EMAIL) {
        router.push("/404");
      }
    }
  }, [user, isLoaded, router]);

  // If not loaded yet, show loading or nothing
  if (!isLoaded) {
    return <Loader />;
  }

  return (
    <>
      <SignedIn>
        {user?.emailAddresses[0]?.emailAddress === ADMIN_EMAIL ? (
          <AdminDashboardClient />
        ) : (
          <div>Access Denied</div>
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

  // Sections for admin dashboard
  const sections = [
    { id: 'overview', title: 'Dashboard Overview' },
    { id: 'products', title: 'Manage Products' },
    { id: 'orders', title: 'Order Management' },
    { id: 'users', title: 'User Management' },
  ];

  // Render different sections based on active section
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
    <div className="container mx-auto pt-36 px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid md:grid-cols-[250px_1fr] gap-8">
        {/* Sidebar Navigation */}
        <div className="space-y-4">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => setActiveSection(section.id)}
            >
              {section.title}
            </Button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-white shadow-md rounded-lg p-6">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}

// Placeholder components for different sections
function OverviewSection() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Products" value="50" />
        <StatCard title="Total Orders" value="120" />
        <StatCard title="Total Revenue" value="$15,000" />
        <StatCard title="Active Users" value="250" />
      </div>
    </div>
  );
}

function ProductsSection() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Products</h2>
      <p>Product management functionality coming soon...</p>
    </div>
  );
}

function OrdersSection() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Order Management</h2>
      <p>Order management functionality coming soon...</p>
    </div>
  );
}

function UsersSection() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      <p>User management functionality coming soon...</p>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-gray-500 mb-2">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}