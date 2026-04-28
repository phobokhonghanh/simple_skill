import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except static files and Next.js internals
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};

// Required for Cloudflare Workers — must use Edge Runtime
export const runtime = 'edge';
