import axios from "axios";
import { apiUrl } from "./globalConstants.ts";

const axiosAPI = axios.create({
  baseURL: apiUrl,
});

axiosAPI.defaults.withCredentials = true;

export default axiosAPI;
