/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Cho phép hiển thị ảnh tải lên từ Supabase Storage.
    // Thay <project-ref> tự động qua remotePatterns dạng wildcard.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
};

export default nextConfig;
