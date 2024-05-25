import Toggleable from "./Toggleable";
import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, handleLike, handleRemove, user }) => {
	const [showDetails, setShowDetails] = useState(false);

	const toggleVisibility = () => {
		console.log("Toggling visibility to: ", !showDetails);
		setShowDetails(!showDetails);
	};

	const showRemove = blog.user?.username === user?.username;

	const toggleText = showDetails ? "hide" : "view";
	return (
		<div className="blog-list-item" style={{ borderStyle: "solid", margin: 5, padding: 5 }}>
			{blog.title} {blog.author}
			<button onClick={toggleVisibility}>{toggleText}</button>
			<Toggleable show={showDetails}>
				<div id={`blog-content-${blog.id}`}>
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
	handleLike: PropTypes.func.isRequired,
	handleRemove: PropTypes.func.isRequired,
	user: PropTypes.object.isRequired,
};

export default Blog;
