import { chromium, expect, type FullConfig } from "@playwright/test";
import fs from "fs";

const loginTimeout = 24 * 60 * 60; // 1 day

async function globalSetup(config: FullConfig) {
    const metadata = fs.readFileSync("metadata.json", { encoding: "utf-8" });
    const { lastLoggedIn } = JSON.parse(metadata);
    const CI = process.env.CI;

    const isExpired =
        CI ||
        !lastLoggedIn ||
        lastLoggedIn + loginTimeout * 1000 < new Date().getTime();

    if (isExpired) {
        console.log("Cookies are expired, logging in again...");
        const { baseURL, storageState } = config.projects[0].use;
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto(baseURL as string);

        // Expect a title "to contain" a substring.
        await expect(page).toHaveTitle(/reddit/);
        await page
            .getByRole("textbox", { name: "username" })
            .fill("PropertyLow4064");
        await page
            .getByRole("textbox", { name: "password" })
            .fill("reddittest123");
        await page.getByRole("button", { name: "Log In" }).click();
        const createPostButton = page.getByText("Create post");
        await expect(createPostButton).toBeVisible();
        await page.context().storageState({ path: storageState as string });
        const loggedInDate = new Date().getTime();
        fs.writeFileSync("metadata.json", `{"lastLoggedIn": ${loggedInDate}} `);
        await browser.close();
    } else {
        console.log("Skipping login flow");
    }
}

export default globalSetup;
