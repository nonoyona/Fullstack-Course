import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;
const setToken = (newToken) => {
	token = `bearer ${newToken}`;
};

const getAll = () => {
	const request = axios.get(baseUrl);
	return request.then((response) => response.data);
};

const create = async (newObject) => {
	const config = {
		headers: { Authorization: token },
	};
	try {
		const response = await axios.post(baseUrl, newObject, config);
    console.log("Created blog: ", response.data);
		return response.data;
	} catch (error) {
    console.error("Error creating blog: ", error);
  }
};

export default { getAll, setToken, create };
