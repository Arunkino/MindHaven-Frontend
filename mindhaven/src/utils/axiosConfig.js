import axios from 'axios';


//const BASEURL = import.meta.env.REACT_APP_API_BASE_URL
const axiosInstance = axios.create({
  // baseURL: 'http://api.mindhaven.site',
  baseURL:'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Remove the store import and the interceptors here

export default axiosInstance;