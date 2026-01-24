import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/', // Just in case you add private pages later
        },
        sitemap: 'https://softwareguru.in/sitemap.xml',
    };
}