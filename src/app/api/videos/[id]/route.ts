import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import { GridFSBucket, GridFSFile } from 'mongodb';

type StoredGridFile = GridFSFile & { contentType?: string };

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection is not initialized.');
        }
        const bucket = new GridFSBucket(db, { bucketName: 'videos' });

        const _id = new mongoose.Types.ObjectId(params.id);

        const files = (await bucket.find({ _id }).toArray()) as StoredGridFile[];
        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 });
        }

        const file = files[0];
        const stream = bucket.openDownloadStream(_id);
        
        const uploadDate = file.uploadDate ? new Date(file.uploadDate).getTime() : Date.now();
        const etag = `"${uploadDate}-${params.id}"`;
        const lastModified = file.uploadDate ? new Date(file.uploadDate).toUTCString() : new Date().toUTCString();
        
        // 1 year cache (31536000 seconds)
        const maxAge = 31536000;

        const ifNoneMatch = request.headers.get('if-none-match');
        const ifModifiedSince = request.headers.get('if-modified-since');
        
        if (ifNoneMatch === etag || ifModifiedSince === lastModified) {
            return new Response(null, {
                status: 304,
                headers: {
                    'ETag': etag,
                    'Last-Modified': lastModified,
                    'Cache-Control': `public, max-age=${maxAge}, immutable`,
                },
            });
        }

        // @ts-expect-error Node stream is compatible with the Response body but lacks types
        return new Response(stream, {
            headers: {
                'Content-Type': file.contentType || 'video/mp4',
                'Cache-Control': `public, max-age=${maxAge}, immutable`,
                'ETag': etag,
                'Last-Modified': lastModified,
            },
        });

    } catch (error) {
        console.error('Error serving video:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

