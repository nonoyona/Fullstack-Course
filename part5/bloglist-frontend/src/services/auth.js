import axios from "axios";
import blogs from "./blogs";

const baseUrl = "/api/login";

const login = async (credentials) => {
	try {
		const response = await axios.post(baseUrl, credentials);
		console.log("Logged in with response: ", response.data);
		blogs.setToken(response.data.token);
		window.localStorage.setItem(
			"loggedBlogAppUser",
			JSON.stringify(response.data)
		);
		console.log("Saved user to local storage: ", response.data.username);
		return response.data;
	} catch (error) {
		console.error("Error logging in: ", error);
		return null;
	}
};

const loadFromLocalStorage = () => {
	const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
	if (loggedUserJSON) {
		const user = JSON.parse(loggedUserJSON);
		
		console.log("Loaded user from local storage: ", user);
		blogs.setToken(user.token);
        return user;
	}
    return null;
};

const logout = () => {
	window.localStorage.removeItem("loggedBlogAppUser");
    blogs.setToken(null);
	console.log("Logged out");
};

export default { login, loadFromLocalStorage, logout };
