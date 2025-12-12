import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service, { IService } from '@/models/Service';
import { invalidateCache } from '@/lib/cache';

const SERVICE_CACHE_KEY = 'services_all';

type ServiceUpdatePayload = Partial<
    Pick<
        IService,
        | 'title'
        | 'titleAr'
        | 'description'
        | 'descriptionAr'
        | 'image'
        | 'gallery'
        | 'features'
        | 'featuresAr'
        | 'benefits'
        | 'price'
        | 'priceAr'
        | 'relatedServices'
    >
>;

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const body = (await request.json()) as ServiceUpdatePayload;

        const updatedService = await Service.findByIdAndUpdate(
            params.id,
            {
                title: body.title,
                titleAr: body.titleAr,
                description: body.description,
                descriptionAr: body.descriptionAr,
                image: body.image,
                gallery: body.gallery ?? [],
                features: body.features ?? [],
                featuresAr: body.featuresAr ?? [],
                benefits: body.benefits ?? [],
                relatedServices: body.relatedServices ?? [],
                price: body.price,
                priceAr: body.priceAr,
                updatedAt: new Date(),
            },
            { new: true, runValidators: false }
        );

        if (!updatedService) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        invalidateCache(SERVICE_CACHE_KEY);
        return NextResponse.json(updatedService);
    } catch (error) {
        console.error('Failed to update service:', error);
        return NextResponse.json(
            {
                error: 'Failed to update service',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
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
