import { test, expect } from "@playwright/test";

test("profile", async ({ page }) => {
    await page.goto("https://reddit.com/");
    await page
        .getByRole("button", {
            name: /User account menu/,
        })
        .click();
    await page.getByRole("link", { name: "Profile" }).click();
    const createAvatar = page.getByText("Create avatar");
    await expect(createAvatar).toBeVisible();
});
