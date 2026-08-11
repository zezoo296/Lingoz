import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Something went wrong";

            return Promise.reject(new Error(message));
        }

        return Promise.reject(error);
    },
);

export default api;
