const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blogs");
const User = require("../models/users");
const crypto = require("../utils/crypto");
const api = supertest(app);

const initialBlogs = [
	{
		_id: "5a422a851b54a676234d17f7",
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
		user: "5a422a851b54a676234d17f7", // testuser
		__v: 0,
	},
	{
		_id: "5a422aa71b54a676234d17f8",
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
		user: "5a422a851b54a676234d17f7", // testuser
		__v: 0,
	},
	{
		_id: "5a422b3a1b54a676234d17f9",
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		likes: 12,
		user: "5a422a851b54a676234d17f7", // testuser
		__v: 0,
	},
	{
		_id: "5a422b891b54a676234d17fa",
		title: "First class tests",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
		user: "5a422a851b54a676234d17f7", // testuser
		likes: 10,
		__v: 0,
	},
	{
		_id: "5a422ba71b54a676234d17fb",
		title: "TDD harms architecture",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
		user: "5a422a851b54a676234d17f7", // testuser
		likes: 0,
		__v: 0,
	},
	{
		_id: "5a422bc61b54a676234d17fc",
		title: "Type wars",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
		user: "5a422a851b54a676234d17f8", // another_test
		likes: 2,
		__v: 0,
	},
];

const initialUsers = [
	{
		username: "testuser",
		passwordHash:
			"$2b$10$6a2lGqj6E7Y0F7aQYJ8H5e2zjR1w1pF6mWJ5wXn0j6Q3JGz2tJb5W",
		name: "Test user",
		_id: "5a422a851b54a676234d17f7",
		__v: 0,
	},
	{
		username: "another_test",
		passwordHash:
			"$2b$10$6a2lGqj6E7Y0F7aQYJ8H5e2zjR1w1pF6mWJ5wXn0j6Q3JGz2tJb5W",
		name: "Another Test user",
		_id: "5a422a851b54a676234d17f8",
		__v: 0,
	},
];

beforeEach(async () => {
	await Blog.deleteMany({});

	let promises = initialBlogs
		.map((blog) => new Blog(blog))
		.map((blog) => blog.save());

	await Promise.all(promises);

	await User.deleteMany({});
	promises = initialUsers
		.map((user) => {
			user.blogs = initialBlogs
				.filter((blog) => blog.user === user._id)
				.map((blog) => blog._id);
			return new User(user);
		})
		.map((user) => user.save());
	await Promise.all(promises);
});

describe("blogs", () => {
	test("are returned as json", async () => {
		await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("are returned completely", async () => {
		const response = await api.get("/api/blogs");
		assert.strictEqual(response.body.length, initialBlogs.length);
		for (let blog of initialBlogs) {
			let blogOwner = initialUsers.find((u) => u._id === blog.user);
			let returnedBlog = response.body.find((b) => b.title === blog.title);
			assert.strictEqual(blog.title, returnedBlog.title);
			assert.strictEqual(blog.author, returnedBlog.author);
			assert.strictEqual(blog.url, returnedBlog.url);
			assert.strictEqual(blog.likes, returnedBlog.likes);
			assert.strictEqual(returnedBlog.user.id, blogOwner._id);
		}
	});

	test("have the id as the unique identifier", async () => {
		const response = await api.get("/api/blogs");
		for (let blog of response.body) {
			assert(blog.id);
		}
		const ids = response.body.map((blog) => blog.id);
		assert.strictEqual(ids.length, new Set(ids).size);
	});

	test("can be added", async () => {
		const newBlog = {
			title: "New blog",
			author: "New author",
			url: "http://newblog.com",
			likes: 0,
		};
		const token = crypto.generateToken(initialUsers[0]);
		await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const response = await api.get("/api/blogs");

		assert.strictEqual(response.body.length, initialBlogs.length + 1);
		const addedBlog = response.body.find(
			(blog) => blog.title === newBlog.title
		);
		assert(addedBlog);
		assert.strictEqual(addedBlog.title, newBlog.title);
		assert.strictEqual(addedBlog.author, newBlog.author);
		assert.strictEqual(addedBlog.url, newBlog.url);
		assert.strictEqual(addedBlog.likes, newBlog.likes);
	});

	test("added default likes to 0", async () => {
		const newBlog = {
			title: "New blog",
			author: "New author",
			url: "http://newblog.com",
		};
		const token = crypto.generateToken(initialUsers[0]);
		await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const response = await api.get("/api/blogs");
		const addedBlog = response.body.find(
			(blog) => blog.title === newBlog.title
		);
		assert.strictEqual(addedBlog.likes, 0);
	});

	test("are not added without title", async () => {
		const newBlog = {
			author: "New author",
			url: "http://newblog.com",
			likes: 0,
		};
		const token = crypto.generateToken(initialUsers[0]);
		await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog)
			.expect(400);

		const response = await api.get("/api/blogs");
		assert.strictEqual(response.body.length, initialBlogs.length);
	});

	test("are not added without url", async () => {
		const newBlog = {
			title: "New blog",
			author: "New author",
			likes: 0,
		};
		const token = crypto.generateToken(initialUsers[0]);
		await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog)
			.expect(400);

		const response = await api.get("/api/blogs");
		assert.strictEqual(response.body.length, initialBlogs.length);
	});

	test("have an assigned user when added", async () => {
		const newBlog = {
			title: "New blog",
			author: "New author",
			url: "http://newblog.com",
			likes: 0,
		};
		const token = crypto.generateToken(initialUsers[0]);
		const response = await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog);

		const addedBlog = response.body;

		assert(addedBlog.user);
		assert.strictEqual(addedBlog.user.username, initialUsers[0].username);
		assert.strictEqual(addedBlog.user.name, initialUsers[0].name);
	});

	test("assign themselves to a user when added", async () => {
		const newBlog = {
			title: "New blog",
			author: "New author",
			url: "http://newblog.com",
			likes: 0,
		};
		const token = crypto.generateToken(initialUsers[0]);
		const response = await api
			.post("/api/blogs")
			.set("Authorization", `Bearer ${token}`)
			.send(newBlog);

		const addedId = response.body.id;

		const users = await User.find({});
		const user = users.find(
			(user) => user.username === initialUsers[0].username
		);
		assert.strictEqual(user.blogs.length, 6);
		const addedBlog = user.blogs.find((blog) => blog.toString() === addedId);
		assert(addedBlog);
	});
});

