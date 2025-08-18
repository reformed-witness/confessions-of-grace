import type {Metadata} from "next";

interface MetaProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
}

export function generateMetadata({
                                     title = 'Confessions of Grace',
                                     description = 'A blog dedicated to exploring the doctrines of grace and Reformed theology.',
                                     keywords = 'reformed theology, doctrines of grace, christianity, calvinism, theology',
                                     image = '/images/og-default.jpg',
                                     url = 'https://confessionsofgrace.com',
                                     type = 'website'
                                 }: MetaProps = {}): Metadata {
    const siteTitle = title === 'Confessions of Grace'
        ? 'Confessions of Grace | Confessing Christ. Rejoicing in Grace.'
        : `${title} | Confessions of Grace`;

    const fullImageUrl = image.startsWith('http') ? image : `https://www.confessionsofgrace.com${image}`;

    return {
        title: siteTitle,
        description,
        keywords,
        openGraph: {
            type: type as any,
            url,
            title: siteTitle,
            description,
            images: [
                {
                    url: fullImageUrl,
                    alt: title || 'Confessions of Grace'
                }
            ],
            locale: 'en_US',
            siteName: 'Confessions of Grace'
        },
        twitter: {
            card: 'summary_large_image',
            title: siteTitle,
            description,
            images: [fullImageUrl]
        },
        alternates: {
            canonical: url
        }
    };
}

// Default metadata for the site
export const defaultMetadata: Metadata = generateMetadata();

// Helper function for pages that need custom metadata
export function createPageMetadata(props: MetaProps): Metadata {
    return generateMetadata(props);
}