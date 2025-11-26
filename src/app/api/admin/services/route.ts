import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service from '@/models/Service';
import { invalidateCache } from '@/lib/cache';

const SERVICE_CACHE_KEY = 'services_all';

export async function GET() {
    try {
        await connectDB();
        const services = await Service.find({}).sort({ createdAt: -1 });
        return NextResponse.json(services);
    } catch (error) {
        console.error('Failed to fetch services:', error);
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        console.log('POST request body for new service:', JSON.stringify(body, null, 2));
        console.log('Gallery in body:', body.gallery);

        const service = await Service.create(body);

        console.log('Created service:', JSON.stringify(service, null, 2));

        invalidateCache(SERVICE_CACHE_KEY);
        return NextResponse.json(service, { status: 201 });
    } catch (error) {
        console.error('Failed to create service:', error);
        return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }
}
