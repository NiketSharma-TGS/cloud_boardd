import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  use: { baseURL: "http://127.0.0.1:3100", channel: "chrome", trace: "retain-on-failure" },
  webServer: { command: "npx serve out -l tcp://127.0.0.1:3100 --no-clipboard", url: "http://127.0.0.1:3100", reuseExistingServer: true, env: { NO_UPDATE_CHECK: "1" } },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
});
