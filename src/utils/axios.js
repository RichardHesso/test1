import axios from 'axios';

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && {data: error.response.data, status: error.response.status}) || 'Something went wrong')
);

export default axiosInstance;
