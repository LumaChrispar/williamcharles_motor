// Wikipedia Image Service — v2
// Step 1: Use Wikipedia search to find the best matching article for "Make Model"
// Step 2: Fetch the pageimage from that article
// Results are cached in localStorage for 7 days

const CACHE_KEY = 'wc_img_cache_v2';
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

/**
 * Step 1: Search Wikipedia for the car, return the best article title
 */
async function searchWikipedia(query) {
  const url = `/api/wikipedia/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=5&format=json&origin=*`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const results = data?.query?.search;
  if (!results || results.length === 0) return null;

  // Pick the first result — it's almost always the right one for Make+Model searches
  return results[0].title;
}

/**
 * Step 2: Given an exact Wikipedia article title, get its thumbnail image
 */
async function getPageImage(title) {
  const url = `/api/wikipedia/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=900&titles=${encodeURIComponent(title)}&origin=*`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) return null;

  const page = Object.values(pages)[0];
  if (!page?.thumbnail?.source) return null;

  const src = page.thumbnail.source;
  // Filter out non-car images (icons, maps, logos, people, flags)
  const lower = src.toLowerCase();
  if (lower.includes('logo') || lower.includes('flag') || lower.includes('map') || lower.includes('coat_of_arms')) {
    return null;
  }
  return src;
}

/**
 * Main export: get a Wikipedia image for a vehicle make + model
 * Uses a 2-step search → image approach for much better accuracy
 */
export async function getVehicleImage(make, model) {
  const cacheKey = `${make}__${model}`.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  const cache = getCache();

  // Return cached result (null means we already tried and failed)
  if (Object.prototype.hasOwnProperty.call(cache, cacheKey)) {
    return cache[cacheKey];
  }

  // Try progressively simplified search queries
  const searchQueries = [
    `${make} ${model}`,               // e.g. "Ferrari SF90 STRADALE"
    `${make} ${model.split(' ')[0]}`, // e.g. "Ferrari SF90"
    `${make} ${model.split(' ').slice(0, 2).join(' ')}`, // First 2 words of model
  ];

  for (const query of searchQueries) {
    try {
      const title = await searchWikipedia(query);
      if (!title) continue;

      const img = await getPageImage(title);
      if (img) {
        setCacheEntry(cacheKey, img);
        return img;
      }
    } catch {
      // Continue to next query
    }
  }

  // Cache the failure so we don't retry endlessly
  setCacheEntry(cacheKey, null);
  return null;
}
