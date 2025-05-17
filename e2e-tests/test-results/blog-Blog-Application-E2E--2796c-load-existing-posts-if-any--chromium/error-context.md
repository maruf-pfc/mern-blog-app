# Test info

- Name: Blog Application E2E Tests >> should display the blog title and load existing posts (if any)
- Location: /home/maruf/Documents/development/mern-blog-app/e2e-tests/tests/blog.spec.js:17:3

# Error details

```
Error: browserType.launch: Executable doesn't exist at /home/maruf/.cache/ms-playwright/chromium_headless_shell-1169/chrome-linux/headless_shell
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers:              ║
║                                                                         ║
║     npx playwright install                                              ║
║                                                                         ║
║ <3 Playwright Team                                                      ║
╚═════════════════════════════════════════════════════════════════════════╝
```

# Test source

```ts
   1 | const { test, expect } = require("@playwright/test");
   2 |
   3 | test.describe("Blog Application E2E Tests", () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // For E2E, it's good practice to ensure a clean state if possible.
   6 |     // This might involve API calls to reset data, but for this simple example,
   7 |     // we'll rely on manual server restart or just test the flow.
   8 |     // For a real app, you'd clear posts via an API endpoint or DB utility.
   9 |     // For now, we'll assume the backend might have posts from previous runs.
  10 |     // One simple way for this demo (not ideal for real apps):
  11 |     // Delete all posts before each test scenario via API if an endpoint exists.
  12 |     // Since we don't have a DELETE all, we'll just proceed.
  13 |
  14 |     await page.goto("/"); // baseURL is http://localhost:3000
  15 |   });
  16 |
> 17 |   test("should display the blog title and load existing posts (if any)", async ({
     |   ^ Error: browserType.launch: Executable doesn't exist at /home/maruf/.cache/ms-playwright/chromium_headless_shell-1169/chrome-linux/headless_shell
  18 |     page,
  19 |   }) => {
  20 |     await expect(
  21 |       page.getByRole("heading", { name: "MERN Blog" })
  22 |     ).toBeVisible();
  23 |     await expect(
  24 |       page.getByRole("heading", { name: "Blog Posts" })
  25 |     ).toBeVisible();
  26 |
  27 |     // Wait for posts to potentially load (if any exist from a previous test or manual add)
  28 |     // This selector is generic; make it more specific if needed
  29 |     await page
  30 |       .waitForSelector('div[style*="border: 1px solid #ccc"] >> nth=0', {
  31 |         timeout: 5000,
  32 |       })
  33 |       .catch(() => {
  34 |         console.log("No posts found initially, which is okay for this test.");
  35 |       });
  36 |     // If posts are present, the above will pass. If not, it will timeout (and caught).
  37 |     // A better test might be to check for "No posts yet" if the list is empty.
  38 |     const noPostsMessage = page.getByText(
  39 |       "No posts yet. Be the first to create one!"
  40 |     );
  41 |     const firstPostCard = page
  42 |       .locator('div[style*="border: 1px solid #ccc"]')
  43 |       .first();
  44 |
  45 |     const isNoPostsVisible = await noPostsMessage.isVisible();
  46 |     if (isNoPostsVisible) {
  47 |       await expect(noPostsMessage).toBeVisible();
  48 |     } else {
  49 |       await expect(firstPostCard).toBeVisible();
  50 |     }
  51 |   });
  52 |
  53 |   test("should allow a user to create a new post and see it in the list", async ({
  54 |     page,
  55 |   }) => {
  56 |     const uniqueTitle = `My E2E Test Post ${Date.now()}`;
  57 |     const uniqueContent = "This is content written by an E2E test.";
  58 |
  59 |     // Fill out the form
  60 |     await page.getByLabel("Title:").fill(uniqueTitle);
  61 |     await page.getByLabel("Content:").fill(uniqueContent);
  62 |     await page.getByRole("button", { name: "Create Post" }).click();
  63 |
  64 |     // Wait for the post to appear in the list
  65 |     // Check for the new post title
  66 |     await expect(page.getByRole("heading", { name: uniqueTitle })).toBeVisible({
  67 |       timeout: 10000,
  68 |     });
  69 |     // Check for the new post content
  70 |     await expect(page.getByText(uniqueContent)).toBeVisible();
  71 |
  72 |     // Verify the form is cleared (optional, but good practice)
  73 |     await expect(page.getByLabel("Title:")).toHaveValue("");
  74 |     await expect(page.getByLabel("Content:")).toHaveValue("");
  75 |   });
  76 |
  77 |   test("should show an error if creating a post with empty title", async ({
  78 |     page,
  79 |   }) => {
  80 |     await page.getByLabel("Content:").fill("Some content without title");
  81 |     await page.getByRole("button", { name: "Create Post" }).click();
  82 |
  83 |     await expect(
  84 |       page.getByText("Title and content are required.")
  85 |     ).toBeVisible();
  86 |   });
  87 | });
  88 |
```