import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/models/Service';
import { invalidateCache } from '@/lib/cache';

const SERVICE_CACHE_KEY = 'services_all';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const body = await request.json();
        console.log('PUT request body for service update:', JSON.stringify(body, null, 2));

        // Use raw MongoDB driver to bypass Mongoose validation
        const db = (Service as any).db;
        const collection = db.collection('services');

        const updateResult = await collection.updateOne(
            { _id: new (Service as any).base.Types.ObjectId(params.id) },
            {
                $set: {
                    title: body.title,
                    titleAr: body.titleAr,
                    description: body.description,
                    descriptionAr: body.descriptionAr,
                    image: body.image,
                    gallery: body.gallery || [],
                    features: body.features || [],
                    featuresAr: body.featuresAr || [],
                    benefits: body.benefits || [],
                    price: body.price,
                    priceAr: body.priceAr,
                    updatedAt: new Date(),
                }
            }
        );

        console.log('MongoDB update result:', updateResult);

        if (updateResult.matchedCount === 0) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        // Reload the service directly from MongoDB
        const updatedService = await collection.findOne({
            _id: new (Service as any).base.Types.ObjectId(params.id)
        });

        console.log('After update - reloaded service from MongoDB:', JSON.stringify(updatedService, null, 2));

        invalidateCache(SERVICE_CACHE_KEY);
        return NextResponse.json(updatedService);
    } catch (error) {
        console.error('Failed to update service:', error);
        return NextResponse.json({
            error: 'Failed to update service',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const service = await Service.findByIdAndDelete(params.id);
        if (!service) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }
        invalidateCache(SERVICE_CACHE_KEY);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete service:', error);
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
