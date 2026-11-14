import { expect, test } from "@playwright/test";
import { TIMER_KEY, initialState } from "../src/lib/focus-timer";

test("timer can start, pause, resume, reset, and change modes", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Start a focus session" }).click();
  await expect(page).toHaveURL(/\/focus\/$/);
  await expect(page.getByRole("timer")).toHaveText("25:00");
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await expect(page.getByRole("button", { name: "Pause", exact: true })).toBeVisible();
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const paused = await page.getByRole("timer").textContent();
  await page.waitForTimeout(1100);
  await expect(page.getByRole("timer")).toHaveText(paused!);
  await page.getByRole("button", { name: "Resume" }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Pause", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(page.getByRole("timer")).toHaveText("25:00");
  await page.getByRole("button", { name: "Short break", exact: true }).click();
  await expect(page.getByRole("timer")).toHaveText("05:00");
  await page.getByRole("button", { name: "Long break", exact: true }).click();
  await expect(page.getByRole("timer")).toHaveText("15:00");
  await page.getByRole("button", { name: "Focus", exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `test-results/focus-${testInfo.project.name}.png`, fullPage: true });
});

test("settings save, validate, persist, and cancel without changing durations", async ({ page }) => {
  await page.goto("/focus/");
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await page.getByLabel("Focus", { exact: true }).fill("0");
  await page.getByRole("button", { name: "Save durations" }).click();
  await expect(page.getByLabel("Focus", { exact: true })).toBeVisible();
  await page.getByLabel("Focus", { exact: true }).fill("40");
  await page.getByLabel("Short break", { exact: true }).fill("8");
  await page.getByRole("button", { name: "Save durations" }).click();
  await expect(page.getByRole("timer")).toHaveText("40:00");
  await page.reload();
  await expect(page.getByRole("timer")).toHaveText("40:00");
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await page.getByLabel("Focus", { exact: true }).fill("50");
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByRole("timer")).toHaveText("40:00");
  await page.getByRole("button", { name: "Sound off", exact: true }).click();
  await expect(page.getByRole("button", { name: "Sound on", exact: true })).toHaveAttribute("aria-pressed", "true");
});

test("pop-out shares start and pause with the parent and survives parent closing", async ({ page }) => {
  await page.goto("/focus/");
  await page.getByRole("button", { name: "Start", exact: true }).click();
  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Pop out" }).click();
  const popup = await popupPromise;
  await expect(popup.getByRole("button", { name: "Pause", exact: true })).toBeVisible();
  await popup.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(page.getByRole("button", { name: "Resume" })).toBeVisible();
  await popup.getByRole("button", { name: "Resume" }).click();
  await expect(page.getByRole("button", { name: "Pause", exact: true })).toBeVisible();
  await page.close();
  await expect(popup.getByRole("button", { name: "Pause", exact: true })).toBeVisible();
  await popup.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(popup.getByRole("timer")).toHaveText("25:00");
});

test("elapsed sessions complete once and corrupt storage safely recovers", async ({ page }) => {
  await page.goto("/focus/");
  await page.evaluate(({ key, state }) => localStorage.setItem(key, JSON.stringify({ ...state, status: "running", endAt: Date.now() - 2000 })), { key: TIMER_KEY, state: initialState() });
  await page.reload();
  await expect(page.getByRole("timer")).toHaveText("00:00");
  await expect(page.getByRole("button", { name: "Start again" })).toBeVisible();
  await page.getByRole("button", { name: "Start again" }).click();
  await expect(page.getByRole("button", { name: "Pause", exact: true })).toBeVisible();
  await page.evaluate(key => localStorage.setItem(key, "invalid"), TIMER_KEY);
  await page.reload();
  await expect(page.getByRole("timer")).toHaveText("25:00");
  await expect(page.getByRole("button", { name: "Start", exact: true })).toBeVisible();
});

test("timer completes at its deadline and offers a fallback for blocked pop-outs", async ({ page }) => {
  await page.goto("/focus/");
  await page.evaluate(({ key, state }) => localStorage.setItem(key, JSON.stringify({ ...state, status: "running", endAt: Date.now() + 2500 })), { key: TIMER_KEY, state: initialState() });
  await page.reload();
  await expect(page.getByRole("button", { name: "Start again" })).toBeVisible({ timeout: 6000 });
  await expect(page.getByRole("status")).toContainText("complete");
  await page.evaluate(() => { window.open = () => null; });
  await page.getByRole("button", { name: "Pop out" }).click();
  await expect(page.getByRole("link", { name: "Open the compact timer" })).toHaveAttribute("href", "/focus/mini/");
});
