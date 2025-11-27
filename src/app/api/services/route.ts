import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Service, { IService } from '@/models/Service';
import { getCache, setCache } from '@/lib/cache';

const SERVICE_CACHE_KEY = 'services_all';
const SERVICE_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

type ServiceRecord = {
    _id: string;
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    image: string;
    price?: string;
    priceAr?: string;
    slug?: string;
    category?: string;
    createdAt?: string;
};

type LeanServiceLike = Omit<ServiceRecord, '_id' | 'createdAt'> & {
    _id: string | { toString: () => string };
    createdAt?: string | Date;
    priceAr?: string;
    category?: string;
};

const toServiceId = (value: LeanServiceLike['_id']): string =>
    typeof value === 'string' ? value : value?.toString?.() ?? '';

const toServiceDate = (value?: string | Date): string | undefined =>
    value instanceof Date ? value.toISOString() : value;

function normalizeServices(data: Array<IService | LeanServiceLike>): ServiceRecord[] {
    return data.map((item) => {
        const source: LeanServiceLike =
            typeof (item as IService).toObject === 'function'
                ? ((item as IService).toObject() as LeanServiceLike)
                : (item as LeanServiceLike);

        return {
            _id: toServiceId(source._id),
            title: source.title,
            titleAr: source.titleAr,
            description: source.description,
            descriptionAr: source.descriptionAr,
            image: source.image,
            price: source.price,
            priceAr: source.priceAr,
            slug: source.slug,
            category: source.category,
            createdAt: toServiceDate(source.createdAt),
        };
    });
}

function localizeServices(services: ServiceRecord[], lang: string | null) {
    if (lang !== 'ar') {
        return services;
    }

    return services.map((service) => ({
        ...service,
        title: service.titleAr ?? service.title,
        description: service.descriptionAr ?? service.description,
        price: service.priceAr ?? service.price,
    }));
}

export async function GET(request: NextRequest) {
    try {
        const preferredLang = request.nextUrl.searchParams.get('lang');
        const cached = getCache<ServiceRecord[]>(SERVICE_CACHE_KEY);

        console.log('Fetching services - cached:', !!cached);

        if (cached) {
            console.log('Returning cached services:', cached.length);
            return NextResponse.json(localizeServices(cached, preferredLang));
        }

        await connectDB();
        const services = await Service.find({}).sort({ createdAt: -1 }).lean();

        console.log('Fetched services from DB:', services.length);
        console.log('First service:', services[0]);

        const normalized = normalizeServices(services);
        setCache(SERVICE_CACHE_KEY, normalized, SERVICE_CACHE_TTL_MS);

        return NextResponse.json(localizeServices(normalized, preferredLang));
    } catch (error) {
        console.error('Failed to fetch public services:', error);
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}
