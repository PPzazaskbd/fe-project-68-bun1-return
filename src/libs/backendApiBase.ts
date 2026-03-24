const DEFAULT_BACKEND_API_BASE = "https://backend-for-frontend-bun1.vercel.app/api/v1";

function normalizeBackendApiBase(value: string | undefined) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return DEFAULT_BACKEND_API_BASE;
  }

  return trimmedValue.replace(/\/+$/, "");
}

export const BACKEND_API_BASE = normalizeBackendApiBase(
  process.env.BACKEND_API_BASE ?? process.env.NEXT_PUBLIC_BACKEND_API_BASE,
);

export function buildBackendUrl(pathname: string) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${BACKEND_API_BASE}${normalizedPath}`;
}
