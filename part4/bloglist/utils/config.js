require("dotenv").config();

let PORT = process.env.PORT;
let MONGODB_URI = process.env.MONGODB_URI;
let SECRET = process.env.SECRET;
let TESTITNG = false;
if (process.env.NODE_ENV === "test") {
	MONGODB_URI = process.env.TEST_MONGODB_URI;
	TESTITNG = true;
    console.log("Running in test environment");
}

module.exports = {
	PORT,
	MONGODB_URI,
	SECRET,
	TESTITNG,
};
