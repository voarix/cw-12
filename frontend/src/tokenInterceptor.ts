import { store } from "./app/store.ts";
import { setAccessToken, unsetUser } from "./features/users/usersSlice.ts";
import axiosAPI from "./axiosApi.ts";

axiosAPI.interceptors.request.use((config) => {
  const token = store.getState().users.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axiosAPI.post("/users/refresh-token");
        const newToken = res.data.accessToken;
        store.dispatch(setAccessToken(newToken));
      } catch (e) {
        store.dispatch(unsetUser());
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  },
);
