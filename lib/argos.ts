import { clearArgosCookie, getArgosCookie } from "./session";

const BASE_URL =
  "https://www.argos.co.uk/stores/api/orchestrator/v0/cis-locator/availability";

export async function fetchSku(sku: string) {
  const request = async () => {
    const cookie = await getArgosCookie();
    
    const url =
      `${BASE_URL}` +
      `?maxDistance=50` +
      `&maxResults=10` +
      `&skuQty=${sku}_1` +
      `&channel=web_pdp`;

    const response = await fetch(url, {
      headers: {
        Cookie: cookie,
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        Accept: "*/*",
      },
    });

    return response;
  };

  let response = await request();

  if ([400, 401, 403].includes(response.status)) {
    clearArgosCookie();
    response = await request();
  }

  if (!response.ok) {
    throw new Error(`Argos returned ${response.status}`);
  }

  return response.json();
}