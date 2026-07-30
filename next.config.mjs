/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Nâng giới hạn dung lượng tải lên qua Server Action (mặc định chỉ 1MB)
    // để upload được banner/ảnh có kích thước lớn hơn.
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
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
