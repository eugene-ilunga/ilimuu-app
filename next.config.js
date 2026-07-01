const nextConfig = {
  images: {
    domains: ['res.cloudinary.com',
      'hips.hearstapps.com',
      'i.pinimg.com',
      'avatars.githubusercontent.com',
      'img.freepik.com',
      'placehold.co',
      'miro.medium.com',
      'readymadeui.com',
      'ik4yvx5uxk.public.blob.vercel-storage.com',
      'www.digital.je',
      's3.envato.com',
      'smartacademy.up.railway.app'
      
      
    ],
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  
  // Server components external packages (Next.js 15)
  serverExternalPackages: ['pdfkit', 'canvas'],
  
  // Webpack configuration for pdfkit and other native modules (fallback for non-Turbopack)
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude pdfkit from bundling on server side
      config.externals = config.externals || [];
      config.externals.push({
        'pdfkit': 'commonjs pdfkit',
        'canvas': 'commonjs canvas',
      });
    }
    return config;
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://checkout.razorpay.com https://www.google.com https://www.gstatic.com https://mozilla.github.io https://8x8.vc; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; media-src 'self' blob: https:; connect-src 'self' https: wss:; frame-src 'self' data: blob: https://js.stripe.com https://checkout.razorpay.com https://meet.jit.si https://8x8.vc https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://res.cloudinary.com https://docs.google.com https://mozilla.github.io; object-src 'self' data: blob:; base-uri 'self'; form-action 'self';",
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;