import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  imageId?: string; // ImageKit file ID for deletion
  category: 'clothing' | 'shoes' | 'accessories';
  sizes?: string[];
  colors?: string[];
  stock: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
    imageId: {
      type: String,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['clothing', 'shoes', 'accessories'],
    },
    sizes: [
      {
        type: String,
      },
    ],
    colors: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ProductSchema.index({ category: 1, featured: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);