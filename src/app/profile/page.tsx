'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import { User, Package, MapPin, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchUserProfile();
        }
    }, [status]);

    const fetchUserProfile = async () => {
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            if (data.success) {
                setUser(data.data);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading profile...</div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <>
            <Breadcrumb items={[{ label: 'Profile' }]} />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Sidebar */}
                        <div className="md:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex flex-col items-center mb-6">
                                    <div className="w-20 h-20 bg-primary text-white text-2xl font-bold rounded-full flex items-center justify-center mb-4">
                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </h2>
                                    <p className="text-gray-500 text-sm">{user.email}</p>
                                </div>

                                <nav className="space-y-1">
                                    <Link
                                        href="/profile"
                                        className="flex items-center space-x-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium"
                                    >
                                        <User className="w-5 h-5" />
                                        <span>Personal Info</span>
                                    </Link>
                                    <Link
                                        href="/profile/orders"
                                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <Package className="w-5 h-5" />
                                        <span>Order History</span>
                                    </Link>
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Sign Out</span>
                                    </button>
                                </nav>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="md:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">First Name</label>
                                        <p className="text-gray-900 font-medium">{user.firstName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">Last Name</label>
                                        <p className="text-gray-900 font-medium">{user.lastName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">Email Address</label>
                                        <p className="text-gray-900 font-medium">{user.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
                                        <p className="text-gray-900 font-medium">{user.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2" />
                                    Default Address
                                </h3>
                                {user.address && user.address.street ? (
                                    <div className="text-gray-700">
                                        <p>{user.address.street}</p>
                                        <p>{user.address.city}, {user.address.state} {user.address.zipCode}</p>
                                        <p>{user.address.country}</p>
                                    </div>
                                ) : (
                                    <div className="text-gray-500 italic p-4 bg-gray-50 rounded text-sm">
                                        No address saved yet. You can add one during checkout.
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 flex justify-end">
                                <Link
                                    href="/profile/orders"
                                    className="inline-flex items-center space-x-2 text-primary font-medium hover:underline"
                                >
                                    <span>View your orders</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
