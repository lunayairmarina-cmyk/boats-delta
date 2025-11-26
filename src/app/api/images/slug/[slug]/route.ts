import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const slug = params.slug?.toLowerCase();

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

        // @ts-expect-error Node stream is compatible with the Response body but lacks types
        return new Response(stream, {
            headers: {
                'Content-Type': (file as any).contentType || 'application/octet-stream',
                'Cache-Control': 'public, max-age=1800, stale-while-revalidate=900',
            },
        });
    } catch (error) {
        console.error(`Error serving slug image (${slug}):`, error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

