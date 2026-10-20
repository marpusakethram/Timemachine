import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 1360 }, deviceScaleFactor: 1 });
  await page.setContent(`<html><body style="margin:0">${await fs.readFile("docs/architecture.svg", "utf8")}</body></html>`);
  await page.screenshot({ path: "docs/architecture.png", fullPage: true, timeout: 60000 });
} finally { await browser.close(); }
