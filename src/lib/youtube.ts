/** Chuyển link YouTube bất kỳ thành ID và URL nhúng. */
export function parseYouTube(url: string): { id: string | null; embed: string | null; thumb: string | null } {
  if (!url) return { id: null, embed: null, thumb: null };
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) {
      const id = m[1];
      return {
        id,
        embed: `https://www.youtube.com/embed/${id}`,
        thumb: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      };
    }
  }
  // Nếu người dùng dán thẳng ID 11 ký tự
  if (/^[\w-]{11}$/.test(url.trim())) {
    const id = url.trim();
    return {
      id,
      embed: `https://www.youtube.com/embed/${id}`,
      thumb: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }
  return { id: null, embed: null, thumb: null };
}
