/**
 * @packageDocumentation
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export const getToken = () => sessionStorage.getItem('token');
/*----------------------------------------------------------------*/
/* Interceptador REQUEST */
/*----------------------------------------------------------------*/
api.interceptors.request.use(async (config) => {
  const token = getToken();

  if (token !== null) {
    if (config.headers) {
      config.headers.Authorization = `${token}`;
    }
  }

  return config;
});

/*----------------------------------------------------------------*/
/* Interceptador RESPONSE */
/*----------------------------------------------------------------*/
api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // Do something with response error
    if (
      error == null ||
      error.response == null ||
      error.response.status == null ||
      error.response.status === 500
    ) {
      //window.location.href = '/sem-conexao';
      return Promise.reject(error);
    }

    // Trow errr again (may be need for some other catch)
    return Promise.reject(error);
  }
);

export default api;
