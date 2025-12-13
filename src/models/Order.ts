import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: IOrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Generate unique order number
OrderSchema.pre<IOrder>('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.models.Order.countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ 'customer.email': 1 });
OrderSchema.index({ status: 1 });

const Order =
  (mongoose.models.Order as Model<IOrder>) ||
  mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
