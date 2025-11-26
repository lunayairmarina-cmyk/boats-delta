import { useState, useEffect } from 'react';

/**
 * Hook to get the latest image URL with cache busting
 * Fetches the image metadata to get the latest upload date
 */
export function useImageUrl(slug: string | null | undefined): string | null {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) {
            setImageUrl(null);
            return;
        }

        const fetchImageUrl = async () => {
            try {
                // Fetch image metadata to get the latest upload date
                const response = await fetch(`/api/admin/images?section=all&slug=${slug}`, {
                    cache: 'no-store',
                });
                
                if (response.ok) {
                    const images = await response.json();
                    const image = Array.isArray(images) 
                        ? images.find((img: any) => img.metadata?.slug === slug)
                        : null;
                    
                    if (image) {
                        const uploadDate = image.uploadDate 
                            ? new Date(image.uploadDate).getTime() 
                            : Date.now();
                        setImageUrl(`/api/images/slug/${slug}?v=${uploadDate}`);
                    } else {
                        // Fallback to slug URL without version if not found in admin API
                        setImageUrl(`/api/images/slug/${slug}`);
                    }
                } else {
                    // Fallback to slug URL if admin API fails
                    setImageUrl(`/api/images/slug/${slug}`);
                }
            } catch (error) {
                console.error('Failed to fetch image URL:', error);
                // Fallback to slug URL on error
                setImageUrl(`/api/images/slug/${slug}`);
            }
        };

        fetchImageUrl();
    }, [slug]);

    return imageUrl;
}

