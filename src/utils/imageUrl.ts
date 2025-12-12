/**
 * Utility function to get the latest image URL with cache busting
 * Fetches the image metadata to get the upload date and adds it as a query parameter
 */
export async function getImageUrlWithCacheBusting(slug: string): Promise<string> {
    try {
        // Fetch image metadata to get the latest upload date
        const response = await fetch(`/api/admin/images?slug=${slug}`, {
            cache: 'no-store',
        });
        
        if (response.ok) {
            const images = await response.json();
            const image = Array.isArray(images) && images.length > 0 
                ? images[0] // Get the first (latest) image
                : null;
            
            if (image?.uploadDate) {
                const timestamp = new Date(image.uploadDate).getTime();
                return `/api/images/slug/${slug}?v=${timestamp}`;
            }
        }
    } catch (error) {
        console.error('Failed to fetch image metadata for cache busting:', error);
    }
    
    // Fallback: return URL with current timestamp
    return `/api/images/slug/${slug}?v=${Date.now()}`;
}

/**
 * Hook-friendly version that returns a URL that updates when the image changes
 * This can be used in components that need to re-fetch when images are updated
 */
export function getImageUrl(slug: string, timestamp?: number): string {
    if (timestamp) {
        return `/api/images/slug/${slug}?v=${timestamp}`;
    }
    // Without timestamp, add current time to force fresh fetch
    return `/api/images/slug/${slug}?v=${Date.now()}`;
}








































