// Small utility to validate remote media URIs and optionally perform a HEAD
// health-check. Returns the original URI when valid/healthy, or null (or a
// provided fallback) when unreachable.
export async function resolveRemoteUri(uri, options = {}) {
  const { timeout = 3000, fallback = null } = options;

  if (!uri) return fallback;

  // Basic format sanity-check
  try {
    // eslint-disable-next-line no-new
    new URL(uri);
  } catch (e) {
    return fallback;
  }

  // Try a HEAD request to test availability. Use fetch if available (React
  // Native / Expo) with a timeout.
  if (typeof fetch === 'function') {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const res = await fetch(uri, { method: 'HEAD', signal: controller.signal });
      clearTimeout(id);
      if (res && res.ok) return uri;
      return fallback;
    } catch (e) {
      return fallback;
    }
  }

  // If fetch isn't available (e.g., Node older environments), just return the
  // URI — callers can attempt to load and handle errors.
  return uri;
}
