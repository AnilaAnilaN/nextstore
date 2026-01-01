'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Loader2, X } from 'lucide-react';
import Editor from '@/components/admin/Editor';

export default function NewBlogPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
      const response = await fetch('/api/blogs', {
        method: 'POST',
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
        alert('Blog created successfully!');
        router.push('/admin/dashboard/blogs');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create blog');
      }
    } catch (error) {
      console.error(error);
      alert('Error creating blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Blogs</span>
      </button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
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
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 bg-white rounded-lg text-gray-900 hover:bg-primary hover:text-white transition shadow-lg"
                    >
                      <Upload className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition shadow-lg"
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
                  <div className="relative flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded transition group-hover:border-primary">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) =>
                        setFormData({ ...formData, published: e.target.checked })
                      }
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {formData.published && <div className="w-3 h-3 bg-primary rounded-sm" />}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Published</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 border-2 border-gray-300 rounded transition group-hover:border-primary">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {formData.featured && <div className="w-3 h-3 bg-primary rounded-sm" />}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Featured</span>
                </label>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="w-full bg-primary text-white px-6 py-4 rounded-xl font-bold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-primary/20"
                >
                  {isSubmitting ? 'Creating...' : 'Create Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
