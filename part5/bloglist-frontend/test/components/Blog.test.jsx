import { render, screen } from "@testing-library/react";
import Blog from "../../src/components/Blog";
import { expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";

const blog = {
	title: "Test blog",
	author: "Test author",
	url: "http://example.com",
	likes: 0,
	id: "id",
};

const user = {
	username: "testuser",
};

test("renders title and author", async () => {
	const fn = () => {};

	render(<Blog blog={blog} user={user} handleLike={fn} handleRemove={fn} />);

	screen.getByText(`${blog.title} ${blog.author}`);
	const urls = screen.queryAllByText(blog.url);
	expect(urls).toHaveLength(0);
	const likes = screen.queryAllByText(`likes ${blog.likes}`);
	expect(likes).toHaveLength(0);
});

test("renders url and likes when view is clicked", async () => {
	const fn = () => {};
	const actor = userEvent.setup();

	render(<Blog blog={blog} user={user} handleLike={fn} handleRemove={fn} />);

	const viewButton = screen.getByText("view");
	await actor.click(viewButton);
	screen.getByText(blog.url);
	screen.getByText(`likes ${blog.likes}`);
});

test("like button calls like handler", async () => {
	const fn = () => {};

	const likeFn = vi.fn();
	const actor = userEvent.setup();

	render(
		<Blog blog={blog} user={user} handleLike={likeFn} handleRemove={fn} />
	);

	const viewButton = screen.getByText("view");
	await actor.click(viewButton);
	const likeButton = screen.getByText("like");
	await actor.click(likeButton);
	await actor.click(likeButton);
	expect(likeFn.mock.calls).toHaveLength(2);
});
