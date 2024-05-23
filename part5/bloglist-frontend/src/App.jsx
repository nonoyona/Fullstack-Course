import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Authentication from "./Authentication";
import CreateBlog from "./CreateBlog";
import Notification from "./Notification";

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [user, setUser] = useState(null);
	const [notification, setNotification] = useState(null);

	useEffect(() => {
		blogService.getAll().then((blogs) => setBlogs(blogs));
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

	return (
		<div>
			<Notification
				notification={notification}
				clearNotification={clearNotification}
			/>
			<h2>blogs</h2>
			<Authentication user={user} setUser={setUser} notify={notify} />
			<CreateBlog addBlog={addBlog} notify={notify} />
			{blogs.map((blog) => (
				<Blog key={blog.id} blog={blog} />
			))}
		</div>
	);
};

export default App;
