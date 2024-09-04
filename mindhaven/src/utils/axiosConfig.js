import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "https://api.mindhaven.site",
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Remove the store import and the interceptors here

export default axiosInstance;
