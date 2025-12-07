import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

function normalizeSlug(value: string | null): string | undefined {
    if (!value) return undefined;
    const cleaned = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    return cleaned || undefined;
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection is not initialized.');
        }
        const bucket = new GridFSBucket(db, { bucketName: 'videos' });

        const searchParams = request.nextUrl.searchParams;
        const section = searchParams.get('section');
        const slug = searchParams.get('slug');

        let query: Record<string, unknown>;

        if (slug) {
            query = { 'metadata.slug': slug };
        } else if (section) {
            query = { 'metadata.section': section };
        } else {
            query = {};
        }

        const sortOrder: Record<string, 1 | -1> = { 'metadata.order': 1, uploadDate: -1 };

        const files = await bucket
            .find(query)
            .sort(sortOrder)
            .toArray();

        return NextResponse.json(files);
    } catch (error) {
        console.error('Fetch videos error:', error);
        return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
    }
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
        const bucket = new GridFSBucket(db, { bucketName: 'videos' });
        const filesCollection = db.collection<{ _id: mongoose.Types.ObjectId }>('videos.files');

        if (slugInput) {
            const existingFiles = await filesCollection
                .find<{ _id: mongoose.Types.ObjectId }>({ 'metadata.slug': slugInput })
                .toArray();
            await Promise.all(
                existingFiles.map(async (doc) => {
                    try {
                        await bucket.delete(doc._id);
                    } catch (err) {
                        console.error(`Failed to delete existing video for slug ${slugInput}`, err);
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

        const fileId = uploadStream.id.toString();

        return NextResponse.json({ fileId, message: 'Video uploaded successfully' });
    } catch (error) {
        console.error('Upload video error:', error);
        return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
    }
}










