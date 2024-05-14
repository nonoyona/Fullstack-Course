import axios from "axios";

const baseUrl = "/api/persons";

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

const remove = (id) => {
    console.log("Remove obj from server: ", id);
    return axios.delete(`${baseUrl}/${id}`);
}

const update = (id, newObject) => {
    console.log("Update obj on server: ", id, newObject);
    return axios.put(`${baseUrl}/${id}`, newObject).then((response) => response.data);
}

export default { getAll, create, remove, update };