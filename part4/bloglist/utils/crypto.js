const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("./config");

const hashPassword = async (password) => {
	const saltRounds = 10;
	return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
	return await bcrypt.compare(password, hash);
};

const generateToken = (user, expiresIn) => {
	const userForToken = {
		username: user.username,
		id: user._id,
	};
	return jwt.sign(userForToken, config.SECRET, {
		expiresIn: expiresIn ? expiresIn : 60 * 60,
	});
};

const verifyToken = (token) => {
	try {
		const result = jwt.verify(token, config.SECRET);
		return result;
	} catch (error) {
		console.log(error.message);
		return null;
	}
};

module.exports = { hashPassword, comparePassword, generateToken, verifyToken };
