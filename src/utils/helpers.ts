import type { Post } from '../services/api';

/**
 * Returns an Indonesian-locale relative time string.
 * e.g. "2 jam lalu", "5 menit lalu", "baru saja"
 */
export function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return 'baru saja';

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7) return `${days} hari lalu`;
  if (weeks < 5) return `${weeks} minggu lalu`;
  if (months < 12) return `${months} bulan lalu`;
  return `${years} tahun lalu`;
}

/**
 * Strip all HTML tags from a string and decode common HTML entities.
 */
export function stripHTML(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&hellip;/g, '…')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Estimate reading time in minutes based on an average of 200 WPM (Indonesian).
 * Returns at least 1 minute.
 */
export function estimateReadingTime(html: string): number {
  const text = stripHTML(html);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Extract the featured image URL from a post's `_embedded` data.
 * Returns undefined if no image is available.
 */
export function getFeaturedImageUrl(post: Post, size: 'thumbnail' | 'medium' | 'large' = 'medium'): string | undefined {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return undefined;

  const sizes = media.media_details?.sizes;
  if (sizes) {
    if (size === 'thumbnail') {
      return sizes.thumbnail?.source_url ?? sizes.medium?.source_url ?? media.source_url;
    }
    if (size === 'medium') {
      return sizes.medium?.source_url ?? sizes.medium_large?.source_url ?? sizes.large?.source_url ?? media.source_url;
    }
    if (size === 'large') {
      return sizes.large?.source_url ?? sizes.full?.source_url ?? media.source_url;
    }
  }

  return media.source_url;
}

/**
 * Extract the primary category name from `_embedded['wp:term']`.
 * Falls back to 'Uncategorized'.
 */
export function getCategoryName(post: Post): string {
  const terms = post._embedded?.['wp:term'];
  if (!terms || terms.length === 0) return 'Uncategorized';

  // wp:term[0] contains categories
  const categories = terms[0];
  if (categories && categories.length > 0) {
    return categories[0].name;
  }

  return 'Uncategorized';
}

/**
 * Extract the author display name from `_embedded.author`.
 * Falls back to 'Unknown'.
 */
export function getAuthorName(post: Post): string {
  const authors = post._embedded?.author;
  if (authors && authors.length > 0) {
    return authors[0].name;
  }
  return 'Unknown';
}
