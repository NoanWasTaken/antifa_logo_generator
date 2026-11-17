type Bucket = { hits: number[]; windowMs: number };

const buckets = new Map<string, Bucket>();
const SWEEP_MS = 10 * 60_000;

export function allowRequest(
  key: string,
  max: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const recent = (buckets.get(key)?.hits ?? []).filter(
    (timestamp) => now - timestamp < windowMs,
  );

  if (recent.length >= max) {
    buckets.set(key, { hits: recent, windowMs });
    return false;
  }

  recent.push(now);
  buckets.set(key, { hits: recent, windowMs });
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, { hits, windowMs }] of buckets) {
    if (now - (hits[hits.length - 1] ?? 0) >= windowMs) buckets.delete(key);
  }
}, SWEEP_MS);
