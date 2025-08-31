import { test, expect } from "@playwright/test";

test.describe("Gallery Functionality Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://canada.maslabs.kr/gallery");
  });

  test("should display gallery page", async ({ page }) => {
    // Check if gallery page loads
    await expect(page.locator("h1")).toContainText("휘슬러 갤러리");
    
    // Check if main sections exist
    await expect(page.locator("h2").filter({ hasText: "사진 업로드" })).toBeVisible();
    await expect(page.locator("h2").filter({ hasText: "갤러리 통계" })).toBeVisible();
    await expect(page.locator("h2").filter({ hasText: "필터 및 정렬" })).toBeVisible();
    await expect(page.locator("h2").filter({ hasText: "사진 갤러리" })).toBeVisible();
  });

  test("should show file upload functionality", async ({ page }) => {
    // Check if file selection button exists
    await expect(page.getByRole("button", { name: "파일 선택" })).toBeVisible();
    
    // Check if upload button exists
    await expect(page.getByRole("button", { name: "사진 업로드" })).toBeVisible();
  });

  test("should show gallery statistics", async ({ page }) => {
    // Check if statistics cards are visible
    await expect(page.locator("text=총 사진 수").first()).toBeVisible();
    await expect(page.locator("text=총 용량").first()).toBeVisible();
    await expect(page.locator("text=카테고리").first()).toBeVisible();
    await expect(page.locator("text=태그 수").first()).toBeVisible();
  });

  test("should display filter options", async ({ page }) => {
    // Check if filter dropdowns exist
    await expect(page.locator("label").filter({ hasText: "카테고리" }).first()).toBeVisible();
    await expect(page.locator("label").filter({ hasText: "정렬" }).first()).toBeVisible();
    await expect(page.locator("label").filter({ hasText: "검색" }).first()).toBeVisible();
  });

  test("should display navigation links", async ({ page }) => {
    // Check if navigation links exist
    await expect(page.getByRole("link", { name: "🏠 홈으로" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "💰 실제 비용" }).first()).toBeVisible();
  });

  test("should test basic functionality", async ({ page }) => {
    // Test that page loads without errors
    await expect(page.locator("body")).toBeVisible();
    
    // Test that main content is present
    await expect(page.locator("main")).toBeVisible();
    
    console.log("Basic functionality test passed");
  });
});
