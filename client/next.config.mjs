// NEXT_PUBLIC_* values are baked into the JavaScript at build time. If the backend URL is missing,
// every API call becomes "undefined/api/..." in production, so refuse to build instead.
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const isProductionBuild = process.env.NODE_ENV === 'production';

if (isProductionBuild && !backendUrl) {
  throw new Error(
    'NEXT_PUBLIC_BACKEND_URL is not set. Add it (e.g. https://your-api.vercel.app) under ' +
    'Vercel → Project → Settings → Environment Variables, then redeploy.'
  );
}

if (process.env.VERCEL && /localhost|127\.0\.0\.1/.test(backendUrl ?? '')) {
  throw new Error(
    `NEXT_PUBLIC_BACKEND_URL is "${backendUrl}", which only works on your own computer. ` +
    'Set it to your deployed backend URL in the Vercel project settings, then redeploy.'
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
