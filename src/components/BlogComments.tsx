'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { MessageSquare, User } from 'lucide-react';

interface Comment {
    _id: string;
    user: {
        firstName: string;
        lastName: string;
    };
    content: string;
    createdAt: string;
}

interface BlogCommentsProps {
    blogId: string; // can be ID or slug
}

export default function BlogComments({ blogId }: BlogCommentsProps) {
    const { data: session } = useSession();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        fetchComments();
    }, [blogId]);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/blogs/${blogId}/comments`);
            const data = await res.json();
            if (data.success) {
                setComments(data.data);
            }
        } catch (err) {
            console.error('Error fetching comments:', err);
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
            const res = await fetch(`/api/blogs/${blogId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            const data = await res.json();
            if (data.success) {
                setComments([data.data, ...comments]);
                setContent('');
            } else {
                setError(data.error || 'Failed to submit comment');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-16 border-t border-gray-200 pt-16">
            <div className="max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                    <MessageSquare className="w-6 h-6 mr-2" />
                    Comments ({comments.length})
                </h3>

                {/* Comment Form */}
                {!session ? (
                    <div className="mb-12 p-6 bg-gray-50 rounded-lg text-center">
                        <p className="text-gray-600 mb-4">You must be logged in to post a comment.</p>
                        <a
                            href="/login"
                            className="inline-block bg-primary text-white px-6 py-2 rounded font-medium hover:bg-primary-hover transition"
                        >
                            Sign In
                        </a>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mb-12 bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                        <h4 className="text-lg font-medium mb-4">Leave a comment</h4>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition h-32"
                            placeholder="What are your thoughts?"
                            required
                        />

                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-primary text-white px-8 py-2 rounded-lg font-medium hover:bg-primary-hover transition disabled:opacity-50"
                            >
                                {submitting ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Comments List */}
                <div className="space-y-8">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading comments...</div>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <p className="text-gray-500">No comments yet. Be the first to join the conversation!</p>
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment._id} className="flex space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-gray-400" />
                                    </div>
                                </div>
                                <div className="flex-1 bg-white p-6 border border-gray-100 rounded-lg shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-bold text-gray-900">
                                            {comment.user.firstName} {comment.user.lastName}
                                        </h5>
                                        <span className="text-sm text-gray-500">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
