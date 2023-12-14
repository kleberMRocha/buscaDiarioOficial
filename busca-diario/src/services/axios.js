import axios from 'axios';

const url = 'http://localhost:7070/';

const axiosInstance = axios.create({ baseURL: url });

export default axiosInstance;