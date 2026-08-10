import assert from "node:assert/strict";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseUrl = "http://localhost:3000";
const email = `frontend-smoke-${Date.now()}@example.com`;
const errors = [];
const executablePath = path.join(
  process.env.LOCALAPPDATA,
  "ms-playwright/chromium-1234/chrome-win64/chrome.exe",
);
const browser = await chromium.launch({ headless: true, executablePath });

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  desktop.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await desktop.goto(baseUrl, { waitUntil: "networkidle" });
  await desktop.screenshot({ path: "artifacts/home-desktop.png", fullPage: true });
  assert.equal(await desktop.locator("h1").first().textContent(), "Freelance talent for work that matters.");
  assert.equal(await desktop.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, "desktop has no horizontal overflow");
  assert.equal(await desktop.evaluate(() => document.querySelector(".hero")?.getBoundingClientRect().bottom < window.innerHeight), true, "desktop reveals the next section");

  await desktop.goto(`${baseUrl}/services`, { waitUntil: "networkidle" });
  assert.equal(await desktop.locator("h1").textContent(), "Find the right specialist.");

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  mobile.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await mobile.goto(baseUrl, { waitUntil: "networkidle" });
  await mobile.screenshot({ path: "artifacts/home-mobile.png", fullPage: true });
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, "mobile has no horizontal overflow");
  assert.equal(await mobile.evaluate(() => document.querySelector(".hero")?.getBoundingClientRect().bottom < window.innerHeight), true, "mobile reveals the next section");

  await desktop.goto(`${baseUrl}/register`);
  await desktop.getByLabel("Full name").fill("Frontend Smoke Client");
  await desktop.getByLabel("Email address").fill(email);
  await desktop.getByLabel("Password").fill("StrongPassword123");
  await desktop.getByLabel("I want to").selectOption("CLIENT");
  await desktop.getByRole("button", { name: "Create account" }).click();
  await desktop.waitForURL("**/login");
  await desktop.getByLabel("Email address").fill(email);
  await desktop.getByLabel("Password").fill("StrongPassword123");
  await desktop.getByRole("button", { name: "Log in" }).click();
  await desktop.waitForURL("**/dashboard/client");
  await desktop.getByText("Client workspace").waitFor();
  await desktop.getByText("No orders yet").waitFor();
  await desktop.screenshot({ path: "artifacts/client-dashboard.png", fullPage: true });
  assert.equal(await desktop.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, "dashboard has no horizontal overflow");

  assert.deepEqual(errors, [], `browser console errors: ${errors.join(" | ")}`);
  console.log(JSON.stringify({ success: true, email, screenshots: 3 }));
} finally {
  await browser.close();
}