describe("authorization", () => {
	test("fails with status code 401 (Unauthorized) if no token is provided", async () => {
		const newBlog = {
			title: "New blog",
		};
		await api.post("/api/blogs").send(newBlog).expect(401);
	});

	test("fails with status code 401 (Unauthorized) if token is invalid", async () => {
		const newBlog = {
			title: "New blog",
		};
		await api
			.post("/api/blogs")
			.set("Authorization", "Bearer invalidtoken")
			.send(newBlog)
			.expect(401);
	});
});

describe("deletion of blogs", () => {
	test("succeeds with status code 204 if id is valid", async () => {
		const blogToDelete = initialBlogs[0];
		const token = crypto.generateToken(initialUsers[0]);
		await api
			.delete(`/api/blogs/${blogToDelete._id}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(204);

		const blogsAtEnd = await Blog.find({});
		assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1);

		const titles = blogsAtEnd.map((blog) => blog.title);
		assert(!titles.includes(blogToDelete.title));
	});

	test("fails with status code 404 (Not Found) if id is malformatted", async () => {
		const token = crypto.generateToken(initialUsers[0]);
		await api
			.delete("/api/blogs/123")
			.set("Authorization", `Bearer ${token}`)
			.expect(404);

		const blogsAtEnd = await Blog.find({});
		assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
	});

	test("fails with status code 404 (Not Found) if blog does not exist", async () => {
		const id = new Blog()._id;
		const token = crypto.generateToken(initialUsers[0]);
		await api
			.delete(`/api/blogs/${id}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(404);

		const blogsAtEnd = await Blog.find({});
		assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
	});

	test("fails with status code 403 (Forbidden) if user is not the creator", async () => {
		const blogToDelete = initialBlogs[5];
		const token = crypto.generateToken(initialUsers[0]);
		await api
			.delete(`/api/blogs/${blogToDelete._id}`)
			.set("Authorization", `Bearer ${token}`)
			.expect(403);

		const blogsAtEnd = await Blog.find({});
		assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
	});

	test("fails with status code 401 (Unauthorized) if no token is provided", async () => {
		const blogToDelete = initialBlogs[0];
		await api.delete(`/api/blogs/${blogToDelete._id}`).expect(401);

		const blogsAtEnd = await Blog.find({});
		assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
	});
});

describe("updating a blog", () => {
	test("succeeds with status code 200 if id is valid", async () => {
		const blogToUpdate = initialBlogs[0];
		const updatedBlog = {
			title: "Updated title",
			likes: 100,
		};
		const response = await api
			.put(`/api/blogs/${blogToUpdate._id}`)
			.send(updatedBlog)
			.expect(200);
		const blogsAtEnd = await Blog.find({});
		assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
		let changedBlog = blogsAtEnd.find(
			(blog) => blog._id.toString() === blogToUpdate._id
		);
        changedBlog = await changedBlog.populate("user");
        changedBlog = JSON.parse(JSON.stringify(changedBlog));
		assert.strictEqual(changedBlog.title, updatedBlog.title);
		assert.strictEqual(changedBlog.likes, updatedBlog.likes);

		assert.deepStrictEqual(response.body, changedBlog);
	});

	test("fails with status code 404 (Not Found) if id is malformatted", async () => {
		const updatedBlog = {
			title: "Updated title",
			likes: 100,
		};

		await api.put("/api/blogs/123").send(updatedBlog).expect(404);

		const blogsAtEnd = await Blog.find({});
		assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
	});

	test("fails with status code 404 (Not Found) if blog does not exist", async () => {
		const updatedBlog = {
			title: "Updated title",
			likes: 100,
		};
		const id = new Blog()._id;
		await api.put(`/api/blogs/${id}`).send(updatedBlog).expect(404);

		const blogsAtEnd = await Blog.find({});
		assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
	});

	test("fails with status code 400 (Bad Request) if no body is sent", async () => {
		const blogToUpdate = initialBlogs[0];
		await api.put(`/api/blogs/${blogToUpdate._id}`).expect(400);

		const blogsAtEnd = await Blog.find({});
		assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
	});
});

after(async () => {
	await mongoose.connection.close();
});
