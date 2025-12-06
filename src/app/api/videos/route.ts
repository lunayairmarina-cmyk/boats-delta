import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

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







