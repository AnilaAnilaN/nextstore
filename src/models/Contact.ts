import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  firstName: string;
  lastName: string;
  email: string;
  subject?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
    },
    adminNotes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

ContactSchema.index({ status: 1, createdAt: -1 });
ContactSchema.index({ email: 1 });

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
