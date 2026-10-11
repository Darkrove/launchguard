import axios from "axios";
import {
  getArgosSession,
  clearArgosSession,
} from "./session";

const BASE_URL =
  "https://www.argos.co.uk/stores/api/orchestrator/v0/cis-locator/availability";

export async function fetchSku(sku: string) {
  async function makeRequest() {
    const cookie = await getArgosSession(sku);

    return axios.get(BASE_URL, {
      params: {
        maxDistance: 50,
        maxResults: 10,
        skuQty: `${sku}_1`,
        channel: "web_pdp",
        timestamp: Date.now(),
      },
      headers: {
        Cookie: cookie,
        Accept: "application/json",

        Referer: `https://www.argos.co.uk/product/${sku}/`,

        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36",

        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
      },
      validateStatus: () => true,
    });
  }

  let response = await makeRequest();

  if ([400, 401, 403].includes(response.status)) {
    console.log("Refreshing browser session");

    clearArgosSession();

    response = await makeRequest();
  }

  if (response.status >= 400) {
    console.error(response.data);

    throw new Error(
      `Argos returned ${response.status}`
    );
  }

  return response.data;
}