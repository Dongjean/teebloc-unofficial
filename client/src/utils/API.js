import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3001', //to delete before building
    withCredentials: true //to delete before building
});

API.interceptors.response.use(
    (res) => res,
    (err) => {
      return Promise.reject(err);
    }
  );
  
  export default API;