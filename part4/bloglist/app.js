const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/auth");
const testRouter = require("./controllers/test");
const middleware = require("./utils/middleware");

const mongoUrl = config.MONGODB_URI;
mongoose
	.connect(mongoUrl)
	.then(() => {
		logger.info("Connected to MongoDB");
	})
	.catch((error) => {
		logger.error("Error connecting to MongoDB:", error.message);
	});

app.use(cors());
app.use(express.json());
app.use("/api/blogs", middleware.userExtractor, blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
if (config.TESTITNG) {
	app.use("/api/testing", testRouter);
}

module.exports = app;
