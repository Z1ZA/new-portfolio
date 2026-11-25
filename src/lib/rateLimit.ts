const MAX_KEYS = 2000;
const buckets = new Map<string, number[]>();

export function getClientIp(request: Request): string {
  const realIp = request.headers.get("x-real-ip");
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0];
  return (realIp ?? forwarded ?? "local").trim().slice(0, 64) || "local";
}

/**
 * Bounded per-key sliding window rate limiter.
 * Returns `true` when the request exceeds `maxRequests` inside `windowMs`.
 */
export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();

  // Periodically prune expired keys to keep memory bounded under spoofed headers
  if (buckets.size >= MAX_KEYS) {
    for (const [k, timestamps] of buckets) {
      const fresh = timestamps.filter((t) => now - t < windowMs);
      if (fresh.length === 0) {
        buckets.delete(k);
      } else {
        buckets.set(k, fresh);
      }
    }
    if (buckets.size >= MAX_KEYS) {
      const oldestKey = buckets.keys().next().value;
      if (oldestKey !== undefined) buckets.delete(oldestKey);
    }
  }

  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= maxRequests) {
    buckets.set(key, recent);
    return true;
  }

  recent.push(now);
  buckets.set(key, recent);
  return false;
}

export class PayloadError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function readBoundedJson<T>(request: Request, maxBytes = 16_384): Promise<T> {
  const contentLength = request.headers.get("content-length");
  if (contentLength !== null) {
    const declared = Number(contentLength);
    if (Number.isFinite(declared) && declared > maxBytes) {
      throw new PayloadError(413, `Payload exceeds ${maxBytes} bytes limit.`);
    }
  }

  const raw = await request.text();
  if (Buffer.byteLength(raw, "utf8") > maxBytes) {
    throw new PayloadError(413, `Payload exceeds ${maxBytes} bytes limit.`);
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new PayloadError(400, "Invalid JSON payload.");
  }
}
