import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    titleAr?: string;
    excerpt: string;
    excerptAr?: string;
    content: string;
    contentAr?: string;
    featuredImage?: string;
    category?: string;
    slug: string;
    author?: string;
    authorAr?: string;
    published: boolean;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
    {
        title: { type: String, required: true },
        titleAr: { type: String },
        excerpt: { type: String, required: true },
        excerptAr: { type: String },
        content: { type: String, required: true },
        contentAr: { type: String },
        featuredImage: { type: String },
        category: { type: String },
        slug: { type: String, required: true, unique: true },
        author: { type: String, default: 'Lunier Marina Team' },
        authorAr: { type: String, default: 'فريق لونيير مارينا' },
        published: { type: Boolean, default: false },
        tags: [{ type: String }],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

// Create indexes for better query performance
BlogSchema.index({ slug: 1 });
BlogSchema.index({ published: 1, createdAt: -1 });
BlogSchema.index({ category: 1 });

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

