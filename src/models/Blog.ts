import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    email?: string;
  };
  image: string;
  imageId?: string;
  category: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    author: {
      name: {
        type: String,
        required: true,
      },
      email: String,
    },
    image: {
      type: String,
      required: [true, 'Blog image is required'],
    },
    imageId: {
      type: String,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'General',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    published: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug from title before validation
BlogSchema.pre('validate', async function () {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
});

// Index for faster queries
BlogSchema.index({ published: 1, createdAt: -1 });
BlogSchema.index({ category: 1, published: 1 });
BlogSchema.index({ title: 'text', content: 'text' });

export default mongoose.models.Blog ||
  mongoose.model<IBlog>('Blog', BlogSchema);
