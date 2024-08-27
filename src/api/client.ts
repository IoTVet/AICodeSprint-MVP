import axios from 'axios';

let baseUrl;
if (process.env.NODE_ENV === 'production') {
    baseUrl = 'https://work-odyssey-backend-3h58t.ondigitalocean.app';
} else {
    baseUrl = 'http://localhost:8000';
}

const client = axios.create({
  baseURL:  baseUrl,
  withCredentials: true, // This is important for CORS with credentials
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !config.url?.includes('/register') && !config.url?.includes('/login')) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    //config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      window.dispatchEvent(new CustomEvent('unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default client;