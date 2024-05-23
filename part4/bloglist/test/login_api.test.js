const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);
const User = require("../models/users");
const crypto = require("../utils/crypto");
const { default: mongoose } = require("mongoose");

describe("when there is initially some users in db", () => {
	beforeEach(async () => {
		await User.deleteMany({});

		let users = [
			{
				username: "test123",
				password: "password",
				name: "Test user",
			},
			{
				username: "another_test",
				password: "password2",
				name: "Another Test user",
			},
		];

		const promises = users.map(async (user) => {
			user.passwordHash = await crypto.hashPassword(user.password);
			let newUser = new User(user);
			await newUser.save();
		});
		await Promise.all(promises);
	});

	test("Upon login, a token is returned with the username and name of the user", async () => {
		const response = await api
			.post("/api/login")
			.send({ username: "test123", password: "password" })
			.expect(200)
			.expect("Content-Type", /application\/json/);
		assert(response.body.token);
		assert.strictEqual(typeof response.body.token, "string");
		assert.strictEqual(response.body.username, "test123");
		assert.strictEqual(response.body.name, "Test user");
	});

    test("Upon login with wrong password, a 401 status code is returned", async () => {
        await api
            .post("/api/login")
            .send({ username: "test123", password: "wrong password" })
            .expect(401)
    });

    test("Upon login with wrong username, a 401 status code is returned", async () => {
        await api
            .post("/api/login")
            .send({ username: "wrong username", password: "password" })
            .expect(401)
    });

});

after(async () => {
	await mongoose.connection.close();
});
