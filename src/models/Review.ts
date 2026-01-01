import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
    user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
            maxlength: [500, 'Comment cannot exceed 500 characters'],
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate reviews from same user on same product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

const Review =
    (mongoose.models.Review as Model<IReview>) ||
    mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
