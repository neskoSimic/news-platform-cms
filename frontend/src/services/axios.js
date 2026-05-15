import axios from "axios";

const config = {
  baseURL: "http://localhost:3001",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  (request) => {
    const jwt = localStorage.getItem("token");

    if (jwt) {
      request.headers.Authorization = `Bearer ${jwt}`;
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

_axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default _axios;
