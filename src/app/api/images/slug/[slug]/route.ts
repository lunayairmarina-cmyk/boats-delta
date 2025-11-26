import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const slug = params.slug?.toLowerCase();
    
    // Extract query parameters for cache busting (v parameter is ignored but helps with cache invalidation)
    const url = new URL(request.url);
    const versionParam = url.searchParams.get('v');

    if (!slug) {
        return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    try {
        await connectDB();
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection is not initialized.');
        }
        const bucket = new mongoose.mongo.GridFSBucket(db as any, { bucketName: 'images' });
        const filesCollection = db.collection('images.files');

        const [file] = await filesCollection
            .find({ 'metadata.slug': slug })
            .sort({ uploadDate: -1 })
            .limit(1)
            .toArray();

        if (!file) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        const stream = bucket.openDownloadStream((file as any)._id);
        
        // Add cache busting based on upload date
        const uploadDate = file.uploadDate ? new Date(file.uploadDate).getTime() : Date.now();
        const etag = `"${uploadDate}"`;
        const lastModified = file.uploadDate ? new Date(file.uploadDate).toUTCString() : new Date().toUTCString();

        // Check if client has the latest version
        const ifNoneMatch = request.headers.get('if-none-match');
        const ifModifiedSince = request.headers.get('if-modified-since');
        
        if (ifNoneMatch === etag || ifModifiedSince === lastModified) {
            return new Response(null, {
                status: 304,
                headers: {
                    'ETag': etag,
                    'Last-Modified': lastModified,
                    'Cache-Control': 'public, max-age=0, must-revalidate',
                },
            });
        }

        // @ts-expect-error Node stream is compatible with the Response body but lacks types
        return new Response(stream, {
            headers: {
                'Content-Type': (file as any).contentType || 'application/octet-stream',
                'Cache-Control': 'public, max-age=0, must-revalidate, no-cache',
                'ETag': etag,
                'Last-Modified': lastModified,
                'Pragma': 'no-cache',
            },
        });
    } catch (error) {
        console.error(`Error serving slug image (${slug}):`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

