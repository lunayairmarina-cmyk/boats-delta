import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

interface ImageFileDoc {
    _id: mongoose.Types.ObjectId;
    filename?: string;
    metadata?: {
        section?: string;
        slug?: string;
        order?: number;
        [key: string]: unknown;
    };
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection is not initialized.');
        }
        const bucket = new GridFSBucket(db, { bucketName: 'images' });

        await bucket.delete(new mongoose.Types.ObjectId(params.id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete image error:', error);
        return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
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
        const bucket = new GridFSBucket(db, { bucketName: 'images' });
        const filesCollection = db.collection<ImageFileDoc>('images.files');

        // Get the existing file metadata
        const existingFile = await filesCollection.findOne({
            _id: new mongoose.Types.ObjectId(params.id)
        });

        if (!existingFile) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        // Check if this is a services image (should not be replaceable)
        const section = existingFile.metadata?.section;
        if (section === 'services-primary' || section === 'services-gallery') {
            return NextResponse.json({ error: 'Services images cannot be replaced' }, { status: 403 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Delete the old file
        await bucket.delete(new mongoose.Types.ObjectId(params.id));

        // Upload the new file with the same metadata and slug (so slug lookup still works)
        // Use the same filename to ensure consistency
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = existingFile.filename || file.name;
        const uploadStream = bucket.openUploadStream(filename, {
            metadata: {
                ...existingFile.metadata,
                contentType: file.type,
                source: 'admin-replace',
                updatedAt: new Date().toISOString(), // Add timestamp for cache busting
                // Ensure slug is preserved
                slug: existingFile.metadata?.slug,
            },
        });

        uploadStream.end(buffer);

        await new Promise((resolve, reject) => {
            uploadStream.on('finish', resolve);
            uploadStream.on('error', reject);
        });

        return NextResponse.json({
            success: true,
            fileId: uploadStream.id,
            filename: file.name,
            slug: existingFile.metadata?.slug,
        });
    } catch (error) {
        console.error('Replace image error:', error);
        return NextResponse.json({ error: 'Failed to replace image' }, { status: 500 });
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
        const filesCollection = db.collection<ImageFileDoc>('images.files');

        // Check if this is a services image
        const existingFile = await filesCollection.findOne({
            _id: new mongoose.Types.ObjectId(params.id)
        });

        if (existingFile) {
            const currentSection = existingFile.metadata?.section;
            // Prevent modifying services images
            if (currentSection === 'services-primary' || currentSection === 'services-gallery') {
                return NextResponse.json({ error: 'Services images cannot be modified' }, { status: 403 });
            }
        }

        const body = await request.json();
        const { order, section } = body;

        // Prevent changing section to services sections
        if (section && (section === 'services-primary' || section === 'services-gallery')) {
            return NextResponse.json({ error: 'Cannot change section to services sections' }, { status: 403 });
        }

        const updateFields: Record<string, unknown> = {};
        if (typeof order === 'number') {
            updateFields['metadata.order'] = order;
        }
        if (section) {
            updateFields['metadata.section'] = section;
        }

        if (Object.keys(updateFields).length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
        }

        await filesCollection.updateOne(
            { _id: new mongoose.Types.ObjectId(params.id) },
            { $set: updateFields }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update image error:', error);
        return NextResponse.json({ error: 'Failed to update image' }, { status: 500 });
    }
}
