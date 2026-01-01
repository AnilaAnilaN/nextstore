'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Loader2, X, Trash2 } from 'lucide-react';
import Editor from '@/components/admin/Editor';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  author: {
    name: string;
    email?: string;
  };
  image: string;
  imageId?: string;
}

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { id } = use(params);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Fashion',
    tags: '',
    published: false,
    featured: false,
    authorName: '',
    authorEmail: '',
    image: '',
    imageId: '',
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBlog(id);
    }
  }, [id]);

  const fetchBlog = async (id: string) => {
    try {
      const response = await fetch(`/api/blogs/${id}`);
      const data = await response.json();

      if (data.success) {
        const blog: Blog = data.data;
        setFormData({
          title: blog.title,
          excerpt: blog.excerpt,
          content: blog.content,
          category: blog.category,
          tags: blog.tags.join(', '),
          published: blog.published,
          featured: blog.featured,
          authorName: blog.author.name,
          authorEmail: blog.author.email || '',
          image: blog.image,
          imageId: blog.imageId || '',
        });
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      alert('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('folder', 'blogs');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const result = await response.json();
      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          image: result.data.url,
          imageId: result.data.fileId,
        }));
      } else {
        alert(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: '', imageId: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert('Please upload a featured image');
      return;
    }
    if (!formData.content || formData.content === '<p></p>') {
      alert('Blog content is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          author: {
            name: formData.authorName,
            email: formData.authorEmail,
          },
          tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        alert('Blog updated successfully!');
        router.push('/admin/dashboard/blogs');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update blog');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Blog deleted successfully!');
        router.push('/admin/dashboard/blogs');
      } else {
        alert('Failed to delete blog');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting blog');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-gray-600">Loading blog details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Blogs</span>
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-600 hover:text-white transition group"
        >
          <Trash2 className="w-5 h-5 transition group-hover:scale-110" />
          <span>Delete Post</span>
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
        <p className="text-gray-500 mt-2">Update your content, formatting and featured image.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                placeholder="Enter a catchy blog title"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                required
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                placeholder="Brief description of the blog post"
              />
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${formData.excerpt.length > 500 ? 'text-red-500' : 'text-gray-400'}`}>
                  {formData.excerpt.length}/500
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content *
              </label>
              <Editor
                content={formData.content}
                onChange={(html) => setFormData({ ...formData, content: html })}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Info & Featured Image Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Metadata & Categorization</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition appearance-none bg-white"
                  >
                    <option value="Fashion">Fashion</option>
                    <option value="Style">Style</option>
                    <option value="Trends">Trends</option>
                    <option value="Classic">Classic</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    placeholder="fashion, style, winter"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Author Email
                  </label>
                  <input
                    type="email"
                    value={formData.authorEmail}
                    onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Featured Image</h3>

              {!formData.image ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-primary hover:bg-gray-50 transition cursor-pointer group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                      <p className="text-gray-600 font-medium">Uploading...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/10 transition">
                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary transition" />
                      </div>
                      <p className="font-semibold text-gray-900">Choose Image</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 group aspect-video">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3 text-white">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/40 transition border border-white/30"
                      title="Change Image"
                    >
                      <Upload className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-3 bg-red-500/80 backdrop-blur-md rounded-xl hover:bg-red-600 transition border border-red-400/30"
                      title="Remove Image"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              )}

              <div className="mt-8 space-y-4">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className={`relative flex items-center justify-center w-6 h-6 border-2 rounded transition ${formData.published ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) =>
                        setFormData({ ...formData, published: e.target.checked })
                      }
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {formData.published && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Published</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className={`relative flex items-center justify-center w-6 h-6 border-2 rounded transition ${formData.featured ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {formData.featured && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Featured Post</span>
                </label>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="w-full bg-primary text-white px-6 py-4 rounded-xl font-bold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? 'Updating...' : 'Update Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
