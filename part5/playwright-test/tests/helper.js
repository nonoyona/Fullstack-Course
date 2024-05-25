const { expect } = require("@playwright/test");

const loginAsUser = async (page, user) => {
	const form = await page.locator("form");
	const username = await form.locator("#username");
	const password = await form.locator("#password");
	await username.fill(user.username);
	await password.fill(user.password);
	await form.locator("button").click();
};

const addBlog = async (page, blog) => {
	const openFormButton = await page.getByText("new blog");
    await expect(openFormButton).toBeVisible();
	await openFormButton.click();
	const form = await page.locator("form");
	const title = await form.locator("#title");
	const author = await form.locator("#author");
	const url = await form.locator("#url");
	await title.fill(blog.title);
	await author.fill(blog.author);
	await url.fill(blog.url);
	await form.locator("button").click();
    const cancelButton = await page.getByText("Cancel");
    await cancelButton.click();
    await page.waitForTimeout(2000);
};

const logOut = async (page) => {
	const logoutButton = await page.getByText("Log out");
	await logoutButton.click();
};

const likeBlog = async (page, blog) => {
	const blogItem = await page.getByText(`${blog.title} ${blog.author}`);
	const viewButton = await blogItem.locator("button");
	await viewButton.click();
	const likeButton = await blogItem.getByText("like");
	await likeButton.click();
	const closeDetailsButton = await blogItem.getByText("hide");
	await closeDetailsButton.click();
    await page.waitForTimeout(2000);
};

module.exports = { loginAsUser, addBlog, logOut, likeBlog };
