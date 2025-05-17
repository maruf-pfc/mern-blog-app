const { test, expect } = require("@playwright/test");

test.describe("Blog Application E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // For E2E, it's good practice to ensure a clean state if possible.
    // This might involve API calls to reset data, but for this simple example,
    // we'll rely on manual server restart or just test the flow.
    // For a real app, you'd clear posts via an API endpoint or DB utility.
    // For now, we'll assume the backend might have posts from previous runs.
    // One simple way for this demo (not ideal for real apps):
    // Delete all posts before each test scenario via API if an endpoint exists.
    // Since we don't have a DELETE all, we'll just proceed.

    await page.goto("/"); // baseURL is http://localhost:3000
  });

  test("should display the blog title and load existing posts (if any)", async ({
    page,
  }) => {
    await expect(
      page.getByRole("heading", { name: "MERN Blog" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Blog Posts" })
    ).toBeVisible();

    // Wait for posts to potentially load (if any exist from a previous test or manual add)
    // This selector is generic; make it more specific if needed
    await page
      .waitForSelector('div[style*="border: 1px solid #ccc"] >> nth=0', {
        timeout: 5000,
      })
      .catch(() => {
        console.log("No posts found initially, which is okay for this test.");
      });
    // If posts are present, the above will pass. If not, it will timeout (and caught).
    // A better test might be to check for "No posts yet" if the list is empty.
    const noPostsMessage = page.getByText(
      "No posts yet. Be the first to create one!"
    );
    const firstPostCard = page
      .locator('div[style*="border: 1px solid #ccc"]')
      .first();

    const isNoPostsVisible = await noPostsMessage.isVisible();
    if (isNoPostsVisible) {
      await expect(noPostsMessage).toBeVisible();
    } else {
      await expect(firstPostCard).toBeVisible();
    }
  });

  test("should allow a user to create a new post and see it in the list", async ({
    page,
  }) => {
    const uniqueTitle = `My E2E Test Post ${Date.now()}`;
    const uniqueContent = "This is content written by an E2E test.";

    // Fill out the form
    await page.getByLabel("Title:").fill(uniqueTitle);
    await page.getByLabel("Content:").fill(uniqueContent);
    await page.getByRole("button", { name: "Create Post" }).click();

    // Wait for the post to appear in the list
    // Check for the new post title
    await expect(page.getByRole("heading", { name: uniqueTitle })).toBeVisible({
      timeout: 10000,
    });
    // Check for the new post content
    await expect(page.getByText(uniqueContent)).toBeVisible();

    // Verify the form is cleared (optional, but good practice)
    await expect(page.getByLabel("Title:")).toHaveValue("");
    await expect(page.getByLabel("Content:")).toHaveValue("");
  });

  test("should show an error if creating a post with empty title", async ({
    page,
  }) => {
    await page.getByLabel("Content:").fill("Some content without title");
    await page.getByRole("button", { name: "Create Post" }).click();

    await expect(
      page.getByText("Title and content are required.")
    ).toBeVisible();
  });
});
