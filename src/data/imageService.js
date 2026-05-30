// Wikipedia Image Service — v3
// Single image (for VehicleCard) and multiple images (for VehicleDetail carousel)
// 3-step flow: search article → get image list → resolve to real URLs
// All results cached in localStorage for 7 days

const CACHE_KEY = 'wc_img_cache_v3';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

// File extensions and keywords that are NOT car photos
const SKIP_PATTERNS = [
  /\.svg$/i, /logo/i, /flag/i, /map/i, /coat.of.arms/i,
  /commons-logo/i, /symbol/i, /icon/i, /badge/i, /emblem/i
];

function isCarPhoto(title) {
  return !SKIP_PATTERNS.some(p => p.test(title));
}

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const { data, savedAt } = JSON.parse(raw);
    if (Date.now() - savedAt > CACHE_TTL) return {};
    return data;
  } catch { return {}; }
}

function saveCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, savedAt: Date.now() }));
  } catch { /* quota exceeded */ }
}

let memCache = null;
function getCache() {
  if (!memCache) memCache = loadCache();
  return memCache;
}
function setCacheEntry(key, value) {
  const cache = getCache();
  cache[key] = value;
  memCache = cache;
  saveCache(cache);
}

function cacheKey(make, model) {
  return `${make}__${model}`.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

// ─── Step 1: Search Wikipedia for best article title ───────────────────────
async function searchArticleTitle(query) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=5&format=json&origin=*`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const results = data?.query?.search;
  return results?.[0]?.title || null;
}

// ─── Step 2: Get list of image filenames on that article ────────────────────
async function getImageFilenames(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=images&titles=${encodeURIComponent(title)}&format=json&imlimit=30&origin=*`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return [];
  const page = Object.values(pages)[0];
  const images = page?.images || [];
  return images.map(i => i.title).filter(isCarPhoto);
}

// ─── Step 3: Resolve filenames to actual URLs in one batch call ─────────────
async function resolveImageUrls(filenames) {
  if (filenames.length === 0) return [];
  // API allows up to 50 titles at once
  const batch = filenames.slice(0, 12).join('|');
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(batch)}&prop=imageinfo&iiprop=url&iiurlwidth=900&format=json&origin=*`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return [];

  return Object.values(pages)
    .map(p => p?.imageinfo?.[0]?.thumburl)
    .filter(Boolean)
    .filter(u => !SKIP_PATTERNS.some(p => p.test(u)));
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Get a single image URL for a vehicle (used by VehicleCard).
 */
export async function getVehicleImage(make, model) {
  const key = cacheKey(make, model);
  const cache = getCache();

  if (Object.prototype.hasOwnProperty.call(cache, key)) {
    const cached = cache[key];
    return Array.isArray(cached) ? cached[0] : cached;
  }

  const images = await getVehicleImages(make, model);
  return images?.[0] || null;
}

/**
 * Get multiple image URLs for a vehicle (used by VehicleDetail carousel).
 * Returns an array of up to ~8 real Wikipedia photos.
 */
export async function getVehicleImages(make, model) {
  const key = cacheKey(make, model);
  const cache = getCache();

  if (Object.prototype.hasOwnProperty.call(cache, key)) {
    const cached = cache[key];
    return Array.isArray(cached) ? cached : (cached ? [cached] : []);
  }

  // Try progressively simplified search queries
  const queries = [
    `${make} ${model}`,
    `${make} ${model.split(' ')[0]}`,
    `${make} ${model.split(' ').slice(0, 2).join(' ')}`,
  ];

  for (const query of queries) {
    try {
      const title = await searchArticleTitle(query);
      if (!title) continue;

      const filenames = await getImageFilenames(title);
      if (filenames.length === 0) continue;

      const urls = await resolveImageUrls(filenames);
      if (urls.length > 0) {
        setCacheEntry(key, urls);
        return urls;
      }
    } catch {
      // try next query
    }
  }

  setCacheEntry(key, null);
  return [];
}
