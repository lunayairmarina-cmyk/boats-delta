import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import { invalidateCache } from '@/lib/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

type VideoFileDoc = {
    _id: mongoose.Types.ObjectId;
    filename: string;
    metadata?: {
        section?: string;
        slug?: string;
        category?: string;
        contentType?: string;
        order?: number;
    };
};

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection is not initialized.');
        }
        const bucket = new GridFSBucket(db, { bucketName: 'videos' });

        await bucket.delete(new mongoose.Types.ObjectId(params.id));

        // Invalidate video cache to reflect deletion immediately
        invalidateCache(['videos', 'videos-list', `video-${params.id}`]);

        return NextResponse.json({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Delete video error:', error);
        return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
    }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection is not initialized.');
        }
        const bucket = new GridFSBucket(db, { bucketName: 'videos' });
        const filesCollection = db.collection<VideoFileDoc>('videos.files');

        const existingFile = await filesCollection.findOne({
            _id: new mongoose.Types.ObjectId(params.id)
        });

        if (!existingFile) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Upload the new file first, then delete old to avoid losing video on failure
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = existingFile.filename || file.name;
        const uploadStream = bucket.openUploadStream(filename, {
            metadata: {
                ...existingFile.metadata,
                contentType: file.type,
            },
        });

        uploadStream.end(buffer);

        await new Promise((resolve, reject) => {
            uploadStream.on('finish', resolve);
            uploadStream.on('error', reject);
        });

        // Delete the old file after successful upload
        await bucket.delete(new mongoose.Types.ObjectId(params.id));

        const newFileId = uploadStream.id.toString();

        // Invalidate video cache to reflect update immediately
        invalidateCache(['videos', 'videos-list', `video-${params.id}`, `video-${newFileId}`]);

        return NextResponse.json({
            fileId: newFileId,
            message: 'Video updated successfully',
        });
    } catch (error) {
        console.error('Update video error:', error);
        return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
    }
}

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection is not initialized.');
        }
        const filesCollection = db.collection<VideoFileDoc>('videos.files');

        const body = await request.json();
        const { order, section, poster } = body;

        const updateFields: Record<string, unknown> = {};
        const unsetFields: Record<string, unknown> = {};

        if (typeof order === 'number') {
            updateFields['metadata.order'] = order;
        }
        if (section) {
            updateFields['metadata.section'] = section;
        }
        // Handle poster - can be set or removed (null)
        if (poster !== undefined) {
            if (poster === null) {
                unsetFields['metadata.poster'] = '';
            } else {
                updateFields['metadata.poster'] = poster;
            }
        }

        const updateQuery: Record<string, unknown> = {};
        if (Object.keys(updateFields).length > 0) {
            updateQuery.$set = updateFields;
        }
        if (Object.keys(unsetFields).length > 0) {
            updateQuery.$unset = unsetFields;
        }

        if (Object.keys(updateQuery).length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
        }

        await filesCollection.updateOne(
            { _id: new mongoose.Types.ObjectId(params.id) },
            updateQuery
        );

        // Invalidate video cache to reflect metadata update immediately
        invalidateCache(['videos', 'videos-list', `video-${params.id}`]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update video metadata error:', error);
        return NextResponse.json({ error: 'Failed to update video metadata' }, { status: 500 });
    }
}



















