import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import { invalidateCache } from '@/lib/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

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
        const language = searchParams.get('language');

        let query: Record<string, unknown>;

        if (slug) {
            query = { 'metadata.slug': slug };
        } else if (section) {
            query = { 'metadata.section': section };
        } else {
            query = {};
        }

        if (language) {
            query['metadata.language'] = language;
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
        const languageInput = ((formData.get('language') as string) || 'en').toLowerCase();
        const orderInput = formData.get('order') ? parseInt(formData.get('order') as string, 10) : undefined;

        const cloudinaryUrl = formData.get('cloudinaryUrl') as string | null;

        if (!file && !cloudinaryUrl) {
            return NextResponse.json({ error: 'No file or Cloudinary URL provided' }, { status: 400 });
        }

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

        // Variable to hold the upload stream
        let uploadStream;

        if (cloudinaryUrl) {
            // For Cloudinary, we create a placeholder zero-byte file or small text file
            // so we have a GridFS entry to hang metadata on
            const placeholderBuffer = Buffer.from('cloudinary-linked-video');
            uploadStream = bucket.openUploadStream('cloudinary-placeholder', {
                metadata: {
                    category: categoryInput,
                    section: sectionInput,
                    contentType: 'video/mp4', // specialized type or generic
                    slug: slugInput,
                    language: languageInput,
                    order: orderInput,
                    source: 'cloudinary',
                    cloudinaryUrl: cloudinaryUrl,
                },
            });
            uploadStream.end(placeholderBuffer);
        } else {
            const buffer = Buffer.from(await file.arrayBuffer());
            uploadStream = bucket.openUploadStream(file.name, {
                metadata: {
                    category: categoryInput,
                    section: sectionInput,
                    contentType: file.type,
                    slug: slugInput,
                    language: languageInput,
                    order: orderInput,
                    source: 'admin-upload',
                },
            });
            uploadStream.end(buffer);
        }

        await new Promise((resolve, reject) => {
            uploadStream.on('finish', resolve);
            uploadStream.on('error', reject);
        });

        const fileId = uploadStream.id.toString();

        // Invalidate video cache to ensure new video is visible immediately
        invalidateCache(['videos', 'videos-list', `video-${fileId}`]);

        return NextResponse.json({ fileId, message: 'Video uploaded successfully' });
    } catch (error) {
        console.error('Upload video error:', error);
        return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
    }
}
























