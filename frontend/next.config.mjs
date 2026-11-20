import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

export default function nextConfig(phase) {
    if (phase === PHASE_DEVELOPMENT_SERVER) {
        return {
            allowedDevOrigins: (process.env.DEV_ALLOWED_ORIGINS || '')
                .split(',')
                .map((origen) => origen.trim())
                .filter(Boolean),
            async rewrites() {
                const backend = process.env.API_PROXY_TARGET || 'http://127.0.0.1:5173';
                return [{ source: '/api/:path*', destination: `${backend}/api/:path*` }];
            }
        };
    }
    return {
    output: 'export',
    distDir: 'dist/browser'
    };
}
