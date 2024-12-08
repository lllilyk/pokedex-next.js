import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://pokeapi.co/api/v2",
    timeout: 5000,
});

apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
);

export default apiClient;