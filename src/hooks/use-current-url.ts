import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface CurrentUrlInfo {
  fullUrl: string;
  origin: string;
  pathname: string;
  searchParams: URLSearchParams;
  searchParamsObject: Record<string, string>;
  urlWithoutParams: string;
}

/**
 * React Hook to get current URL information
 * Works in both client and server components (with limitations)
 */
export const useCurrentUrl = (): CurrentUrlInfo => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [urlInfo, setUrlInfo] = useState<CurrentUrlInfo>({
    fullUrl: "",
    origin: "",
    pathname: pathname || "",
    searchParams: new URLSearchParams(),
    searchParamsObject: {},
    urlWithoutParams: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;
      const currentOrigin = window.location.origin;
      const currentPathname = window.location.pathname;
      const currentSearchParams = new URLSearchParams(window.location.search);

      // Convert search params to object
      const searchParamsObject: Record<string, string> = {};
      currentSearchParams.forEach((value, key) => {
        searchParamsObject[key] = value;
      });

      setUrlInfo({
        fullUrl: currentUrl,
        origin: currentOrigin,
        pathname: currentPathname,
        searchParams: currentSearchParams,
        searchParamsObject,
        urlWithoutParams: currentOrigin + currentPathname,
      });
    }
  }, [pathname, searchParams]);

  return urlInfo;
};

/**
 * React Hook to get a specific search parameter
 */
export const useSearchParam = (param: string): string | null => {
  const searchParams = useSearchParams();
  return searchParams.get(param);
};

/**
 * React Hook to get all search parameters as an object
 */
export const useAllSearchParams = (): Record<string, string> => {
  const searchParams = useSearchParams();
  const [paramsObject, setParamsObject] = useState<Record<string, string>>({});

  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    setParamsObject(params);
  }, [searchParams]);

  return paramsObject;
};
