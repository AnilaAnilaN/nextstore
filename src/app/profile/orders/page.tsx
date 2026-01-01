'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, User, LogOut } from 'lucide-react';
import Link from 'next/link';

interface Order {
    _id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    items: any[];
}

export default function OrderHistoryPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchOrders();
        }
    }, [status]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium uppercase">Pending</span>;
            case 'processing':
                return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium uppercase">Processing</span>;
            case 'shipped':
                return <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium uppercase">Shipped</span>;
            case 'delivered':
                return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium uppercase">Delivered</span>;
            case 'cancelled':
                return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium uppercase">Cancelled</span>;
            default:
                return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium uppercase">{status}</span>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'processing': return <Package className="w-5 h-5 text-blue-500" />;
            case 'shipped': return <Truck className="w-5 h-5 text-purple-500" />;
            case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Package className="w-5 h-5 text-gray-500" />;
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading orders...</div>
            </div>
        );
    }

    return (
        <>
            <Breadcrumb items={[{ label: 'Profile', href: '/profile' }, { label: 'Order History' }]} />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Sidebar (Same as profile) */}
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <nav className="space-y-1">
                                    <Link
                                        href="/profile"
                                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <User className="w-5 h-5" />
                                        <span>Personal Info</span>
                                    </Link>
                                    <Link
                                        href="/profile/orders"
                                        className="flex items-center space-x-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium"
                                    >
                                        <Package className="w-5 h-5" />
                                        <span>Order History</span>
                                    </Link>
                                </nav>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="md:col-span-2">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h2>

                            {orders.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
                                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                                    <Link
                                        href="/shop"
                                        className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-hover transition"
                                    >
                                        Start Shopping
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div
                                            key={order._id}
                                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                                        >
                                            <div className="p-6">
                                                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-lg">
                                                            {getStatusIcon(order.status)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Order Number</p>
                                                            <p className="font-bold text-gray-900">{order.orderNumber}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-500">Placed on</p>
                                                        <p className="font-medium text-gray-900">
                                                            {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="flex -space-x-2">
                                                            {order.items.slice(0, 3).map((item, idx) => (
                                                                <div key={idx} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-100">
                                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                                </div>
                                                            ))}
                                                            {order.items.length > 3 && (
                                                                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                                    +{order.items.length - 3}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-sm">
                                                            <p className="font-medium text-gray-900">
                                                                {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
                                                            </p>
                                                            <p className="text-gray-500">${order.total.toFixed(2)} total</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-3">
                                                        {getStatusBadge(order.status)}
                                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
