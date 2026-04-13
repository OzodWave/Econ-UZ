/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // TypeScript xatolarini build paytida ignore qilamiz
        ignoreBuildErrors: true,
    },
    eslint: {
        // ESLint xatolarini build paytida ignore qilamiz
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;