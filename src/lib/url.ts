/**
 * URL utility functions for getting current URL information
 */

/**
 * Get the current full URL including protocol, host, pathname and search params
 * Only works in client-side
 */
export const getCurrentFullUrl = (): string => {
  if (typeof window === "undefined") {
    return "";
  }
  return window.location.href;
};

/**
 * Get the current origin (protocol + host)
 * Only works in client-side
 */
export const getCurrentOrigin = (): string => {
  if (typeof window === "undefined") {
    return "";
  }
  return window.location.origin;
};

/**
 * Get the current pathname
 * Only works in client-side
 */
export const getCurrentPathname = (): string => {
  if (typeof window === "undefined") {
    return "";
  }
  return window.location.pathname;
};

/**
 * Get the current search params as URLSearchParams object
 * Only works in client-side
 */
export const getCurrentSearchParams = (): URLSearchParams => {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }
  return new URLSearchParams(window.location.search);
};

/**
 * Get a specific search parameter value
 * Only works in client-side
 */
export const getSearchParam = (param: string): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return new URLSearchParams(window.location.search).get(param);
};

/**
 * Get all search parameters as an object
 * Only works in client-side
 */
export const getAllSearchParams = (): Record<string, string> => {
  if (typeof window === "undefined") {
    return {};
  }
  const searchParams = new URLSearchParams(window.location.search);
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

/**
 * Build URL with search parameters
 */
export const buildUrl = (pathname: string, searchParams?: Record<string, string>): string => {
  if (!searchParams || Object.keys(searchParams).length === 0) {
    return pathname;
  }

  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value);
    }
  });

  return `${pathname}?${params.toString()}`;
};

/**
 * Get the current URL without search parameters
 */
export const getCurrentUrlWithoutParams = (): string => {
  if (typeof window === "undefined") {
    return "";
  }
  return window.location.origin + window.location.pathname;
};
