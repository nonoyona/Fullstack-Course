import axios from "axios";

const baseUrl = "http://localhost:3001/persons";

const getAll = () => {
    return axios.get(baseUrl).then((response) => {
        console.log("Data fetched", response);
        return response.data;
    });
}

const create = (newObject) => {
    console.log("Send obj to server: ", newObject);
    return axios.post(baseUrl, newObject).then((response) => response.data);
}

export default { getAll, create };