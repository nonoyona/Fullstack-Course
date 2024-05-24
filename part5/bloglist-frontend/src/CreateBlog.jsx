import PropTypes from "prop-types";
import { useState } from "react";

const CreateBlog = ({ addBlog, notify }) => {
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [url, setUrl] = useState("");

	const handleCreate = (event) => {
		event.preventDefault();
		if (!title || !author || !url) {
			notify("Please fill in all fields", "error");
			return;
		}
		setTitle("");
		setAuthor("");
		setUrl("");

		addBlog({
			title,
			author,
			url,
		});
	};

	return (
		<form onSubmit={handleCreate}>
			<h2>create new</h2>
			<p>
				title:
				<input
					type="text"
					name="title"
					id="title"
					value={title}
					onChange={(event) => setTitle(event.target.value)}
				/>
			</p>
			<p>
				author:
				<input
					type="text"
					name="author"
					id="author"
					value={author}
					onChange={(event) => setAuthor(event.target.value)}
				/>
			</p>
			<p>
				url:
				<input
					type="text"
					name="url"
					id="url"
					value={url}
					onChange={(event) => setUrl(event.target.value)}
				/>
			</p>
			<button type="submit">Create</button>
		</form>
	);
};

CreateBlog.propTypes = {
	addBlog: PropTypes.func.isRequired,
	notify: PropTypes.func.isRequired,
};

export default CreateBlog;
