import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComment extends Document {
    user: mongoose.Types.ObjectId;
    blog: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        blog: {
            type: Schema.Types.ObjectId,
            ref: 'Blog',
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: [1000, 'Comment cannot exceed 1000 characters'],
        },
    },
    {
        timestamps: true,
    }
);

const Comment =
    (mongoose.models.Comment as Model<IComment>) ||
    mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
