import { expect, test } from "@playwright/test";
import fs from "node:fs/promises";
test("offline demo: branch, slider, save, reload, exports, no-key, screenshot", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("See the next 24 months");
  await page.getByRole("slider", { name: "Demo capital slider" }).fill("400000");
  await expect(page.getByTestId("preview-ownership")).toContainText("71.4");
  await page.getByRole("slider", { name: "Demo capital slider" }).fill("200000");
  // Lazy images below the fold only load on scroll, so load them all before the full-page shot.
  await page.locator("img.shot").evaluateAll(imgs => Promise.all(imgs.map(img => { (img as HTMLImageElement).loading = "eager"; return (img as HTMLImageElement).decode().catch(() => undefined); })));
  await page.screenshot({ path: "docs/screenshots/home.png", fullPage: true });
  await page.getByRole("button", { name: "Open the fictional SaaS demo" }).click();
  await expect(page).toHaveURL(/scenario/);
  await page.getByRole("button", { name: "C Raise $200k", exact: true }).click();
  await expect(page.locator(".comparison-card.selected")).toContainText("83.3%");
  await page.getByLabel("Capital raised", { exact: true }).fill("400000");
  await expect(page.locator(".comparison-card.selected")).toContainText("71.4%");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "C Raise $200k", exact: true }).click();
  await expect(page.getByLabel("Capital raised", { exact: true })).toHaveValue("400000");
  const csvDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "CSV", exact: true }).click();
  const file = await csvDownload;
  const csv = await fs.readFile((await file.path())!, "utf8");
  expect(csv.split("\r\n")).toHaveLength(25);
  const jsonDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "JSON", exact: true }).click();
  const json = await jsonDownload;
  const parsed = JSON.parse(await fs.readFile((await json.path())!, "utf8"));
  expect(parsed.branches[2].overrides.financing).toBe(400000);
  await page.getByLabel("This is non-confidential data").check();
  await page.getByRole("button", { name: "Generate candidates" }).click();
  await expect(page.getByRole("status")).toContainText("not configured", { timeout: 15000 });
  await page.getByRole("button", { name: "Dismiss message" }).click();
  await page.screenshot({ path: "docs/screenshots/workspace.png", fullPage: true });
  const pngDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "PNG", exact: true }).click();
  const png = await pngDownload;
  const bytes = await fs.readFile((await png.path())!);
  expect(bytes.subarray(1, 4).toString()).toBe("PNG");
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  page.once("dialog", d => d.accept());
  await page.getByRole("button", { name: "Share", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Share link copied");
  const shared = await page.evaluate(() => navigator.clipboard.readText());
  expect(shared).toContain("#scenario=");
  await page.goto(shared);
  await expect(page).toHaveURL(/scenario/);
  await page.getByRole("button", { name: "C Raise $200k", exact: true }).click();
  await expect(page.getByLabel("Capital raised", { exact: true })).toHaveValue("400000");
  page.once("dialog", d => d.accept());
  await page.getByRole("button", { name: "Reset path to baseline" }).click();
  await expect(page.getByLabel("Capital raised", { exact: true })).toHaveValue("0");
  expect(errors).toEqual([]);
});
test("create, validate and import with a mobile keyboard-friendly layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByLabel("Give it a name").fill("Our next move");
  await page.getByLabel("The dilemma").fill("Should we hire two people or bootstrap?");
  await page.getByRole("button", { name: "Preview my decision" }).click();
  await expect(page.getByRole("heading", { name: "Our next move" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByLabel("Monthly growth", { exact: true }).fill("-51");
  await expect(page.getByText("Enter -50–50.")).toBeVisible();
  await page.getByLabel("Monthly growth", { exact: true }).fill("7");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.getByRole("link", { name: "Your decisions", exact: true }).click();
  await page.locator('input[type="file"]').setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from("{broken") });
  await expect(page.locator('main [role="alert"]')).toContainText("Invalid");
  await page.locator('input[type="file"]').setInputFiles("fixtures/sample-saas.json");
  await expect(page).toHaveURL(/scenario/);
  await page.screenshot({ path: "docs/screenshots/mobile.png", fullPage: true });
});
test("AI candidate review uses a clearly labeled test fixture and preserves entered numbers", async ({ page }) => {
  await page.route("**/api/scenarios/generate", route => route.fulfill({ json: {
    model: "recorded-test-fixture", cached: false,
    candidate: { title: "Fixture", warnings: ["Test fixture — not a real model response."], branches: ["Lean", "Hire", "Raise"].map(name => ({
      name, thesis: "A test-only strategic pathway.", assumptions: [
        { field: "growth", value: 9, explanation: "Illustrative test-only growth assumption." },
        { field: "expenses", value: 8000, explanation: "Illustrative test-only expense assumption." },
        { field: "churn", value: 3, explanation: "Illustrative test-only churn assumption." },
      ], actions: ["Validate demand"], risks: ["Unknown demand"], signals: ["Low activation"], experiments: ["Interview users"],
    })) },
  } }));
  await page.goto("/");
  await page.getByRole("button", { name: "Open the fictional SaaS demo" }).click();
  await page.getByLabel("Monthly growth", { exact: true }).fill("6");
  await page.getByLabel("This is non-confidential data").check();
  await page.getByRole("button", { name: "Generate candidates" }).click();
  await expect(page.getByRole("button", { name: "Apply reviewed candidates" })).toBeDisabled();
  await page.getByLabel("I reviewed these inferred assumptions").check();
  await page.getByRole("button", { name: "Apply reviewed candidates" }).click();
  await expect(page.getByLabel("Monthly growth", { exact: true })).toHaveValue("6");
  await expect(page.locator(".ai-label")).toContainText("assumptions unverified");
});
