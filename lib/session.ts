let cookieCache: string | null = null;

export async function getArgosCookie() {
  if (cookieCache) {
    return cookieCache;
  }

  const res = await fetch("https://www.argos.co.uk", {
    headers: {
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
      Accept: "*/*",
    },
  });

  const cookie = res.headers.get("set-cookie");

  if (!cookie) {
    throw new Error("Failed to obtain Argos session cookie");
  }

  cookieCache = cookie;

  return cookieCache;
}

export function clearArgosCookie() {
  cookieCache = null;
}