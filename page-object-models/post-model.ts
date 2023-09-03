import { expect, type Locator, type Page } from "@playwright/test";

export class Post {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async chooseCommunity(community: string) {
        await this.page.getByPlaceholder("Choose a community").click();
        await this.page.getByText(community).click();
    }

    async createPost(title: string, text: string) {
        await this.page.getByPlaceholder("Title").fill(title);
        await this.page.locator("css=.public-DraftEditor-content").fill(text);

        await this.page
            .getByRole("button", { name: "Post", exact: true })
            .click();
        const titleLocator = this.page.getByText(title);
        const textLocator = this.page.getByText(text);
        await expect(titleLocator).toBeVisible();
        await expect(textLocator).toBeVisible();
    }

    async deletePost() {
        await this.page
            .getByTestId("post-container")
            .getByLabel("more options")
            .click();
        await this.page.getByRole("menuitem", { name: "delete" }).click();
        await this.page.getByRole("button", { name: "Delete post" }).click();
        const toastSuccess = this.page.getByText("Post deleted successfully");
        await expect(toastSuccess).toBeVisible();
    }
}
