import blogs from "./services/blogs";

const CreateBlog = ({ addBlog, notify }) => {
	const handleCreate = async (event) => {
		event.preventDefault();
		const title = event.target.title.value;
		const author = event.target.author.value;
		const url = event.target.url.value;
		if (!title || !author || !url) {
			notify("Please fill in all fields", "error");
			return;
		}
		event.target.title.value = "";
		event.target.author.value = "";
		event.target.url.value = "";

		const blog = await blogs.create({ title, author, url });
		if (!blog) {
			console.log("No blog created.");
			notify("Error creating blog", "error");
			return;
		}
		addBlog(blog);
	};

	return (
		<form onSubmit={handleCreate}>
			<h2>create new</h2>
			<p>
				title:
				<input type="text" name="title" id="title" />
			</p>
			<p>
				author:
				<input type="text" name="author" id="author" />
			</p>
			<p>
				url:
				<input type="text" name="url" id="url" />
			</p>
			<button type="submit">Create</button>
		</form>
	);
};

export default CreateBlog;
