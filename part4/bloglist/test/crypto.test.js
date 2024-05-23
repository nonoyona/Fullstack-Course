const { test, describe } = require("node:test");
const assert = require("node:assert");
const crypto = require("../utils/crypto");
const config = require("../utils/config");

test("a hashed password is different from the original password", async () => {
	const password = "password";
	const hash = await crypto.hashPassword(password);
	assert.notStrictEqual(password, hash);
});

test("a password can be compared to its hash", async () => {
	const password = "password";
	const hash = await crypto.hashPassword(password);
	const result = await crypto.comparePassword(password, hash);
	assert.strictEqual(result, true);
});

test("a wrong password can be compared to its hash", async () => {
	const password = "password";
	const hash = await crypto.hashPassword(password);
	const result = await crypto.comparePassword("wrong password", hash);
	assert.strictEqual(result, false);
});

test("a wrong hash can be compared to a password", async () => {
	const password = "password";
	const result = await crypto.comparePassword(password, "wrong hash");
	assert.strictEqual(result, false);
});

test("two different passwords have different hashes", async () => {
	const password1 = "password1";
	const password2 = "password2";
	const hash1 = await crypto.hashPassword(password1);
	const hash2 = await crypto.hashPassword(password2);
	assert.notStrictEqual(hash1, hash2);
});

describe("tokens", () => {
	test("can be generated", () => {
		const user = {
			username: "test123",
			_id: "123456",
		};

		const token = crypto.generateToken(user);
		assert(token);
		assert.strictEqual(typeof token, "string");
	});

	test("can be verified", () => {
		const user = {
			username: "test123",
			_id: "123456",
		};

		const token = crypto.generateToken(user);
		const result = crypto.verifyToken(token, user);

		assert(result);
		assert.strictEqual(result.username, user.username);
		assert.strictEqual(result.id, user._id);
	});

	test("a wrong token cannot be verified", () => {
		config.SECRET = "wrong secret";
		const user = {
			username: "test123",
			_id: "123456",
		};
		const token = crypto.generateToken(user);
		config.SECRET = "correct secret";
		const result = crypto.verifyToken(token);
		assert(!result);
	});

	test("a wrong format token cannot be verified", () => {
		const result = crypto.verifyToken("wrong token");
		assert(!result);
	});

	test("a token can be verified with an expiration time", async () => {
		const user = {
			username: "test123",
			_id: "123456",
		};

        const token = crypto.generateToken(user, 1);
        await new Promise((resolve) => setTimeout(resolve, 1100));
        const result = crypto.verifyToken(token);
        assert(!result);
	});
});
