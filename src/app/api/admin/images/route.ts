import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const db = mongoose.connection.db;
        // @ts-ignore GridFSBucket typing is not exposed through mongoose
        const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'images' });

        const searchParams = request.nextUrl.searchParams;
        const section = searchParams.get('section');
        const slug = searchParams.get('slug');

        // Build query - exclude services images
        let query: Record<string, unknown>;

        // If slug is provided, search by slug
        if (slug) {
            query = { 
                'metadata.slug': slug,
                'metadata.section': { $nin: ['services-primary', 'services-gallery'] }
            };
        } else if (section) {
            // If a specific section is requested
            // Don't allow accessing services sections
            if (section === 'services-primary' || section === 'services-gallery') {
                return NextResponse.json({ error: 'Services images are not accessible' }, { status: 403 });
            }
            query = { 'metadata.section': section };
        } else {
            // Exclude services images when no specific section is requested
            query = {
                'metadata.section': { $nin: ['services-primary', 'services-gallery'] }
            };
        }

        const sortOrder: Record<string, 1 | -1> = { 'metadata.order': 1, uploadDate: -1 };

        const files = await bucket
            .find(query)
            .sort(sortOrder)
            .toArray();

        return NextResponse.json(files);
    } catch (error) {
        console.error('Fetch images error:', error);
        return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
    }
}
