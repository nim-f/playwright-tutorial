import { test, expect } from "@playwright/test";
import { randomBytes } from "crypto";
import { Post } from "../page-object-models/post-model";

test("post", async ({ page }) => {
    await page.goto("https://reddit.com/submit");
    await page.getByText(/Accept/).click();

    const post = new Post(page);

    await post.chooseCommunity("u/PropertyLow4064");

    const randomString = randomBytes(20).toString("hex");
    const randomPostName = `Our test post -  ${randomString}`;
    const randomPostText = `Our test post text - ${randomString}`;

    await post.createPost(randomPostName, randomPostText);
    await post.deletePost();
});
