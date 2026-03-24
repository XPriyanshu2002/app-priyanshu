import Constants from 'expo-constants';
import { NativeModules, Platform } from 'react-native';

const API_TIMEOUT_MS = Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS || 15000);
const DEFAULT_API_PORT = Number(process.env.EXPO_PUBLIC_API_PORT || 5000);

const stripTrailingSlash = (url) => url.replace(/\/+$/, '');
const SOURCE_CODE_SCRIPT_URL = NativeModules?.SourceCode?.scriptURL || null;

const getHostFromCandidate = (candidate) => {
  if (!candidate) {
    return null;
  }

  const raw = String(candidate).trim();
  if (!raw) {
    return null;
  }

  try {
    const normalized = raw.includes('://') ? raw : `http://${raw}`;
    const parsed = new URL(normalized);
    return parsed.hostname || null;
  } catch (_) {
    const withoutScheme = raw.replace(/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//, '');
    const hostPart = withoutScheme.split('/')[0] || '';
    const host = hostPart.split(':')[0] || '';
    return host || null;
  }
};

const getDevHostFromExpo = () => {
  const hostCandidates = [
    Constants.expoConfig?.hostUri,
    Constants.manifest2?.extra?.expoClient?.hostUri,
    Constants.manifest?.debuggerHost,
    SOURCE_CODE_SCRIPT_URL,
  ].filter(Boolean);

  for (const candidate of hostCandidates) {
    const host = getHostFromCandidate(candidate);
    if (host) {
      return host;
    }
  }

  return null;
};

const unique = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = String(item || '').toLowerCase();
    if (!item || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

const resolveHostCandidates = () => {
  const expoHost = getDevHostFromExpo();

  if (Platform.OS === 'android') {
    return unique([
      expoHost,
      'localhost',
      '10.0.2.2',
      '127.0.0.1',
    ]);
  }

  return unique([expoHost, 'localhost', '127.0.0.1']);
};

const resolveDefaultApiBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return stripTrailingSlash(process.env.EXPO_PUBLIC_API_BASE_URL);
  }

  const [defaultHost] = resolveHostCandidates();
  return `http://${defaultHost || 'localhost'}:${DEFAULT_API_PORT}/api`;
};

export const DEFAULT_API_BASE_URL = resolveDefaultApiBaseUrl();
const HAS_EXPLICIT_API_BASE = Boolean(process.env.EXPO_PUBLIC_API_BASE_URL);
const AUTO_FALLBACK_PORTS = [DEFAULT_API_PORT, DEFAULT_API_PORT + 1, DEFAULT_API_PORT + 2, DEFAULT_API_PORT + 3];

const resolveApiBaseCandidates = () => {
  if (HAS_EXPLICIT_API_BASE) {
    return [DEFAULT_API_BASE_URL];
  }

  const hosts = resolveHostCandidates();
  const baseUrls = [];

  for (const host of hosts) {
    for (const port of AUTO_FALLBACK_PORTS) {
      baseUrls.push(`http://${host}:${port}/api`);
    }
  }

  return unique(baseUrls);
};

let apiBaseCandidates = resolveApiBaseCandidates();
let activeApiBaseUrl = apiBaseCandidates[0] || DEFAULT_API_BASE_URL;

let tokenProvider = () => null;

export const setTokenProvider = (provider) => {
  tokenProvider = typeof provider === 'function' ? provider : () => null;
};

export const apiRequest = async (
  path,
  { method = 'GET', body, headers = {}, tokenOverride = null } = {}
) => {
  const token = tokenOverride || tokenProvider();
  const normalizedMethod = String(method).toUpperCase();
  const requestHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...headers,
  };

  if (normalizedMethod === 'GET') {
    requestHeaders['Cache-Control'] = requestHeaders['Cache-Control'] || 'no-cache';
    requestHeaders.Pragma = requestHeaders.Pragma || 'no-cache';
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const candidates = [activeApiBaseUrl, ...apiBaseCandidates.filter((baseUrl) => baseUrl !== activeApiBaseUrl)];
  let lastError = null;

  for (const baseUrl of candidates) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method: normalizedMethod,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch (error) {
        payload = null;
      }

      if (response.ok) {
        activeApiBaseUrl = baseUrl;
        return payload;
      }

      const message = String(payload?.message || '').toLowerCase();
      const isApiRouteMissing = response.status === 404 && message.includes('route not found');
      const canTryNextCandidate = !HAS_EXPLICIT_API_BASE && isApiRouteMissing;

      if (canTryNextCandidate) {
        lastError = Object.assign(new Error(payload?.message || 'API request failed'), {
          status: response.status,
          payload,
        });
        continue;
      }

      const error = new Error(payload?.message || 'API request failed');
      error.status = response.status;
      error.payload = payload;
      throw error;
    } catch (networkError) {
      if (networkError.name === 'AbortError') {
        lastError = new Error(
          `Request timed out after ${Math.round(API_TIMEOUT_MS / 1000)}s. Check backend connectivity.`
        );
        continue;
      }

      lastError = networkError;
      continue;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  if (lastError?.status) {
    throw lastError;
  }

  throw new Error(
    `Network request failed. Verify backend is running. Tried: ${candidates.join(', ')}`
  );
};
