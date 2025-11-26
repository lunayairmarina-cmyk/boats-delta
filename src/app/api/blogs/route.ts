import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog, { IBlog } from '@/models/Blog';
import { getCache, setCache } from '@/lib/cache';

const BLOG_CACHE_KEY = 'blogs_all';
const BLOG_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days (1 month)

type BlogRecord = {
    _id: string;
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
    createdAt: string;
    updatedAt: string;
};

type LeanBlogLike = BlogRecord & {
    _id: string | { toString: () => string };
    createdAt?: string | Date;
    updatedAt?: string | Date;
};

function normalizeBlogs(data: Array<IBlog | LeanBlogLike>): BlogRecord[] {
    return data.map((item) => {
        const source =
            typeof (item as IBlog).toObject === 'function'
                ? ((item as IBlog).toObject() as LeanBlogLike)
                : (item as LeanBlogLike);

        const id =
            typeof source._id === 'string'
                ? source._id
                : (source as any)._id?.toString?.() ?? '';

        const createdAt =
            (source as any).createdAt instanceof Date
                ? (source as any).createdAt.toISOString()
                : (source as any).createdAt;

        const updatedAt =
            (source as any).updatedAt instanceof Date
                ? (source as any).updatedAt.toISOString()
                : (source as any).updatedAt;

        return {
            _id: id,
            title: source.title,
            titleAr: source.titleAr,
            excerpt: source.excerpt,
            excerptAr: source.excerptAr,
            content: source.content,
            contentAr: source.contentAr,
            featuredImage: source.featuredImage,
            category: source.category,
            slug: source.slug,
            author: source.author,
            authorAr: source.authorAr,
            published: source.published,
            tags: source.tags,
            createdAt,
            updatedAt,
        };
    });
}

function localizeBlogs(blogs: BlogRecord[], lang: string | null) {
    if (lang !== 'ar') {
        return blogs;
    }

    return blogs.map((blog) => ({
        ...blog,
        title: blog.titleAr ?? blog.title,
        excerpt: blog.excerptAr ?? blog.excerpt,
        content: blog.contentAr ?? blog.content,
        author: blog.authorAr ?? blog.author,
    }));
}

export async function GET(request: NextRequest) {
    try {
        const preferredLang = request.nextUrl.searchParams.get('lang');
        const includeUnpublished = request.nextUrl.searchParams.get('includeUnpublished') === 'true';
        
        // Never cache admin requests
        if (includeUnpublished) {
            await connectDB();
            const blogs = await Blog.find({})
                .sort({ createdAt: -1 })
                .lean();
            const normalized = normalizeBlogs(blogs);
            return NextResponse.json(localizeBlogs(normalized, preferredLang), {
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            });
        }

        // Check in-memory cache for published blogs
        const cached = getCache<BlogRecord[]>(BLOG_CACHE_KEY);
        if (cached) {
            return NextResponse.json(localizeBlogs(cached, preferredLang), {
                headers: {
                    'Cache-Control': 'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400',
                    'CDN-Cache-Control': 'public, max-age=2592000',
                },
            });
        }

        await connectDB();
        
        const blogs = await Blog.find({ published: true })
            .sort({ createdAt: -1 })
            .lean();

        const normalized = normalizeBlogs(blogs);
        
        // Cache in memory
        setCache(BLOG_CACHE_KEY, normalized, BLOG_CACHE_TTL_MS);

        return NextResponse.json(localizeBlogs(normalized, preferredLang), {
            headers: {
                'Cache-Control': 'public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400',
                'CDN-Cache-Control': 'public, max-age=2592000',
            },
        });
    } catch (error) {
        console.error('Failed to fetch blogs:', error);
        return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
    }
}

