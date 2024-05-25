const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginAsUser, addBlog, logOut, likeBlog } = require("./helper");

describe("Blog app", () => {
	const user = {
		username: "testuser",
		name: "Test User",
		password: "testpasswd",
	};

	const otherUser = {
		username: "otheruser",
		name: "Other User",
		password: "otherpasswd",
	};

	const blog = {
		title: "Test Blog",
		author: "Test Author",
		url: "http://testblog.com",
	};

	const otherBlog = {
		title: "Other Blog",
		author: "Other Author",
		url: "http://otherblog.com",
	};

	const thirdBlog = {
		title: "Third Blog",
		author: "Third Author",
		url: "http://thirdblog.com",
	};

	beforeEach(async ({ page, request }) => {
		await request.post("/api/testing/reset");
		await request.post("/api/users", { data: user });
		await request.post("/api/users", { data: otherUser });
		await page.goto("/");
	});

	test("Login form is shown", async ({ page }) => {
		const form = await page.locator("form");
		await expect(form).toBeVisible();
		const [text] = await form.allTextContents();
		await expect(text).toContain("username");
		await expect(text).toContain("password");
		await expect(text).toContain("login");
	});

	describe("Login", () => {
		test("succeeds in with correct credentials", async ({ page }) => {
			const form = await page.locator("form");
			const username = await form.locator("#username");
			const password = await form.locator("#password");
			await username.fill("testuser");
			await password.fill("testpasswd");
			await form.locator("button").click();
			const successText = await page.getByText("Logged in as Test User");
			await expect(successText.first()).toBeVisible();
			const notification = await page.locator("#notification");
			await expect(notification).toHaveText("Logged in as Test User");
			await page.waitForTimeout(5000);
			await expect(notification).not.toBeVisible();
		});

		test("fails with wrong credentials", async ({ page }) => {
			const form = await page.locator("form");
			const username = await form.locator("#username");
			const password = await form.locator("#password");
			await username.fill("testuser");
			await password.fill("wrongpasswd");
			await form.locator("button").click();
			const errorText = await page.getByText("Logged in as Test User");
			await expect(errorText.first()).not.toBeVisible();
			const notification = await page.locator("#notification");
			await expect(notification).toHaveText("Invalid username or password");
		});
	});

	describe("When logged in", () => {
		beforeEach(async ({ page }) => {
			await loginAsUser(page, user);
		});

		test("A blog can be created", async ({ page }) => {
			const openFormButton = await page.getByText("new blog");
			await expect(openFormButton).toBeVisible();
			await openFormButton.click();
			const formTitle = await page.getByText("create new");
			await expect(formTitle).toBeVisible();
			const form = await page.locator("form");
			const title = await form.locator("#title");
			const author = await form.locator("#author");
			const url = await form.locator("#url");
			await title.fill(blog.title);
			await author.fill(blog.author);
			await url.fill(blog.url);
			await form.locator("button").click();
			const newBlog = await page.getByText("Test Blog Test Author");
			await expect(newBlog).toBeVisible();
		});

		describe("and a blog exists", () => {
			beforeEach(async ({ page }) => {
				await addBlog(page, blog);
			});

			test("A user can like a blog", async ({ page }) => {
				const viewButton = await page.getByText("view");
				await viewButton.click();
				const likeButton = await page.getByText("like");
				await likeButton.click();
				const likes = await page.getByText("1");
				await expect(likes).toBeVisible();
			});

			test("A user can delete a blog", async ({ page }) => {
				const viewButton = await page.getByText("view");
				await viewButton.click();
				const deleteButton = await page.getByText("remove");
				await expect(deleteButton).toBeVisible();
				page.on("dialog", async (dialog) => dialog.accept());
				await deleteButton.click();
				const deletedBlog = await page.getByText("Test Blog Test Author");
				await expect(deletedBlog).not.toBeVisible();
			});

			test("A user cannot delete a blog created by another user", async ({
				page,
				request,
			}) => {
				await logOut(page);
				await loginAsUser(page, otherUser);
				const viewButton = await page.getByText("view");
				await viewButton.click();
				const deleteButton = await page.getByText("remove");
				await expect(deleteButton).not.toBeVisible();
			});
		});

		test("Blogs are ordered by likes", async ({ page }) => {
			await addBlog(page, blog);
			await addBlog(page, otherBlog);
			await addBlog(page, thirdBlog);

			const likes = [
				[blog, 2],
				[otherBlog, 3],
				[thirdBlog, 1],
			];

			for (const [blogI, blogLikes] of likes) {
				for (let i = 0; i < blogLikes; i++) {
					await likeBlog(page, blogI);
				}
			}

			const blogs = await page.locator("#blogs");
			const blogItems = await blogs.locator(".blog-list-item").all();

			await expect(blogItems.length).toBe(3);
            await expect(blogItems[0]).toContainText(`${otherBlog.title} ${otherBlog.author}`);
            await expect(blogItems[1]).toContainText(`${blog.title} ${blog.author}`);
            await expect(blogItems[2]).toContainText(`${thirdBlog.title} ${thirdBlog.author}`);

            await blogItems[0].locator("button").click();
            await blogItems[1].locator("button").click();
            await blogItems[2].locator("button").click();

            await expect(blogItems[0]).toContainText(`likes 3`);
            await expect(blogItems[1]).toContainText(`likes 2`);
            await expect(blogItems[2]).toContainText(`likes 1`);

		});
	});
});
