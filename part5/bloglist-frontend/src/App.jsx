import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Authentication from "./Authentication";
import CreateBlog from "./CreateBlog";
import Notification from "./Notification";
import Toggleable from "./components/Toggleable";

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [user, setUser] = useState(null);
	const [notification, setNotification] = useState(null);

	useEffect(() => {
		blogService
			.getAll()
			.then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
	}, []);

	const clearNotification = () => {
		setNotification(null);
	};

	const notify = (message, level = "success") => {
		setNotification({ message, level });
	};

	if (user === null) {
		return (
			<>
				<Notification
					notification={notification}
					clearNotification={clearNotification}
				/>
				<div>
					<h2>Log in to application</h2>
					<Authentication user={user} setUser={setUser} notify={notify} />
				</div>
			</>
		);
	}

	const addBlog = async (blog) => {
		const dbBlog = await blogService.create(blog);
		if (!dbBlog) {
			console.log("No blog created.");
			notify("Error creating blog", "error");
			return;
		}
		setBlogs(blogs.concat(dbBlog));
	};

	const handleLike = async (blog) => {
		console.log("Submitting like for blog: ", blog.id, blog.likes);
		const updatedBlog = await blogService.like(blog.id, blog.likes);
		console.log("Updated blog: ", updatedBlog);
		const updatedBlogs = blogs
			.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
			.sort((a, b) => b.likes - a.likes);
		setBlogs(updatedBlogs);
	};

	const handleRemove = async (blog) => {
		console.log("Removing blog: ", blog.id);
		if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
			try {
				await blogService.remove(blog.id);
				notify(`Removed blog ${blog.title} by ${blog.author}`);
				console.log("Removed blog: ", blog.id);
				const updatedBlogs = blogs.filter((blog) => blog.id !== blog.id);
				setBlogs(updatedBlogs);
			} catch (error) {
				console.error("Error removing blog: ", error);
				notify("Error removing blog", "error");
			}
		}
	};

	return (
		<div>
			<Notification
				notification={notification}
				clearNotification={clearNotification}
			/>
			<h2>blogs</h2>
			<Authentication user={user} setUser={setUser} notify={notify} />
			<Toggleable title="new blog">
				<CreateBlog addBlog={addBlog} notify={notify} />
			</Toggleable>
			<div id="blogs">
				{blogs.map((blog) => (
					<Blog
						key={blog.id}
						blog={blog}
						handleLike={() => handleLike(blog)}
						handleRemove={() => handleRemove(blog)}
						user={user}
					/>
				))}
			</div>
		</div>
	);
};

export default App;
