const SUPABASE_IMAGE_DOMAIN = import.meta.env.VITE_IMAGE_DOMAIN;

type ImageOptions = {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'original';
};

export const optimizeImage = (url: string, options: ImageOptions = {}) => {
  if (!url || !url.includes(SUPABASE_IMAGE_DOMAIN)) return url;

  const {
    width,
    height,
    quality = 75,
    format = 'webp'
  } = options;

  const transformations: string[] = [];

  if (width) transformations.push(`width=${width}`);
  if (height) transformations.push(`height=${height}`);
  if (quality) transformations.push(`quality=${quality}`);
  if (format !== 'original') transformations.push(`format=${format}`);

  if (transformations.length === 0) return url;

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${transformations.join('&')}`;
};

export const getImagePlaceholder = (width: number, height: number) => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3C/svg%3E`;
};
