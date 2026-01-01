'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Star } from 'lucide-react';

interface Review {
    _id: string;
    user: {
        firstName: string;
        lastName: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
}

interface ProductReviewsProps {
    productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        rating: 5,
        comment: '',
    });

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/products/${productId}/reviews`);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;

        setSubmitting(true);
        setError('');

        try {
            const res = await fetch(`/api/products/${productId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                setReviews([data.data, ...reviews]);
                setFormData({ rating: 5, comment: '' });
            } else {
                setError(data.error || 'Failed to submit review');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    return (
        <div className="mt-16">
            <h3 className="text-2xl font-medium mb-8">Customer Reviews</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Rating Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                        <div className="text-5xl font-bold text-gray-900 mb-2">
                            {averageRating.toFixed(1)}
                        </div>
                        <div className="flex justify-center mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-6 h-6 ${star <= Math.round(averageRating)
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-gray-600">Based on {reviews.length} reviews</p>
                    </div>

                    {!session ? (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded text-sm text-blue-700">
                            Please <a href="/login" className="font-bold underline">sign in</a> to write a review.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                            <h4 className="text-lg font-medium">Write a review</h4>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                className={`w-6 h-6 ${star <= formData.rating
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                                <textarea
                                    value={formData.comment}
                                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary focus:outline-none h-32"
                                    placeholder="Share your experience..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-primary text-white py-2 rounded hover:bg-primary-hover transition disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading reviews...</div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded">
                            No reviews yet. Be the first to review this product!
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {reviews.map((review) => (
                                <div key={review._id} className="border-b border-gray-100 pb-8 last:border-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h5 className="font-medium text-gray-900">
                                                {review.user.firstName} {review.user.lastName}
                                            </h5>
                                            <div className="flex mb-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${star <= review.rating
                                                                ? 'text-yellow-400 fill-yellow-400'
                                                                : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
