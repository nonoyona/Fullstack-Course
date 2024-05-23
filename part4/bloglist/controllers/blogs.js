const router = require("express").Router();
const Blog = require("../models/blogs");

router.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user");
	response.json(blogs);
});

router.post("/", async (request, response) => {
	try {
		const user = request.user;
		const blog = new Blog(request.body);
		if (!user) {
			return response
				.status(401)
				.json({ error: "Not Authenticated" });
		}
		blog.user = user._id;
		user.blogs = user.blogs.concat(blog._id);
		await user.save();
		await blog.save();
		await blog.populate("user");
		response.status(201).json(blog);
	} catch (error) {
		response.status(400).json({ error: error.message });
	}
});

router.delete("/:id", async (request, response) => {
	const user = request.user;
	if (!user) {
		return response
			.status(401)
			.json({ error: "Not Authenticated" });
	}

	try {
		const found = await Blog.findById(request.params.id);
		if (!found) {
			return response.status(404).json({ error: "blog not found" });
		}
		if (found.user.toString() !== user._id.toString()) {
			return response.status(403).json({ error: "Forbidden" });
		}
        await Blog.deleteOne({ _id: request.params.id });
		response.status(204).end();
	} catch (error) {
		if (error.name === "CastError") {
			return response.status(404).json({ error: "blog not found" });
		}
		response.status(500).json({ error: error.message });
	}
});

router.put("/:id", async (request, response) => {
	if (Object.entries(request.body).length === 0) {
		return response.status(400).json({ error: "body is empty" });
	}
	try {
		const foundBlog = await Blog.findByIdAndUpdate(
			request.params.id,
			request.body,
			{ runValidators: true }
		);
		if (!foundBlog) {
			return response.status(404).json({ error: "blog not found" });
		}
		await foundBlog.populate("user");
		response.status(200).json({ ...foundBlog.toJSON(), ...request.body });
	} catch (error) {
		if (error.name === "CastError") {
			return response.status(404).json({ error: "blog not found" });
		}
		response.status(500).json({ error: error.message });
	}
});

module.exports = router;
