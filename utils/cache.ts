import { cachedSummaries } from "./storage";
import CryptoJS from "crypto-js";

const CACHE_TTL = 24 * 60 * 60 * 1000; 

function generateCacheKey(content: string, length: string): string {
  const hash = CryptoJS.SHA256(content)
    .toString(CryptoJS.enc.Hex)
    .substring(0, 10);
  return `summary:${length}:${hash}`;
}

async function getCachedSummary(
  content: string,
  length: string
): Promise<string | null> {
  const key = generateCacheKey(content, length);
  const summaries = await cachedSummaries.getValue();
  const cached = summaries[key];

  if (cached) {
    const currentTime = Date.now();
    if (currentTime - cached.timestamp < CACHE_TTL) {
      return cached.summaryText;
    } else {
      // Cache expired, remove the entry
      delete summaries[key];
      await cachedSummaries.setValue(summaries);
    }
  }

  return null;
}

async function setCachedSummary(
  content: string,
  length: string,
  summaryText: string
): Promise<void> {
  const key = generateCacheKey(content, length);
  const summaries = await cachedSummaries.getValue();
  summaries[key] = {
    summaryText,
    timestamp: Date.now(),
  };
  await cachedSummaries.setValue(summaries);
}

export { getCachedSummary, setCachedSummary };
