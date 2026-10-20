import { expect, test } from "@playwright/test";
import fs from "node:fs/promises";
test("record the slider transformation", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    recordVideo: { dir: "test-results/demo", size: { width: 1440, height: 1000 } },
  });
  const page = await context.newPage();
  await page.goto("/");
  await page.getByRole("button", { name: "Open the fictional SaaS demo" }).click();
  await page.getByRole("button", { name: "03 Raise $200k", exact: true }).click();
  await expect(page.locator(".comparison-card.selected")).toContainText("83.3%");
  // Delays are intentional recording beats, not application synchronization.
  await page.waitForTimeout(2500);
  const slider = page.getByRole("slider", { name: "Capital raised slider" });
  await slider.focus();
  for (let i = 0; i < 20; i++) { await slider.press("ArrowRight"); await page.waitForTimeout(160); }
  await expect(page.locator(".comparison-card.selected")).toContainText("71.4%");
  await page.waitForTimeout(2500);
  await page.getByRole("button", { name: "01 Bootstrap conservatively", exact: true }).click();
  await page.waitForTimeout(2500);
  await context.close();
  await fs.mkdir("docs/media", { recursive: true });
  await page.video()!.saveAs("docs/media/transformation.webm");
});
