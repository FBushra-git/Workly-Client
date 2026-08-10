import type { ApiResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string | null;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { body, token, headers, ...init } = options;
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    throw new ApiError(result.message || "Request failed", response.status);
  }

  return result;
}

export const api = {
  get<T>(path: string, token?: string | null) {
    return request<T>(path, { token, cache: "no-store" });
  },
  post<T>(path: string, body: unknown, token?: string | null) {
    return request<T>(path, { method: "POST", body, token });
  },
  patch<T>(path: string, body: unknown, token?: string | null) {
    return request<T>(path, { method: "PATCH", body, token });
  },
  delete<T>(path: string, token?: string | null) {
    return request<T>(path, { method: "DELETE", token });
  },
};
