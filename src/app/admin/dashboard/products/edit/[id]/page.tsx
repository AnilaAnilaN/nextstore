'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X, Save, ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'clothing' | 'shoes' | 'accessories';
  stock: number;
  sizes: string[];
  colors: string[];
  featured: boolean;
  image: string;
  imageId?: string;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { id } = use(params);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'clothing',
    stock: '',
    sizes: [] as string[],
    colors: [] as string[],
    featured: false,
  });

  const [image, setImage] = useState<{ url: string; fileId: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();

      if (data.success) {
        const product: Product = data.data;
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          stock: product.stock.toString(),
          sizes: product.sizes || [],
          colors: product.colors || [],
          featured: product.featured,
        });
        setImage({
          url: product.image,
          fileId: product.imageId || '',
        });
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('folder', 'products');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();

      if (data.success) {
        setImage({
          url: data.data.url,
          fileId: data.data.fileId,
        });
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (error: any) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleColorToggle = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!image) {
      setError('Please upload a product image');
      return;
    }

    setSaving(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image: image.url,
        imageId: image.fileId,
      };

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin/dashboard/products');
      } else {
        setError(data.error || 'Failed to update product');
      }
    } catch (error: any) {
      setError('Failed to update product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/dashboard/products');
      } else {
        setError('Failed to delete product');
      }
    } catch (err) {
      setError('Error deleting product');
    }
  };

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Gray', 'Yellow', 'Purple'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-gray-600">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Link
          href="/admin/dashboard/products"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        <button
          onClick={handleDelete}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-600 hover:text-white transition group"
        >
          <Trash2 className="w-5 h-5 transition group-hover:scale-110" />
          <span>Delete Product</span>
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-2">Update product information and inventory.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Basic Information</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    placeholder="e.g., Classic Cotton T-Shirt"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    placeholder="Describe your product..."
                    required
                  />
                  <div className="flex justify-end mt-1 text-xs text-gray-400">
                    {formData.description.length}/500 characters
                  </div>
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Product Image</h2>

              {!image ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-primary hover:bg-gray-50 transition cursor-pointer group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                      <p className="text-gray-600 font-medium">Uploading...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/10 transition">
                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-primary transition" />
                      </div>
                      <p className="text-lg font-semibold text-gray-900">Click to upload</p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 group aspect-video">
                  <Image
                    src={image.url}
                    alt="Product"
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
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
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Product Variants */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Product Variants</h2>

              <div className="space-y-8">
                {/* Sizes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Available Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`px-6 py-2 border rounded-xl font-medium transition ${formData.sizes.includes(size)
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Available Colors</label>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorToggle(color)}
                        className={`px-6 py-2 border rounded-xl font-medium transition ${formData.colors.includes(color)
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                          }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Pricing & Stock */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Inventory</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Categorization</h2>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition appearance-none bg-white"
                required
              >
                <option value="clothing">Clothing</option>
                <option value="shoes">Shoes</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            {/* Product Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Product Status</h2>

              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className={`relative flex items-center justify-center w-6 h-6 border-2 rounded transition ${formData.featured ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {formData.featured && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-primary transition">Featured Product</span>
                  <p className="text-xs text-gray-500">Show on homepage</p>
                </div>
              </label>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <button
                type="submit"
                disabled={saving || uploading}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center justify-center space-x-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Update Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
