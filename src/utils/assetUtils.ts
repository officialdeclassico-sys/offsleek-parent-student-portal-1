import aaravAvatarDefault from '../assets/images/aarav_avatar.png';

/**
 * Robust asset URL resolver for GitHub Pages / Vite subpaths and external/Firebase storage URLs.
 * - Preserves absolute HTTP/HTTPS/data/blob URLs without modification.
 * - Resolves local root paths against import.meta.env.BASE_URL.
 * - Provides fallback default avatar if URL is empty or invalid.
 */
export function resolveAssetUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return aaravAvatarDefault;
  }

  const trimmed = url.trim();

  // If external URL, Firebase storage download URL, data URL, or blob URL, return as-is
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Handle Vite base URL for GitHub Pages deployments (e.g. /repo-name/)
  const base = import.meta.env.BASE_URL ? import.meta.env.BASE_URL.replace(/\/$/, '') : '';
  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  // Avoid double prefixing if base is already included
  if (base && cleanPath.startsWith(base)) {
    return cleanPath;
  }

  return `${base}${cleanPath}`;
}
