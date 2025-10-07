import { getBaseUrl, getRemoteUrl } from "@/config/config";
import type { RequestResponse } from "@/types/request-response";
import { type APIContext, APIOperation, ErrorCode } from "./definitions";

const replaceParams = (
  path: string,
  params?: Record<string, string | number>,
): string => {
  if (!params) return path;
  let result = path;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`{${key}}`, String(value));
  }
  return result;
};

const buildQuery = (query?: Record<string, string | string[]>): string => {
  if (!query || Object.keys(query).length === 0) return "";

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      value.forEach((v) => {
        params.append(key, v);
      });
    } else {
      params.append(key, value);
    }
  }

  return `?${params.toString()}`;
};

const isServer = typeof window === "undefined";

export async function apiRequest<T extends APIOperation>(
  options: Omit<APIContext[T], "responseType"> & { op: T },
): Promise<RequestResponse<APIContext[T]["responseType"]>> {
  if (!Object.values(APIOperation).includes(options.op)) {
    throw new Error(`Invalid operation: ${options.op}`);
  }

  const method = options.op.split(":", 1)[0];
  const path = options.op.replace(/^[^:]+:/, "");

  try {
    const baseUrl = await getRemoteUrl();

    console.log("API Request:", method, path, baseUrl);

    // biome-ignore lint/suspicious/noExplicitAny: need to cast to any to check for payload
    const fullPath = replaceParams(path, (options as any).params);
    // biome-ignore lint/suspicious/noExplicitAny: need to cast to any to check for payload
    const query = buildQuery((options as any).query);
    const url = `${baseUrl}${fullPath}${query}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (isServer) {
      const { cookies } = await import("next/headers");

      const cookieStore = await cookies();
      const cookieHeader = cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");

      headers.Cookie = cookieHeader;
      headers.Origin = await getBaseUrl();
    }

    const response = await fetch(url, {
      method,
      headers,
      credentials: "include",
      // biome-ignore lint/suspicious/noExplicitAny: need to cast to any to check for payload
      body: (options as any).payload
        ? // biome-ignore lint/suspicious/noExplicitAny: need to cast to any to check for payload
          JSON.stringify((options as any).payload)
        : undefined,
    });

    if (!response.ok) {
      const data = await response.json();
      const errorCode = data?.error;

      if (errorCode && Object.values(ErrorCode).includes(errorCode)) {
        return { success: false, errorCode };
      }

      return { success: false, errorCode: ErrorCode.INTERNAL_SERVER_ERROR };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (_err) {
    return { success: false, errorCode: ErrorCode.INTERNAL_SERVER_ERROR };
  }
}
