import Toggleable from "./Toggleable";
import { useState } from "react";
import blogs from "../services/blogs";
import PropTypes from "prop-types";

const Blog = ({ blog, updateBlog, notify, user }) => {
	const [showDetails, setShowDetails] = useState(false);

	const toggleVisibility = () => {
		console.log("Toggling visibility to: ", !showDetails);
		setShowDetails(!showDetails);
	};

	const handleLike = async () => {
		console.log("Submitting like for blog: ", blog.id, blog.likes);
		const updatedBlog = await blogs.like(blog.id, blog.likes);
		console.log("Updated blog: ", updatedBlog);
		updateBlog(updatedBlog);
	};

	const handleRemove = async () => {
		console.log("Removing blog: ", blog.id);
		if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
			try {
				await blogs.remove(blog.id);
				notify(`Removed blog ${blog.title} by ${blog.author}`);
				console.log("Removed blog: ", blog.id);
				updateBlog({ id: blog.id });
			} catch (error) {
				console.error("Error removing blog: ", error);
				notify("Error removing blog", "error");
			}
		}
	};

	const showRemove = blog.user?.username === user?.username;

	const toggleText = showDetails ? "hide" : "view";
	return (
		<div style={{ borderStyle: "solid", margin: 5, padding: 5 }}>
			{blog.title} {blog.author}
			<button onClick={toggleVisibility}>{toggleText}</button>
			<Toggleable show={showDetails}>
				<div>
					<p>{blog.url}</p>
					<p>
						likes {blog.likes} <button onClick={handleLike}>like</button>
					</p>
				</div>
				{blog.user ? <p>{blog.user.name}</p> : null}
				{showRemove ? <button onClick={handleRemove}>remove</button> : null}
			</Toggleable>
		</div>
	);
};

Blog.propTypes = {
	blog: PropTypes.object.isRequired,
	updateBlog: PropTypes.func.isRequired,
	notify: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
};

export default Blog;
