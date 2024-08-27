import client from '../client'

const formClient = client;

formClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !config.url?.includes('/register') && !config.url?.includes('/login')) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'multipart/form-data';
    return config;
    },
    (error) => {
    return Promise.reject(error);
  });

export default formClient;