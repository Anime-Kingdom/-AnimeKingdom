import type { NextConfig } from 'next';
const nextConfig:NextConfig={turbopack:{resolveAlias:{'cloudflare:workers':'./lib/local-cloudflare.ts'}}};
export default nextConfig;
