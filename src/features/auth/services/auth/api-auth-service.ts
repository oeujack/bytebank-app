import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export const getToken = () => sessionStorage.getItem('token');
/*----------------------------------------------------------------*/
/* Interceptador REQUEST */
/*----------------------------------------------------------------*/
api.interceptors.request.use(
  async (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
/*----------------------------------------------------------------*/
/* Interceptador RESPONSE */
/*----------------------------------------------------------------*/
api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (
      error == null ||
      error.response == null ||
      error.response.status == null ||
      error.response.status === 500
    ) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
