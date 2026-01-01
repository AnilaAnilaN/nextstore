'use client';

import { useState, useEffect } from 'react';
import { Star, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Review {
    _id: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    product: {
        _id: string;
        name: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            // Need an API to get ALL reviews (admin)
            const res = await fetch('/api/admin/reviews');
            const data = await res.json();
            if (data.success) {
                setReviews(data.data);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteReview = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setReviews(reviews.filter(r => r._id !== id));
            }
        } catch (err) {
            alert('Failed to delete review');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Product Reviews</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Comment</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Loading reviews...</td>
                                </tr>
                            ) : reviews.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No reviews found.</td>
                                </tr>
                            ) : (
                                reviews.map((review) => (
                                    <tr key={review._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            {review.product ? (
                                                <Link href={`/shop/${review.product._id}`} target="_blank" className="flex items-center text-primary hover:underline">
                                                    {review.product.name}
                                                    <ExternalLink className="w-3 h-3 ml-1" />
                                                </Link>
                                            ) : (
                                                <span className="text-gray-400 italic">Deleted Product</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{review.user?.firstName} {review.user?.lastName}</div>
                                            <div className="text-xs text-gray-500">{review.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <p className="text-sm text-gray-600 truncate">{review.comment}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => deleteReview(review._id)}
                                                className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
