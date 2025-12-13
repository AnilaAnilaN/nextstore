'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
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

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin/dashboard/products');
      } else {
        setError(data.error || 'Failed to create product');
      }
    } catch (error: any) {
      setError('Failed to create product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Gray', 'Yellow', 'Purple'];

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/dashboard/products"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-2">Create a new product in your store</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#7971ea]"
                    placeholder="e.g., Classic Cotton T-Shirt"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#7971ea]"
                    placeholder="Describe your product..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.description.length}/500 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Image</h2>
              
              <div className="space-y-4">
                {!image ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload product image</p>
                      <p className="text-sm text-gray-500 mb-4">PNG, JPG up to 5MB</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="inline-block bg-[#7971ea] text-white px-6 py-2 rounded cursor-pointer hover:bg-[#5a50e5] transition"
                      >
                        {uploading ? 'Uploading...' : 'Choose File'}
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                      <Image
                        src={image.url}
                        alt="Product"
                        fill
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Product Variants */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Variants</h2>
              
              <div className="space-y-6">
                {/* Sizes */}
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Available Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`px-4 py-2 border rounded transition ${
                          formData.sizes.includes(size)
                            ? 'bg-[#7971ea] text-white border-[#7971ea]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#7971ea]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Available Colors</label>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorToggle(color)}
                        className={`px-4 py-2 border rounded transition ${
                          formData.colors.includes(color)
                            ? 'bg-[#7971ea] text-white border-[#7971ea]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#7971ea]'
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
          <div className="space-y-6">
            {/* Pricing & Stock */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Stock</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#7971ea]"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#7971ea]"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Category</h2>
              
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#7971ea]"
                required
              >
                <option value="clothing">Clothing</option>
                <option value="shoes">Shoes</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            {/* Product Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Status</h2>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#7971ea] border-gray-300 rounded focus:ring-[#7971ea]"
                />
                <div>
                  <span className="text-gray-900 font-medium">Featured Product</span>
                  <p className="text-sm text-gray-500">Show on homepage</p>
                </div>
              </label>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <button
                type="submit"
                disabled={saving || uploading}
                className="w-full bg-[#7971ea] text-white py-3 rounded font-medium hover:bg-[#5a50e5] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Creating...' : 'Create Product'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}