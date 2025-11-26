import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const db = mongoose.connection.db;
        // @ts-ignore GridFSBucket typing is not exposed through mongoose
        const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'images' });

        const _id = new mongoose.Types.ObjectId(params.id);

        const files = await bucket.find({ _id }).toArray();
        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        const file = files[0] as any;
        const stream = bucket.openDownloadStream(_id);
        
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
                'Content-Type': file.contentType || 'application/octet-stream',
                'Cache-Control': 'public, max-age=0, must-revalidate, no-cache',
                'ETag': etag,
                'Last-Modified': lastModified,
                'Pragma': 'no-cache',
            },
        });

    } catch (error) {
        console.error('Error serving image:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
