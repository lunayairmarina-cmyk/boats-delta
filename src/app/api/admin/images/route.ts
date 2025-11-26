import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const db = mongoose.connection.db;
        // @ts-expect-error GridFSBucket typing is not exposed through mongoose
        const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'images' });

        const searchParams = request.nextUrl.searchParams;
        const section = searchParams.get('section');

        const query = section ? { 'metadata.section': section } : {};
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
