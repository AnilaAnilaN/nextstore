'use client';

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, MessageSquare, DollarSign } from 'lucide-react';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  newMessages: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    newMessages: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [products, orders, messages] = await Promise.all([
        fetch('/api/products').then(res => res.json()),
        fetch('/api/orders').then(res => res.json()),
        fetch('/api/contact?status=new').then(res => res.json()),
      ]);

      const pendingOrders = orders.data?.filter((o: any) => o.status === 'pending').length || 0;
      const totalRevenue = orders.data?.reduce((sum: number, o: any) => sum + o.total, 0) || 0;

      setStats({
        totalProducts: products.count || 0,
        totalOrders: orders.count || 0,
        pendingOrders,
        newMessages: messages.count || 0,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: ShoppingCart,
      color: 'bg-yellow-500',
    },
    {
      title: 'New Messages',
      value: stats.newMessages,
      icon: MessageSquare,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-[#7971ea]',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/admin/dashboard/products/new"
              className="block w-full bg-[#7971ea] text-white text-center py-3 rounded hover:bg-[#5a50e5] transition"
            >
              Add New Product
            </a>
            <a
              href="/admin/dashboard/orders"
              className="block w-full bg-gray-100 text-gray-900 text-center py-3 rounded hover:bg-gray-200 transition"
            >
              View Orders
            </a>
            <a
              href="/admin/dashboard/messages"
              className="block w-full bg-gray-100 text-gray-900 text-center py-3 rounded hover:bg-gray-200 transition"
            >
              Check Messages
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-600">System is running smoothly</p>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Database connected</p>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <p className="text-sm text-gray-600">ImageKit integration active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}