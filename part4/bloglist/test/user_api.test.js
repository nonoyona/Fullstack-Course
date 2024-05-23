const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/users");
const Blog = require("../models/blogs");
const crypto = require("../utils/crypto");

describe("when there is initially some users in db", () => {

    beforeEach(async () => {
        await User.deleteMany({});
        await Blog.deleteMany({});

        let password = await crypto.hashPassword("password");
        let user = new User({ username: "test123", passwordHash: password, name: "Test user" });
        const userId = user._id;
        let password2 = await crypto.hashPassword("password2");
        let user2 = new User({ username: "another_test", passwordHash: password2, name: "Another Test user" });
        await user2.save();

        const initialBlogs = [
            {
                _id: "5a422a851b54a676234d17f7",
                title: "React patterns",
                author: "Michael Chan",
                url: "https://reactpatterns.com/",
                user: userId,
                likes: 7,
                __v: 0
            },
            {
                _id: "5a422aa71b54a676234d17f8",
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 5,
                __v: 0
            },
            {
                _id: "5a422b3a1b54a676234d17f9",
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
                likes: 12,
                __v: 0
            }
        ]

        const blogs = initialBlogs.map(blog => new Blog(blog));
        user.blogs = blogs.map(blog => blog._id);
        await user.save();
        const promises = blogs.map(blog => blog.save());
        await Promise.all(promises);

        assert.strictEqual((await Blog.find({})).length, 3);

    })

    describe("when adding a new user", () => {

        test("the response type is json", async () => {
            await api
                .post("/api/users")
                .send({ username: "testuser", password: "password", name: "Test user" })
                .expect(201)
                .expect("Content-Type", /application\/json/)
        })

        test("the response contains the created user", async () => {
            const response = await api
                .post("/api/users")
                .send({ username: "testuser", password: "password", name: "Test user2" })
            assert.strictEqual(response.body.username, "testuser");
            assert.strictEqual(response.body.name, "Test user2");
            assert(response.body.id);
        })

        test("with a password less than 3 characters, the response code is 400 (Bad Request)", async () => {
            await api
                .post("/api/users")
                .send({ username: "testuser", password: "pa", name: "Test user2" })
                .expect(400)
        })

        test("with a username less than 3 characters, the response code is 400 (Bad Request)", async () => {
            await api
                .post("/api/users")
                .send({ username: "te", password: "password", name: "Test user2" })
                .expect(400)
        })

        test("with an already existing username, the response code is 409 (Conflict)", async () => {
            await api
                .post("/api/users")
                .send({ username: "test123", password: "password", name: "Test user2" })
                .expect(409)
        })

        test("the user is added to the database", async () => {
            const usersBefore = await User.find({});
            await api
                .post("/api/users")
                .send({ username: "testuser", password: "password", name: "Test user2" })
            const usersAfter = await User.find({});
            assert.strictEqual(usersAfter.length, usersBefore.length + 1);
            const addedUser = usersAfter.find(user => user.username === "testuser");
            assert.strictEqual(addedUser.name, "Test user2")
            assert.strictEqual(addedUser.username, "testuser")
            assert.strictEqual(await crypto.comparePassword("password", addedUser.passwordHash), true)

        })




    })

    describe("when getting all users", () => {

        test("all users are returned", async () => {
            const response = await api.get("/api/users").expect(200).expect("Content-Type", /application\/json/);
            assert.strictEqual(response.body.length, 2);
        })

        test("all users have the id field", async () => {
            const response = await api.get("/api/users");
            for (let user of response.body) {
                assert(user.id);
            }
        })

        test("all users have the blogs field and have assigned blogs", async () => {
            const response = await api.get("/api/users");
            let sum = 0;
            for (let user of response.body) {
                assert(user.blogs);
                sum += user.blogs.length;
            }
            assert.strictEqual(sum, 3);
        })

    })

})

after(async () => {
    await mongoose.connection.close();
})