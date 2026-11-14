import { expect, test } from "@playwright/test";

test("homepage is readable, keyboard-accessible, and fits the viewport", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const missing: string[] = [];
  page.on("response", response => { if (response.status() >= 400 && new URL(response.url()).hostname === "127.0.0.1") missing.push(response.url()); });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Big MBA");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  await page.getByRole("link", { name: "Explore resources" }).click();
  await expect(page).toHaveURL(/#resources$/);
  await expect(page.getByRole("heading", { name: "Resources", exact: true })).toBeInViewport();
  await expect(page.locator(".cloud-grid .cloud-link")).toHaveCount(4);
  for (const image of await page.locator("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty("complete", true);
    expect(await image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: `test-results/home-${testInfo.project.name}.png`, fullPage: true });
  expect(errors).toEqual([]);
  expect(missing).toEqual([]);
  await page.getByRole("link", { name: "Section 1", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Section 1");
});

test("all resource routes work and show honest empty states", async ({ page }) => {
  for (let index = 1; index <= 4; index++) {
    const response = await page.goto(`/resources/section-${index}/`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(`Section ${index}`);
    await expect(page.getByText("This shelf is getting ready.")).toBeVisible();
    await expect(page.locator(".other-sections .cloud-link")).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.getByRole("link", { name: "All resources" }).click();
  await expect(page).toHaveURL(/\/#resources$/);
});

test("Instagram previews have safe configured links and reduced motion is respected", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const card of await page.locator(".post-card").all()) {
    await expect(card).toHaveAttribute("href", "https://www.instagram.com/cloud_boardd");
    await expect(card).toHaveAttribute("rel", "noopener noreferrer");
  }
  expect(await page.locator(".hero-copy").evaluate(element => getComputedStyle(element).animationName)).toBe("none");
  expect(await page.locator("html").evaluate(element => getComputedStyle(element).scrollBehavior)).toBe("auto");
});
