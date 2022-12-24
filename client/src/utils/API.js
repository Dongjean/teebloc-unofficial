import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3001',
});

API.interceptors.response.use(
    (res) => res,
    (err) => {
      return Promise.reject(err);
    }
  );
  
  export default API;