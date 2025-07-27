import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5274/api", // TODO: take from env
});

export default axiosInstance;