import axios from "axios";

const baseURL = 'https://7dcgi527e7.execute-api.us-east-1.amazonaws.com/dev';
const headers = {
    Accept: 'application/json'
};

const api = axios.create({
    baseURL: baseURL,
    headers: headers
});

export { api };