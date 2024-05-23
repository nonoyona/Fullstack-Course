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

	const addBlog = (blog) => {
		setBlogs(blogs.concat(blog));
	};

	const updateBlog = (updatedBlog) => {
		if (!updatedBlog.title) {
			const updatedBlogs = blogs.filter((blog) => blog.id !== updatedBlog.id);
			setBlogs(updatedBlogs);
			return;
		}
		const updatedBlogs = blogs
			.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
			.sort((a, b) => b.likes - a.likes);
		setBlogs(updatedBlogs);
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
			{blogs.map((blog) => (
				<Blog key={blog.id} blog={blog} updateBlog={updateBlog} notify={notify} user={user} />
			))}
		</div>
	);
};

export default App;
