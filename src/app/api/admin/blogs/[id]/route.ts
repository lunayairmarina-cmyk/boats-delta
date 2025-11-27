import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';
import { invalidateCache } from '@/lib/cache';

const BLOG_CACHE_KEY = 'blogs_all';

const slugify = (value: string) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

type BlogUpdatePayload = Partial<
    Pick<
        IBlog,
        | 'title'
        | 'titleAr'
        | 'excerpt'
        | 'excerptAr'
        | 'content'
        | 'contentAr'
        | 'featuredImage'
        | 'category'
        | 'author'
        | 'authorAr'
        | 'published'
        | 'tags'
    >
> & {
    slug?: string;
};

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const body = (await request.json()) as BlogUpdatePayload;

        const normalizedSlug = body.slug ?? (body.title ? slugify(body.title) : undefined);

        const updatedBlog = await Blog.findByIdAndUpdate(
            params.id,
            {
                title: body.title,
                titleAr: body.titleAr,
                excerpt: body.excerpt,
                excerptAr: body.excerptAr,
                content: body.content,
                contentAr: body.contentAr,
                featuredImage: body.featuredImage,
                category: body.category,
                slug: normalizedSlug,
                author: body.author,
                authorAr: body.authorAr,
                published: body.published ?? false,
                tags: body.tags ?? [],
                updatedAt: new Date(),
            },
            { new: true, runValidators: false }
        );

        if (!updatedBlog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        invalidateCache(BLOG_CACHE_KEY);
        return NextResponse.json(updatedBlog, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        });
    } catch (error) {
        console.error('Failed to update blog:', error);
        return NextResponse.json(
            {
                error: 'Failed to update blog',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const deletedBlog = await Blog.findByIdAndDelete(params.id);

        if (!deletedBlog) {
            return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
        }

        invalidateCache(BLOG_CACHE_KEY);
        return NextResponse.json(
            { success: true },
            {
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                },
            }
        );
    } catch (error) {
        console.error('Failed to delete blog:', error);
        return NextResponse.json(
            {
                error: 'Failed to delete blog',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

