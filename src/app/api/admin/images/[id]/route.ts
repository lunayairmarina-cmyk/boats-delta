import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import mongoose from 'mongoose';

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const db = mongoose.connection.db;
        // @ts-expect-error GridFSBucket typing is not exposed through mongoose
        const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'images' });

        await bucket.delete(new mongoose.Types.ObjectId(params.id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete image error:', error);
        return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
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
        const filesCollection = db.collection('images.files');

        const body = await request.json();
        const { order, section } = body;

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
