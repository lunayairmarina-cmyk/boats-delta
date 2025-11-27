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

    let relatedDocs: IService[] = [];

    if (service.relatedServices && service.relatedServices.length > 0) {
        relatedDocs = await Service.find({
            _id: { $in: service.relatedServices, $ne: service._id },
        })
            .limit(4)
            .exec();
    }

    if (relatedDocs.length === 0 && service.category) {
        relatedDocs = await Service.find({
            _id: { $ne: service._id },
            category: service.category,
        })
            .limit(4)
            .exec();
    }

    if (relatedDocs.length === 0) {
        relatedDocs = await Service.find({ _id: { $ne: service._id } })
            .limit(4)
            .exec();
    }

    const relatedServices = relatedDocs.map(normalizeSummary);

    return {
        service: normalizedService,
        relatedServices,
    };
}

