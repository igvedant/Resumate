import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let refreshRequest;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isPublicAuthRequest = ["/login", "/register", "/refresh", "/logout"].some(
      (path) => originalRequest?.url?.includes(`/api/auth${path}`),
    );

    if (
      !originalRequest ||
      ![401, 403].includes(status) ||
      originalRequest._retry ||
      originalRequest.skipAuthRefresh ||
      isPublicAuthRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshRequest ??= api
        .post("/api/auth/refresh", null, { skipAuthRefresh: true })
        .then(({ data }) => {
          localStorage.setItem("accessToken", data.accessToken);
          return data.accessToken;
        })
        .finally(() => {
          refreshRequest = null;
        });

      const accessToken = await refreshRequest;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("accessToken");
      return Promise.reject(refreshError);
    }
  },
);

export default api;
