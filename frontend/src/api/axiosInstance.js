import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://tasktracker-i4q2.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
