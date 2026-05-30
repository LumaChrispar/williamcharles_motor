// Wikipedia Image Service
// Fetches the primary thumbnail image for a given car make+model
// Results are cached in localStorage so each query only runs once per session

const CACHE_KEY = 'wc_img_cache';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const { data, savedAt } = JSON.parse(raw);
    if (Date.now() - savedAt > CACHE_TTL) return {};
    return data;
  } catch {
    return {};
  }
}

function saveCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, savedAt: Date.now() }));
  } catch { /* quota exceeded — skip caching */ }
}

// In-memory cache for this session
let memCache = null;

function getCache() {
  if (!memCache) memCache = loadCache();
  return memCache;
}

function setCache(key, value) {
  const cache = getCache();
  cache[key] = value;
  memCache = cache;
  saveCache(cache);
}

/**
 * Fetch a Wikipedia thumbnail for a given make + model.
 * Returns an image URL string, or null if not found.
 */
async function fetchWikipediaImage(make, model) {
  // Try two search terms: "Make Model" and "Make Model car"
  const queries = [
    `${make} ${model}`,
    `${make} ${model} car`,
  ];

  for (const query of queries) {
    try {
      const url = `/api/wikipedia/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=900&titles=${encodeURIComponent(query)}&origin=*`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      const pages = data?.query?.pages;
      if (!pages) continue;
      
      const page = Object.values(pages)[0];
      if (page?.thumbnail?.source) {
        // Filter out obviously wrong images (logos, flags, etc.)
        const src = page.thumbnail.source;
        const lower = src.toLowerCase();
        if (lower.includes('logo') || lower.includes('flag') || lower.includes('map')) continue;
        return src;
      }
    } catch {
      // Silently continue on network error
    }
  }
  return null;
}

/**
 * Get image URL for a vehicle (with caching).
 * Falls back to null if Wikipedia has nothing useful.
 */
export async function getVehicleImage(make, model) {
  const cacheKey = `${make}__${model}`.toLowerCase().replace(/\s+/g, '_');
  const cache = getCache();
  
  // Return cached result (even if it's null — so we don't retry known misses)
  if (Object.prototype.hasOwnProperty.call(cache, cacheKey)) {
    return cache[cacheKey];
  }

  const img = await fetchWikipediaImage(make, model);
  setCache(cacheKey, img);
  return img;
}

/**
 * Preload images for a batch of vehicles (for showroom loading)
 * Runs in parallel but respects browser concurrency limits via chunking
 */
export async function preloadVehicleImages(vehicles, chunkSize = 5) {
  const chunks = [];
  for (let i = 0; i < vehicles.length; i += chunkSize) {
    chunks.push(vehicles.slice(i, i + chunkSize));
  }

  const results = {};
  for (const chunk of chunks) {
    await Promise.all(chunk.map(async (v) => {
      const img = await getVehicleImage(v.make, v.model);
      results[`${v.make}__${v.model}`.toLowerCase().replace(/\s+/g, '_')] = img;
    }));
  }
  return results;
}
