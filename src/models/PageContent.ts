import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPageContent extends Document {
    key: string; // 'about', 'contact', 'home_hero', etc.
    content: any; // Flexible content object
    updatedAt: Date;
}

const PageContentSchema = new Schema<IPageContent>(
    {
        key: { type: String, required: true, unique: true },
        content: { type: Schema.Types.Mixed, required: true },
    },
    { timestamps: true }
);

const PageContent =
    (mongoose.models.PageContent as Model<IPageContent>) ||
    mongoose.model<IPageContent>('PageContent', PageContentSchema);

export default PageContent;
