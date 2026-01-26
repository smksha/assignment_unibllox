const BASE_URL = import.meta.env.VITE_API_BASE_URL; //"http://localhost:3001"// Backend URL

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  if (!BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not defined"); //safety check
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Something went wrong");
  }

  return res.json();
}
