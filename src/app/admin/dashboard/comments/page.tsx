'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Comment {
    _id: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    blog: {
        _id: string;
        title: string;
        slug: string;
    };
    content: string;
    createdAt: string;
}

export default function AdminCommentsPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const res = await fetch('/api/admin/comments');
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

    const deleteComment = async (id: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            const res = await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setComments(comments.filter(c => c._id !== id));
            }
        } catch (err) {
            alert('Failed to delete comment');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Blog Comments</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Blog Post</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Comment</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading comments...</td>
                                </tr>
                            ) : comments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No comments found.</td>
                                </tr>
                            ) : (
                                comments.map((comment) => (
                                    <tr key={comment._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            {comment.blog ? (
                                                <Link href={`/blog/${comment.blog.slug}`} target="_blank" className="flex items-center text-primary hover:underline font-medium">
                                                    {comment.blog.title}
                                                    <ExternalLink className="w-3 h-3 ml-1" />
                                                </Link>
                                            ) : (
                                                <span className="text-gray-400 italic">Deleted Blog</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{comment.user?.firstName} {comment.user?.lastName}</div>
                                            <div className="text-xs text-gray-500">{comment.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 max-w-sm">
                                            <p className="text-sm text-gray-600 line-clamp-2">{comment.content}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => deleteComment(comment._id)}
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
