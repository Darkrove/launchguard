import { chromium } from "playwright";

let cookieCache: string | null = null;
let expiresAt = 0;

export async function getArgosSession(sku: string){
  const now = Date.now();

  if (cookieCache && now < expiresAt) {
    return cookieCache;
  }

  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();

    await page.goto(`https://www.argos.co.uk/product/${sku}`, {
      waitUntil: "networkidle",
    });

    await page.waitForTimeout(15000);

    const cookies = await page.context().cookies();

    console.table(
      cookies.map((c) => ({
        name: c.name,
        expires: c.expires,
      }))
    );
    
    const cookieString = cookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    console.log(
      "Cookies found:",
      cookies.map((c) => c.name)
    );

    cookieCache = cookieString;

    expiresAt = Date.now() + 1000 * 60 * 60;

    return cookieString;
  } finally {
    await browser.close();
  }
}

export function clearArgosSession() {
  cookieCache = null;
  expiresAt = 0;
}