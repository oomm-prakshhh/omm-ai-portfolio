import { MetadataRoute } from 'next';

const DOMAIN = 'https://omm-ai.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${DOMAIN}/sitemap.xml`,
  };
}
