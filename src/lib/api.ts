export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)

    this.name = "ApiError"
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers)

  if (init.body && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json")

  const response = await fetch(path, {
    ...init,

    headers,

    credentials: "same-origin",

    cache: "no-store",
  })

  if (response.status === 401)
    window.dispatchEvent(new Event("kami:unauthorized"))

  if (!response.ok) {
    let message = `Request failed (${response.status})`

    try {
      const body: unknown = await response.json()

      if (
        typeof body === "object" &&
        body !== null &&
        "error" in body &&
        typeof body.error === "string"
      ) {
        message = body.error
      }
    } catch {
      // Keep the explicit HTTP status when the server does not return JSON.
    }

    throw new ApiError(response.status, message)
  }

  if (response.status === 204) return undefined as T

  return response.json() as Promise<T>
}
