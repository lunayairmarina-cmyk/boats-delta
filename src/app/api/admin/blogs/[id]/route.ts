import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { invalidateCache } from '@/lib/cache';

const BLOG_CACHE_KEY = 'blogs_all';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const body = await request.json();

        // Generate slug from title if not provided
        if (!body.slug && body.title) {
            body.slug = body.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }

        const db = (Blog as any).db;
        const collection = db.collection('blogs');

        const updateResult = await collection.updateOne(
            { _id: new (Blog as any).base.Types.ObjectId(params.id) },
            {
                $set: {
                    title: body.title,
                    titleAr: body.titleAr,
                    excerpt: body.excerpt,
                    excerptAr: body.excerptAr,
                    content: body.content,
                    contentAr: body.contentAr,
                    featuredImage: body.featuredImage,
                    category: body.category,
                    slug: body.slug,
                    author: body.author,
                    authorAr: body.authorAr,
                    published: body.published ?? false,
                    tags: body.tags || [],
                    updatedAt: new Date(),
                }
            }
        );

        if (updateResult.matchedCount === 0) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        const updatedBlog = await collection.findOne({
            _id: new (Blog as any).base.Types.ObjectId(params.id)
        });

        // Invalidate cache when blog is updated
        invalidateCache(BLOG_CACHE_KEY);
        return NextResponse.json(updatedBlog, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        });
    } catch (error) {
        console.error('Failed to update blog:', error);
        return NextResponse.json({
            error: 'Failed to update blog',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const blog = await Blog.findByIdAndDelete(params.id);
        if (!blog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }
        // Invalidate cache when blog is deleted
        invalidateCache(BLOG_CACHE_KEY);
        return NextResponse.json({ success: true }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        });
    } catch (error) {
        console.error('Failed to delete blog:', error);
        return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
    }
}

