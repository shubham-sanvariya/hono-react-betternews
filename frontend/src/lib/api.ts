import { hc } from "hono/client";

import type { ApiRoutes, ErrorResponse, SuccessResponse } from "@/shared/types";

const client = hc<ApiRoutes>("/", {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: "include",
    }),
}).api;

export const postSignup = async (username: string, password: string) =>{
  try {
    const res = await client.auth.signup.$post({
      form: {
        username,
        password
      }
    });

    if (res.ok) {
      return (await res.json()) as SuccessResponse;
    }
    return (await res.json()) as unknown as ErrorResponse
  }catch (e) {
    return {
      success: false,
      error: String(e),
      isFormError: false,
    } as ErrorResponse
  }
}
