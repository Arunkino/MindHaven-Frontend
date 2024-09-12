import axios from 'axios';


//const BASEURL = import.meta.env.REACT_APP_API_BASE_URL
const axiosInstance = axios.create({
// baseURL: 'http://api.mindhaven.site',
  baseURL: "https://api.mindhaven.site",
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Remove the store import and the interceptors here

export default axiosInstance;
