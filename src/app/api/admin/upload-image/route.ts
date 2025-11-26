import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

function normalizeSlug(value: string | null): string | undefined {
    if (!value) return undefined;
    const cleaned = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    return cleaned || undefined;
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const categoryInput = (formData.get('category') as string) || 'uncategorized';
        const sectionInput = (formData.get('section') as string) || undefined;
        const slugInput = normalizeSlug(formData.get('slug') as string | null);
        const orderInput = formData.get('order') ? parseInt(formData.get('order') as string, 10) : undefined;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection is not initialized.');
        }
        // GridFSBucket typing is not exposed through mongoose
        const bucket = new mongoose.mongo.GridFSBucket(db as any, { bucketName: 'images' });
        const filesCollection = db.collection('images.files');

        if (slugInput) {
            const existingFiles = await filesCollection
                .find<{ _id: mongoose.Types.ObjectId }>({ 'metadata.slug': slugInput })
                .toArray();
            await Promise.all(
                existingFiles.map(async (doc) => {
                    try {
                        await bucket.delete(doc._id);
                    } catch (err) {
                        console.error(`Failed to delete existing image for slug ${slugInput}`, err);
                    }
                }),
            );
        }

        const uploadStream = bucket.openUploadStream(file.name, {
            metadata: {
                category: categoryInput,
                section: sectionInput,
                contentType: file.type,
                slug: slugInput,
                order: orderInput,
                source: 'admin-upload',
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
            slug: slugInput,
            section: sectionInput,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
