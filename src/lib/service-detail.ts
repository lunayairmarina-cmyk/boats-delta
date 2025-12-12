import connectDB from '@/lib/db';
import Service, { IService, IServiceBenefit } from '@/models/Service';
import { Types } from 'mongoose';

export type LocalizedText = {
    en: string;
    ar: string;
};

export type ServiceBenefitDto = {
    id: string;
    icon?: string | null;
    title: LocalizedText;
    description: LocalizedText;
};

export type ServiceGalleryDto = {
    id: string;
    url: string;
    caption: LocalizedText;
};

export type ServiceSummaryDto = {
    id: string;
    slug: string;
    title: LocalizedText;
    description: LocalizedText;
    image?: string | null;
    price?: string | null;
    priceAr?: string | null;
};

export type ServiceDetailDto = {
    id: string;
    slug: string;
    title: LocalizedText;
    description: LocalizedText;
    longDescription: LocalizedText;
    features: {
        en: string[];
        ar: string[];
    };
    benefits: ServiceBenefitDto[];
    gallery: ServiceGalleryDto[];
    mainImage?: string | null;
    price?: string | null;
    priceAr?: string | null;
    category?: string | null;
    meta: {
        title: string;
        description: string;
        image?: string | null;
    };
};

export type ServiceDetailResponse = {
    service: ServiceDetailDto;
    relatedServices: ServiceSummaryDto[];
};

const imageUrl = (id?: string | null) => (id ? `/api/images/${id}` : null);

const resolveMedia = (value?: string | null) => {
    if (!value) {
        return null;
    }
    if (value.startsWith('http') || value.startsWith('/')) {
        return value;
    }
    return imageUrl(value);
};

const localizedPair = (en?: string, ar?: string, fallback?: string): LocalizedText => ({
    en: en ?? fallback ?? '',
    ar: ar ?? en ?? fallback ?? '',
});

function sortGallery(gallery: IService['gallery'] = []) {
    return [...gallery].sort((a, b) => {
        const orderA = a.order ?? 0;
        const orderB = b.order ?? 0;
        if (orderA === orderB) {
            return a.fileId.localeCompare(b.fileId);
        }
        return orderA - orderB;
    });
}

function normalizeService(service: IService): ServiceDetailDto {
    const plain = service.toObject();
    const id = plain._id.toString();

    const gallery = sortGallery(plain.gallery).map((item) => ({
        id: item.fileId,
        url: imageUrl(item.fileId) ?? '',
        caption: localizedPair(item.caption, item.captionAr, plain.title),
    }));

    const benefits = (plain.benefits ?? []).map((benefit: IServiceBenefit, index: number) => ({
        id: `${id}-benefit-${index}`,
        icon: resolveMedia(benefit.icon),
        title: localizedPair(benefit.title, benefit.titleAr, plain.title),
        description: localizedPair(benefit.description, benefit.descriptionAr, plain.description),
    }));

    const featuresEn = plain.features && plain.features.length > 0 ? plain.features : [];
    const featuresAr =
        plain.featuresAr && plain.featuresAr.length > 0
            ? plain.featuresAr
            : featuresEn;

    return {
        id,
        slug: plain.slug || id,
        title: localizedPair(plain.title, plain.titleAr),
        description: localizedPair(plain.description, plain.descriptionAr),
        longDescription: localizedPair(
            plain.detailedDescription ?? plain.description,
            plain.detailedDescriptionAr ?? plain.descriptionAr,
            plain.description
        ),
        features: {
            en: featuresEn,
            ar: featuresAr,
        },
        benefits,
        gallery,
        mainImage: resolveMedia(plain.image),
        price: plain.price ?? null,
        priceAr: plain.priceAr ?? null,
        category: plain.category ?? null,
        meta: {
            title: plain.metaTitle ?? plain.title,
            description: plain.metaDescription ?? plain.description,
            image: resolveMedia(plain.seoImage ?? plain.image),
        },
    };
}

function normalizeSummary(service: IService): ServiceSummaryDto {
    const plain = service.toObject();
    const id = plain._id.toString();
    return {
        id,
        slug: plain.slug || id,
        title: localizedPair(plain.title, plain.titleAr),
        description: localizedPair(plain.description, plain.descriptionAr),
        image: resolveMedia(plain.image),
        price: plain.price ?? null,
        priceAr: plain.priceAr ?? null,
    };
}

export async function getServiceDetail(identifier: string): Promise<ServiceDetailResponse | null> {
    await connectDB();

    const conditions = [];

    if (Types.ObjectId.isValid(identifier)) {
        conditions.push({ _id: identifier });
    }

    if (identifier) {
        conditions.push({ slug: identifier });
    }

    if (conditions.length === 0) {
        return null;
    }

    const query = conditions.length === 1 ? conditions[0] : { $or: conditions };

    const service = await Service.findOne(query).catch(() => null);

    if (!service) {
        return null;
    }

    const normalizedService = normalizeService(service);

    const dedupeById = <T extends { _id: Types.ObjectId }>(items: T[]) => {
        const seen = new Set<string>();
        return items.filter((item) => {
            const id = item._id.toString();
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
        });
    };

    // Seeded shuffle for deterministic but varied results per service
    const seededShuffle = <T>(arr: T[], seed: string): T[] => {
        const copy = [...arr];
        // Simple hash function to create a numeric seed from the service ID
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            const char = seed.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        // Seeded random number generator
        const seededRandom = () => {
            hash = (hash * 1103515245 + 12345) & 0x7fffffff;
            return hash / 0x7fffffff;
        };
        for (let i = copy.length - 1; i > 0; i -= 1) {
            const j = Math.floor(seededRandom() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    };

    const serviceIdStr = service._id.toString();
    const collected: IService[] = [];
    const MAX_RELATED = 4;

    // 1) Respect explicit related list (if provided) - highest priority
    if (service.relatedServices && service.relatedServices.length > 0) {
        const explicit = await Service.find({
            _id: { $in: service.relatedServices, $ne: service._id },
        }).exec();
        collected.push(...explicit);
    }

    // 2) Fill from same category if we need more
    if (collected.length < MAX_RELATED && service.category) {
        const existingIds = new Set(collected.map(s => s._id.toString()));
        const sameCategory = await Service.find({
            _id: { $ne: service._id },
            category: service.category,
        }).sort({ order: 1, createdAt: -1 }).exec();

        // Filter out already collected and use seeded shuffle for variety
        const filtered = sameCategory.filter(s => !existingIds.has(s._id.toString()));
        const shuffled = seededShuffle(filtered, serviceIdStr);
        collected.push(...shuffled.slice(0, MAX_RELATED - collected.length));
    }

    // 3) Fallback: any other services if still need more
    if (collected.length < MAX_RELATED) {
        const existingIds = new Set(collected.map(s => s._id.toString()));
        const fallback = await Service.find({
            _id: { $ne: service._id },
        }).sort({ order: 1, createdAt: -1 }).exec();

        // Filter out already collected and use seeded shuffle for variety
        const filtered = fallback.filter(s => !existingIds.has(s._id.toString()));
        const shuffled = seededShuffle(filtered, serviceIdStr);
        collected.push(...shuffled.slice(0, MAX_RELATED - collected.length));
    }

    const unique = dedupeById(collected).filter((doc) => doc._id.toString() !== service._id.toString());
    const relatedServices = unique.slice(0, MAX_RELATED).map(normalizeSummary);

    return {
        service: normalizedService,
        relatedServices,
    };
}

