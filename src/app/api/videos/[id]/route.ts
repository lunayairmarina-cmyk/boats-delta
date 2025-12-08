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
        const fileLength = typeof file.length === 'number' ? file.length : undefined;
        const range = request.headers.get('range');
        const contentType = file.contentType || 'video/mp4';
        const uploadDate = file.uploadDate ? new Date(file.uploadDate).getTime() : Date.now();
        const etag = `"${uploadDate}-${params.id}"`;
        const lastModified = file.uploadDate ? new Date(file.uploadDate).toUTCString() : new Date().toUTCString();
        // 1 year cache (31536000 seconds)
        const maxAge = 31536000;

        // Support byte-range requests so browsers can properly stream/seek
        if (range && fileLength !== undefined) {
            const bytesPrefix = 'bytes=';
            if (!range.startsWith(bytesPrefix)) {
                return NextResponse.json({ error: 'Invalid Range' }, { status: 416 });
            }

            const rangeParts = range.replace(bytesPrefix, '').split('-');
            const start = parseInt(rangeParts[0], 10);
            const end = rangeParts[1] ? parseInt(rangeParts[1], 10) : fileLength - 1;

            if (Number.isNaN(start) || Number.isNaN(end) || start < 0 || end >= fileLength || start > end) {
                return NextResponse.json({ error: 'Invalid Range' }, { status: 416 });
            }

            const chunkSize = end - start + 1;
            const stream = bucket.openDownloadStream(_id, { start, end });

            // @ts-expect-error Node stream is compatible with the Response body but lacks types
            return new Response(stream, {
                status: 206,
                headers: {
                    'Content-Range': `bytes ${start}-${end}/${fileLength}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunkSize.toString(),
                    'Content-Type': contentType,
                    'Cache-Control': `public, max-age=${maxAge}, immutable`,
                    'ETag': etag,
                    'Last-Modified': lastModified,
                },
            });
        }

        const stream = bucket.openDownloadStream(_id);

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
                'Content-Type': contentType,
                'Accept-Ranges': 'bytes',
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

