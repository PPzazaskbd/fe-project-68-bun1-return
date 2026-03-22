export function getSafeCallbackUrl(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export function buildAuthHref(pathname: string, callbackUrl: string | null) {
  const safeCallbackUrl = getSafeCallbackUrl(callbackUrl);

  if (safeCallbackUrl === "/") {
    return pathname;
  }

  const searchParams = new URLSearchParams({
    callbackUrl: safeCallbackUrl,
  });

  return `${pathname}?${searchParams.toString()}`;
}
