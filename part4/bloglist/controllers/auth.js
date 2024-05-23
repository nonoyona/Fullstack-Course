const crypto = require("../utils/crypto");
const router = require("express").Router();
const User = require("../models/users");

router.post("/", async (request, response) => {
	const { username, password } = request.body;
	const user = await User.findOne({ username });
	if (!user) {
		return response.status(401).json({ error: "invalid username or password" });
	}
	const passwordCorrect = await crypto.comparePassword(
		password,
		user.passwordHash
	);
	if (!passwordCorrect) {
		return response.status(401).json({ error: "invalid username or password" });
	}

	const token = crypto.generateToken(user);
	response
		.status(200)
		.send({ token, username: user.username, name: user.name });
});

module.exports = router;
