import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { invalidateCache } from '@/lib/cache';

const BLOG_CACHE_KEY = 'blogs_all';

export async function GET() {
    try {
        await connectDB();
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        return NextResponse.json(blogs, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
    } catch (error) {
        console.error('Failed to fetch blogs:', error);
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}

export async function POST(request: Request) {
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

        const blog = await Blog.create(body);
        // Invalidate cache when new blog is created
        invalidateCache(BLOG_CACHE_KEY);
        return NextResponse.json(blog, { 
            status: 201,
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
            },
        });
    } catch (error) {
        console.error('Failed to create blog:', error);
        return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
    }
}

