// lib/fetcher.ts

export async function secureFetch(url: string, options: RequestInit = {}) {
  let response = await fetch(url, options);

  if (response.status === 401) {
    console.warn("Access token expired. Re-authenticating context...");

    const refreshResponse = await fetch("/api/auth/refresh", {
      method: "POST",
    });

    if (refreshResponse.ok) {
      response = await fetch(url, options);
    } else {
      window.location.href = "/login";
    }
  }

  return response;
}
