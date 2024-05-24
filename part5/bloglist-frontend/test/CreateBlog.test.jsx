import { render, screen } from "@testing-library/react";
import CreateBlog from "../src/CreateBlog";
import { expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";

test("On submit, calls addBlog with correct values", async () => {
	const actor = userEvent.setup();
	const addBlogFn = vi.fn();
	const fn = () => {};

	render(<CreateBlog addBlog={addBlogFn} notify={fn} />);

	const title = "Test title";
	const author = "Test author";
	const url = "http://example.com";

	const inputs = screen.getAllByRole("textbox");
	const submitBtn = screen.getByText("Create");

	expect(inputs).toHaveLength(3);

	await actor.type(inputs[0], title);
	await actor.type(inputs[1], author);
	await actor.type(inputs[2], url);
	await actor.click(submitBtn);

	expect(addBlogFn.mock.calls).toHaveLength(1);
	const argument = addBlogFn.mock.calls[0][0];
	expect(argument.title).toBe(title);
	expect(argument.author).toBe(author);
	expect(argument.url).toBe(url);
});
