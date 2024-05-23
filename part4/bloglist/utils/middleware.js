const User = require("../models/users");
const crypto = require("./crypto");

const userExtractor = async (request, response, next) => {
	if (request.headers.authorization === undefined) {
		next();
		return;
	}
	const token = request.headers.authorization.split(" ")[1];
	const verifiedToken = crypto.verifyToken(token);
	if (!verifiedToken) {
		next();
		return;
	}
	request.token = verifiedToken;
	const user = await User.findById(verifiedToken.id);
	if (!user) {
		next();
		return;
	}
	request.user = user;
	next();
};
module.exports = { userExtractor };
